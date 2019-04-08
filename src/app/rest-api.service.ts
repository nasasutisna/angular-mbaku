import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  apiUrl:string = 'http://localhost/api-mbaku/public/api/v1/';
  public url:string = 'http://localhost/api-mbaku/';
  constructor(public http: HttpClient) { }

  getDataBuku(category:any='', keyword:any = ''){
    return this.http.get(this.apiUrl + `dashboard/getBookList?category=${category}&keyword=${keyword}`);
  }

  getCategories(){
    return this.http.get(this.apiUrl + `dashboard/getCategories`);
  }

  getDetailBook(id){
    return this.http.get(this.apiUrl + `book/detail/${id}`);
  }
}
