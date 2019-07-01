import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'app/service/rest-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifService } from 'app/service/notif.service';
import { GlobalService } from 'app/global.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  orderList:any = [];
  intervalCheckStatus:any;
  isCancel:boolean;
  constructor(
    public restApi: RestApiService,
    public router: Router,
    public route: ActivatedRoute,
    public notifService: NotifService,
    public globalService: GlobalService
  ) { }

  ngOnInit() {
    this.getTrxOrderByAnggota();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'impl ements OnDestroy' to the class.
    clearInterval(this.intervalCheckStatus);
  }

  getTrxOrderByAnggota(){
    let auth = JSON.parse(localStorage.getItem('user'));
    this.restApi.getOrderByAnggota(auth.kode_anggota).subscribe((result:any) => {
      this.orderList = result.data;
      if(result.data.length > 0){
        this.orderList.forEach(element => {
          if(element.transaction_status == 'pending'){
            this.intervalCheckStatus = setInterval(() => {
              this.restApi.checkStatusOrder(element.transaction_token).subscribe((response:any) => {
                if(response.transaction_status != 'pending'){
                  let params = {
                    transaction_token: response.token,
                    transaction_status: response.transaction_status,
                  }
          
                  this.restApi.updateOrder(params).subscribe((res) => {
                    this.getTrxOrderByAnggota();
                  })
                  clearInterval(this.intervalCheckStatus);
                }
              })
             },5000);
          }
        });
      }
    })
  }

  download(ebook, fileName) {
    this.globalService.download(ebook, fileName);
  }

  cancelConfirm(){
    this.isCancel = true;
  }

  cancelLose(){
    this.isCancel = false;
  }

  cancelOrder(orderId){
    this.restApi.cancelOrder(orderId).subscribe((result) => {
      this.isCancel = false;
      this.notifService.showMessage("Pemesanan Berhasil dibatalkan",'success','bottom');
    })
  }
}
