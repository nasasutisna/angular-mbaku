import { Injectable, EventEmitter, Input, Output } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Router } from '@angular/router';
import { NotifService } from './notif.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  @Output() auth = new EventEmitter<any>();
  
  constructor(
    public restApi: RestApiService,
    public router: Router,
    public notifService: NotifService
  ) { }

  login(criteria){
    return new Promise((resolve,reject) => {
      this.restApi.processLogin(criteria).subscribe((result) => {
        this.auth.emit(result);
        resolve(result);
      },error => {
        reject(error);
      })
    })
  }
}
