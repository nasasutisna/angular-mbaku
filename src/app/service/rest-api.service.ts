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
  typePdf:any = new HttpHeaders().append('Content-Type', 'application/pdf');
  
  // LINK MIDTRANS
  urlTransaction = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
  authTransaction = "Basic U0ItTWlkLXNlcnZlci1JWlRnMUxMWTlGQjl0VF9JcXV6LWt3em46";
  constructor(public http: HttpClient, public snackBar: MatSnackBar) { }

  showMessage(message: string, action: string='Close') {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  getDataBuku(criteria:any){
    return this.http.get(this.apiUrl + `dashboard/getBookList?pageIndex=${criteria.pageIndex}&pageSize=${criteria.pageSize}&filterEbook=${criteria.filterEbook}&sortBy=${criteria.sortBy}&category=${criteria.category}&keyword=${criteria.keyword}`);
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

  updateAccount(criteria:any){

    const formData = new FormData();

    formData.append('serial_id', criteria.serial_id);
    formData.append('kode_anggota', criteria.kode_anggota);
    formData.append('nama_lengkap', criteria.nama_lengkap);
    formData.append('alamat', criteria.alamat);
    formData.append('nomor_handphone', criteria.nomor_handphone);
    formData.append('email', criteria.email);
    formData.append('status', criteria.status);
    formData.append('photo', criteria.photo);
   
    return this.http.post(this.apiUrl + `anggota/account/update`,formData);
  }


  detailAccount(kode_anggota:any){
    return this.http.get(this.apiUrl + `anggota/account/detail/${kode_anggota}`);
  }

  downloadImage(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

  getBookByCategory(kode_kategori){
    return this.http.get(this.apiUrl + `book/getBookByCategory/${kode_kategori}`);
  }

  getPopularBook(){
    return this.http.get(this.apiUrl + `book/getPopularBook`);
  }

  getFile(filename: string) {
    return this.http.post(this.apiUrl + 'book/getEbook',{filename: filename},{responseType : 'blob'});
  }

  checkMyRate(criteria: any) {
    return this.http.post(this.apiUrl + 'book/checkMyRate',{kode_anggota: criteria.kode_anggota,kode_buku: criteria.kode_buku});
  }

  addRatting(criteria: any) {
    return this.http.post(this.apiUrl + 'book/addRatting',{kode_anggota: criteria.kode_anggota,kode_buku: criteria.kode_buku,ratting:criteria.rate});
  }

  orderEbook(criteria:any){
    // let header = new HttpHeaders().append('Content-Type', 'application/json').append('Accept','application/json').append('Authorization',this.authTransaction);
    return this.http.post(this.apiUrl+'transaksi/order',criteria,{headers:this.header});
  }

  checkStatusOrder(token){
    return this.http.get(this.apiUrl+`transaksi/status/${token}`);
  }

  getOrderByAnggota(kode_anggota){
    return this.http.get(this.apiUrl+`transaksi/order/getByAnggota/${kode_anggota}`);
  }

  cancelOrder(orderId){
    return this.http.get(this.apiUrl+`transaksi/order/cancel/${orderId}`);
  }

  transactionStore(criteria){
    return this.http.post(this.apiUrl+`transaksi/order/store`,criteria,{headers:this.header});
  }

  checkOrderPending(criteria){
    return this.http.post(this.apiUrl+`transaksi/order/pending`,criteria,{headers:this.header});
  }

  checkOrderBookPending(criteria){
    return this.http.post(this.apiUrl+`transaksi/order/book/pending`,criteria,{headers:this.header});
  }

  updateOrder(criteria){
    return this.http.post(this.apiUrl+`transaksi/order/update`,criteria,{headers:this.header});
  }

}
