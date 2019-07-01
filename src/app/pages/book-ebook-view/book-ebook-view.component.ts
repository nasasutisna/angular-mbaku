import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'app/service/rest-api.service';
import { GlobalService } from 'app/global.service';
import * as uuid from 'uuid';
import { NotifService } from 'app/service/notif.service';

declare var snap:any;

@Component({
  selector: 'app-book-ebook-view',
  templateUrl: './book-ebook-view.component.html',
  styleUrls: ['./book-ebook-view.component.scss']
})
export class BookEbookViewComponent implements OnInit {

  book: any;
  bookId: any;
  intervalCheckStatus: any;
  totalPage: any;
  myRate: any = 0;
  isPendingPayment: boolean=false;
  isFirst: boolean=true;
  isSettlement: boolean=false;

  statusOrder:any = {};
  paramsOrder = {
    full_name: '',
    email: '',
    phone: '',
    kode_buku: '',
    judul: '',
    price: ''
  }

  constructor(public router: Router,
    public globalService: GlobalService,
    public activatedRoute: ActivatedRoute,
    public restApi: RestApiService,
    public notifService: NotifService,
    public ngZone: NgZone
  ) {

  //   window.addEventListener("message", function(ev) {
  //     if (ev.data.message === "deliverResult") {
  //         alert("result: " + ev.data.result);
  //         // ev.source.close();
  //     }
  //  });

    let auth = JSON.parse(localStorage.getItem('authentication'));
    if (!auth) {
      this.router.navigateByUrl('/login');
    }
    this.bookId = this.activatedRoute.snapshot.params['id'];
    this.checkMyRate();
  }

