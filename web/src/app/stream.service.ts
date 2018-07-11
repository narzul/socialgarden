import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StreamService {
  result: any;

  constructor(private _http: HttpClient) { }
  //TODO fix return to dynamic streamname
  streamData() {
    this.result = this._http.get('/devices/devicename1');
    console.log(this.result);
    return this.result;
  }


}
