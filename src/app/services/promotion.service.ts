import { Injectable } from '@angular/core';
import { observable,of, Observable } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';


import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  
  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.processHTTPMsgService.handleError));

}

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL +'promotions/'+id)
    .pipe(catchError(this.processHTTPMsgService.handleError));
 
}

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true').pipe(map(Promotions =>Promotions[0]))
    .pipe(catchError(this.processHTTPMsgService.handleError));  
}

}






