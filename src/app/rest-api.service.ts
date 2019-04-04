import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  apiUrl:string = 'http://localhost/api-mbaku/public/api/v1/';
  constructor(public http: HttpClient) { }

  getData(tableModule:string=''){
    return this.http.get(this.apiUrl + tableModule);
  }
}
