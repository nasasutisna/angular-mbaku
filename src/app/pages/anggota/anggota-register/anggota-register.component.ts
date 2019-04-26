import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'app/service/rest-api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-anggota-register',
  templateUrl: './anggota-register.component.html',
  styleUrls: ['./anggota-register.component.scss']
})
export class AnggotaRegisterComponent implements OnInit {

  registerForm = new FormGroup({
    kode_anggota: new FormControl(),
    nama_lengkap: new FormControl(),
    email: new FormControl(),
    nomor_handphone: new FormControl(),
    password: new FormControl()
  })

  hide = true;
  inputPassword: string = 'password';
  constructor(
    public restApi: RestApiService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  processRegister() {
    console.log(this.registerForm.value);
    this.restApi.registerAnggota(this.registerForm.value).subscribe((results: any) => {
      console.log(results);
      this.showMessage(results.msg, 'success');
      this.router.navigate(['/login']);
    }, err => {
      console.log('err', err);
      this.showMessage(err.error.msg, 'danger');
    });
  }

  showHidePass() {
    this.hide = !this.hide;
    if (this.hide) {
      this.inputPassword = 'password';
    }
    else {
      this.inputPassword = 'text';
    }
  }

  showMessage(msg: string = '', status: string = "success", from = 'top', align = 'right') {
    const type = ['info', 'success', 'warning', 'danger'];
    const statusMsg = type.findIndex(obj => obj == status);
    $.notify({
      icon: "notifications",
      message: msg

    }, {
        type: type[statusMsg],
        timer: 4000,
        placement: {
          from: from,
          align: align
        },
        template:
          '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });
  }

}
