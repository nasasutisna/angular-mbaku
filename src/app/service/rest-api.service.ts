import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';


declare interface loginInfo <T> {
  msg: string;
  user: {userInfo: T, userStatus:any};
  isLogin: any;
}

declare interface anggota {
  alamat:string    
  email:string
  jenis_kelamin:string
  kode_anggota:any;
  nama_lengkap:string;
  nomor_handphone:any;
  serial_id:any;
  status:any;
}

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  apiUrl:string = 'http://localhost/api-mbaku/public/api/v1/';
  public url:string = 'http://localhost/api-mbaku/';
  header:any = new HttpHeaders().append('Content-Type', 'application/json');
  constructor(public http: HttpClient, public snackBar: MatSnackBar) { }

  showMessage(message: string, action: string='Close') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  getDataBuku(criteria:any){
    return this.http.get(this.apiUrl + `dashboard/getBookList?pageIndex=${criteria.pageIndex}&pageSize=${criteria.pageSize}&sortBy=${criteria.sortBy}&category=${criteria.category}&keyword=${criteria.keyword}`);
  }

  getCategories(){
    return this.http.get(this.apiUrl + `dashboard/getCategories`);
  }

  getDetailBook(id){
    return this.http.get(this.apiUrl + `book/detail/${id}`);
  }

  processLogin(criteria:any){
    return this.http.post<loginInfo<anggota>>(this.apiUrl + `login`,JSON.stringify(criteria),{headers:this.header});
  }

  registerAnggota(criteria:any){
    return this.http.post(this.apiUrl + `anggota/daftar`,JSON.stringify(criteria),{headers:this.header});
  }

  registerAccount(criteria:any){
    return this.http.post(this.apiUrl + `anggota/account/register`,JSON.stringify(criteria),{headers:this.header});
  }
}
