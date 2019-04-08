import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { RestApiService } from 'app/rest-api.service';
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  book:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public restApi: RestApiService
  ) { }

  ngOnInit() {
    this.getDetail();
  }

  getDetail(){
    let id = this.activatedRoute.snapshot.params['id'];

    this.restApi.getDetailBook(id).subscribe((results) => {
      console.log(results);
      this.book = results;
    })
  }

}
