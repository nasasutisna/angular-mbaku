import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import saveAs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from './service/rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public _subject = new Subject<any>();
  constructor(public http: HttpClient, public restApi: RestApiService) { }

  newEvent(event) {
    this._subject.next(event);
  }

  get events$ () {
    return this._subject.asObservable();
  }

  download(ebook,fileName){
    this.restApi.getFile(ebook).subscribe(
      res => {
        saveAs(res, fileName + '.pdf');
      }, error => {
        console.log('error download', error);
      }
    );
  }

  showFile(path:any){
    return this.restApi.url + path;
  }
}
