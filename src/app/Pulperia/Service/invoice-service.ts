import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { invoiceRequest } from '../Models/invoice/invoiceRequest';
import { HttpClient, HttpParams } from '@angular/common/http';

import { invoiceQueryReport } from '../Models/report/invoiceQueryReport';
import { invoiceReport } from '../Models/report/invoiceReport';


@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiURL="http://localhost:8080/apiInvoice"
  http=inject(HttpClient);

  saveInvoice(invoice:invoiceRequest):Observable<invoiceRequest>{
    return this.http.post<invoiceRequest>(`${this.apiURL}/saveInvoice`,invoice)
  }

  getReport(query:invoiceQueryReport):Observable<invoiceReport>{
    const params = new HttpParams({ fromObject: { ...query } });
    return this.http.get<invoiceReport>(`${this.apiURL}/getReport`, {params});
  }
}
