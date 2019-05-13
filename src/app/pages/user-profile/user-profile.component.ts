import { Component, OnInit } from '@angular/core';
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
  user: any;
  formData = new FormGroup({});

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
      });
    }
    else{
      this.formData = this.fb.group({
        kode_anggota: [''],
        nama_lengkap: [''],
        email: [''],
        nomor_handphone: [''],
        alamat: [''],
      });
    }
  }

  getDetailData() {
    let auth = JSON.parse(localStorage.getItem('authentication'));
    this.restApi.detailAccount(auth.user.userInfo.kode_anggota).subscribe((result: any) => {
      this.user = result;
      localStorage.setItem('user', JSON.stringify(result));
      this.defineForm(this.user);
      this.authService.navbar.emit();
    }, err => {
        this.notifService.showMessage(err.error.msg, 'warning', 'top');
      });
  }

  updateProfile() {
    console.log(this.formData);
    this.restApi.updateAccount(this.formData.value).subscribe((result: any) => {
      this.notifService.showMessage(result.msg, 'success', 'bottom');
      this.getDetailData();
    }, err => {
        console.log(err);
        this.notifService.showMessage(err.error.msg, 'warning', 'bottom');
      });
  }

}
