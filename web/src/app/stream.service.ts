import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
//// TODO: Implement listenForNewData(value) from streamview.component.ts as a service instead 
@Injectable()
export class StreamService {
  result: any;

  constructor(private _http: HttpClient) { }

}
