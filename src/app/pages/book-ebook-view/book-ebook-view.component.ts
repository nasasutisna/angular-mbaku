import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'app/service/rest-api.service';
import { GlobalService } from 'app/global.service';

@Component({
  selector: 'app-book-ebook-view',
  templateUrl: './book-ebook-view.component.html',
  styleUrls: ['./book-ebook-view.component.scss']
})
export class BookEbookViewComponent implements OnInit {

  book:any;
  bookId:any;
  totalPage:any;
  myRate:any = 0;

  constructor(public router: Router, public globalService: GlobalService, public activatedRoute: ActivatedRoute, public restApi: RestApiService) { 
    let auth = JSON.parse(localStorage.getItem('authentication'));
    if(!auth){
      this.router.navigateByUrl('/login');
    }
    this.bookId = this.activatedRoute.snapshot.params['id'];
    this.checkMyRate();
  }

  ngOnInit() {
    this.getDetail();
  }

  handlePageEbook(e){
    this.totalPage = e;
  }

  getDetail(){
    this.restApi.getDetailBook(this.bookId).subscribe((results) => {
      console.log(results);
      this.book = results;
    })
  }

  goto(page:string){
    if(page == 'dashboard'){
      this.router.navigate(['/'+page]);
    }
    else if(page == 'detail'){
      this.router.navigate(['/book/',this.bookId]);
    }
  }

  download(ebook, fileName){
    this.globalService.download(ebook,fileName);
  }

  checkMyRate(){
    let user = JSON.parse(localStorage.getItem('user'));
    let formData = {
      kode_anggota : user.kode_anggota,
      kode_buku : this.bookId
    }

    this.restApi.checkMyRate(formData).subscribe((result:any) => {
      console.log(result);
      this.myRate = result.myRate;
    },err => {
      console.log(err);
    })
  }

  addRatting(){
    let rate = (this.myRate) ? 0 : 1;

    let user = JSON.parse(localStorage.getItem('user'));
    let formData = {
      kode_anggota : user.kode_anggota,
      kode_buku : this.bookId,
      rate:rate
    }

    this.restApi.addRatting(formData).subscribe((result) => {
      console.log(result);
      this.myRate = rate;
    }, err => {
      console.log(err);
    })
  }

}
