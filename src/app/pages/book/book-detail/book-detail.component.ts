import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from 'app/service/rest-api.service';
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  book:any;
  categoryList:any;
  bookId:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public restApi: RestApiService
  ) {
    this.bookId = this.activatedRoute.snapshot.params['id'];
   }

  ngOnInit() {
    this.getDetail(this.bookId);
  }

  getDetail(bookId){
    this.restApi.getDetailBook(bookId).subscribe((results) => {
      this.book = results;
      this.restApi.getBookByCategory(this.book.kode_kategori).subscribe((data) => {
        this.categoryList = data;
      })
    })
  }

  gotoEbook(bookId){
    this.router.navigate(['/ebook/',bookId]);
  }

  gotoDetail(bookId){
    this.getDetail(bookId);
  }

}
