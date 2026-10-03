import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { paymentQuery } from '../Models/Payment/paymentQuery';
import { payment } from '../Models/Payment/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiURL=`${environment.apiUrl}/apiPayment`
  http=inject(HttpClient)

  savePayment(payment:paymentQuery):Observable<payment>{
    return this.http.post<payment>(`${this.apiURL}/savePayment`,payment);
  }

  getPaymentReports(id:string):Observable<payment[]>{
    return this.http.get<payment[]>(`${this.apiURL}/getPaymentReports/${id}`);
  }
}
