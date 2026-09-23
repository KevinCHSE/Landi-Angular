import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDetailsService {
    private apiURL:string="https://demo-vlte.onrender.com/apiInoviceDetails";
    http=inject(HttpClient)

  getTotal():Observable<number>{
    return this.http.get<number>(`${this.apiURL}/getTotal`)
  }
}
