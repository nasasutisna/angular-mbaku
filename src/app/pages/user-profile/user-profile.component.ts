import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'app/service/rest-api.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NotifService } from 'app/service/notif.service';
import { AuthService } from 'app/service/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @ViewChild('fileInput') fileInput;

  user: any;
  formData = new FormGroup({});
  file:any;
  image: any;

  constructor(public router: Router, public authService: AuthService, public fb: FormBuilder, public restApi: RestApiService, public notifService: NotifService) { }

  ngOnInit() {
    this.getDetailData();
    this.defineForm(this.user)
  }


  defineForm(user: any) {
    if (user) {
      this.formData = this.fb.group({
        kode_anggota: [user.kode_anggota],
        nama_lengkap: [user.nama_lengkap],
        email: [user.email],
        nomor_handphone: [user.nomor_handphone],
        alamat: [user.alamat],
        photo: ['']
      });
    }
    else{
      this.formData = this.fb.group({
        kode_anggota: [''],
        nama_lengkap: [''],
        email: [''],
        nomor_handphone: [''],
        alamat: [''],
        photo: ['']
      });
    }
  }

  getDetailData() {
    let auth = JSON.parse(localStorage.getItem('authentication'));
    this.restApi.detailAccount(auth.user.userInfo.kode_anggota).subscribe((result: any) => {
      this.user = result;
      this.image = this.restApi.url + this.user.photo;
      localStorage.setItem('user', JSON.stringify(result));
      this.defineForm(this.user);
      this.authService.navbar.emit();
    }, err => {
        this.notifService.showMessage(err.error.msg, 'warning', 'top');
      });
  }

  updateProfile() {
    let params = {
      serial_id: this.user.serial_id
    }

    params = Object.assign(this.formData.value,params);
    this.restApi.updateAccount(params).subscribe((result: any) => {
      this.notifService.showMessage(result.msg, 'success', 'bottom');
      this.getDetailData();
    }, err => {
        console.log(err);
        this.notifService.showMessage(err.error.msg, 'warning', 'bottom');
      });
  }

  browseImage(){
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    var reader = new FileReader();
    this.file = event.target.files[0];
    console.log('file',this.file)
    this.formData.get("photo").setValue(this.file);

    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event:any) => { // called once readAsDataURL is completed
      this.image = event.target.result
    }

  }

}
