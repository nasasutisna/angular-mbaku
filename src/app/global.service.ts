import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public _subject = new Subject<any>();
  constructor() { }

  newEvent(event) {
    this._subject.next(event);
  }

  get events$ () {
    return this._subject.asObservable();
  }
}