  ngOnInit() {
    this.getDetail();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalCheckStatus);
  }

  async openSnap(){

    let auth:any = JSON.parse(localStorage.getItem('user'));
    
    let existsPending = await this.checkOrderPending();
    if(existsPending){
      return false;
    }

    this.paramsOrder.full_name = auth.nama_lengkap;
    this.paramsOrder.email = auth.email;
    this.paramsOrder.phone = auth.phone;
    this.paramsOrder.kode_buku = this.book.kode_buku;
    this.paramsOrder.judul = this.book.judul;
    this.paramsOrder.price = this.book.harga_ebook;

    this.restApi.orderEbook(this.paramsOrder).subscribe((result:any) => {
      snap.pay(result.token, {
        onSuccess: (response) =>{
          console.log('sukses');
          this.getStatusOrder(response.token);
          this.ngZone.run(() => {
            this.isSettlement = true;
          }) 
        },
        onPending: (response) =>{
          console.log('sukses 2');
          if(response.payment_type != 'gopay'){
            console.log('sukses 3');
            this.getStatusOrder(response.token);
          }
        },
        onError: (response)=>{
        },
        onClose: ()=>{
          console.log('customer closed the popup without finishing the payment')
        }
    });
    }); 

   
  }

  handlePageEbook(e) {
    this.totalPage = e;
  }

  getDetail() {
    this.restApi.getDetailBook(this.bookId).subscribe(async(results) => {
      this.book = results;
      if(this.book.harga_ebook > 0){
       let order =  await this.checkOrderBookPending();
       if(order.data.length > 0){
         order.data.forEach(element => {
         if(element.transaction_status == 'pending'){
           this.isPendingPayment = true;
           this.isFirst = false;
           this.intervalCheckStatus = setInterval(() => {
            this.restApi.checkStatusOrder(element.transaction_token).subscribe((result:any) => {
              if(result.transaction_status == 'settlement'){
                this.isPendingPayment = false;
                let params = {
                  transaction_token: result.token,
                  transaction_status: result.transaction_status,
                }
                
                this.isSettlement = true
                this.isPendingPayment = false
                this.isFirst = false

                this.restApi.updateOrder(params).subscribe((result) => {
                })
                clearInterval(this.intervalCheckStatus);
              }
            })
           },5000);
         }
         else if(element.transaction_status == 'settlement'){
           this.isSettlement = true
           this.isPendingPayment = false
           this.isFirst = false
         }
         else{
           this.isPendingPayment = false;
           this.isSettlement = false;
           this.isFirst = true;
         }
                               
        });
       }
       else{
        this.isFirst = true;
        this.isPendingPayment = false;
        this.isSettlement = false;
       }
      }
    })
  }

  async beliEbook() {
    let auth:any = JSON.parse(localStorage.getItem('user'));
    
    let existsPending = await this.checkOrderPending();
    if(existsPending){
      return false;
    }

    this.paramsOrder.full_name = auth.nama_lengkap;
    this.paramsOrder.email = auth.email;
    this.paramsOrder.phone = auth.phone;
    this.paramsOrder.kode_buku = this.book.kode_buku;
    this.paramsOrder.judul = this.book.judul;
    this.paramsOrder.price = this.book.harga_ebook;

    this.restApi.orderEbook(this.paramsOrder).subscribe((result:any) => {
      let newWindow = window.open(result.redirect_url, '_blank', 'width=600,height=500,left=200,top=100');
      newWindow.focus();
      var leftDomain = false;
    var interval = setInterval(() => {
        try {
            if (newWindow.document.domain === document.domain)
            {
                if (leftDomain && newWindow.document.readyState === "complete")
                {
                    // we're here when the newWindow window returned to our domain
                    clearInterval(interval);
                    // alert("returned: " + newWindow.document.URL);
                    this.getStatusOrder(result.token);
                    newWindow.postMessage({ message: "requestResult" }, "*");
                }
            }
            else {
                // this code should never be reached, 
                // as the x-site security check throws
                // but just in case
                leftDomain = true;
            }
        }
        catch(e) {
            // we're here when the newWindow window has been navigated away or closed
            if (newWindow.closed) {
                this.getStatusOrder(result.token);
                clearInterval(interval);
            }
            // navigated to another domain  
            leftDomain = true;
        }
    }, 500);

      
    })
  }

  gotoHistory(){
    this.router.navigateByUrl("history");
  }

  getStatusOrder(token){
    this.restApi.checkStatusOrder(token).subscribe((result:any) => {
      console.log(result);
      let auth:any = JSON.parse(localStorage.getItem('user'));
      if(typeof result.error_messages != 'undefined'){
        this.notifService.showMessage(result.error_messages[0],'warning','bottom');
      }
      else{
        this.statusOrder = result;
        let params = {
          kode_anggota: auth.kode_anggota,
          kode_buku: this.book.kode_buku,
        }

        params = Object.assign(this.statusOrder, params);
        this.restApi.transactionStore(params).subscribe((result) => {
          console.log('save',result);
        })
      }
    })
  }

  checkOrderPending() : Promise<any>{
    return new Promise((resolve) => {
      let auth:any = JSON.parse(localStorage.getItem('user'));
      let params = {
        kode_anggota :  auth.kode_anggota,
        kode_buku :  this.book.kode_buku,
      }
  
      this.restApi.checkOrderPending(params).subscribe((result) => {
        resolve(false);
      }, err => {
        this.notifService.showMessage(err.error.message,'warning','bottom');
        resolve(true);
      });      
    })
  }

  checkOrderBookPending() : Promise<any>{
    return new Promise((resolve) => {
      let auth:any = JSON.parse(localStorage.getItem('user'));
      let params = {
        kode_anggota :  auth.kode_anggota,
        kode_buku :  this.book.kode_buku,
      }
  
      this.restApi.checkOrderBookPending(params).subscribe((result:any) => {
        resolve(result);
      }, err => {
        this.notifService.showMessage(err.error.message,'warning','bottom');
        resolve(false);
      });      
    })
  }

  goto(page: string) {
    if (page == 'dashboard') {
      this.router.navigate(['/' + page]);
    }
    else if (page == 'detail') {
      this.router.navigate(['/book/', this.bookId]);
    }
  }

  download(ebook, fileName) {
    this.globalService.download(ebook, fileName);
  }

  checkMyRate() {
    let user = JSON.parse(localStorage.getItem('user'));
    let formData = {
      kode_anggota: user.kode_anggota,
      kode_buku: this.bookId
    }

    this.restApi.checkMyRate(formData).subscribe((result: any) => {
      console.log(result);
      this.myRate = result.myRate;
    }, err => {
      console.log(err);
    })
  }

  addRatting() {
    let rate = (this.myRate) ? 0 : 1;

    let user = JSON.parse(localStorage.getItem('user'));
    let formData = {
      kode_anggota: user.kode_anggota,
      kode_buku: this.bookId,
      rate: rate
    }

    this.restApi.addRatting(formData).subscribe((result) => {
      console.log(result);
      this.myRate = rate;
    }, err => {
      console.log(err);
    })
  }



}
