import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDetailsService {
    private apiURL:string=`${environment.apiUrl}/apiInoviceDetails`
    http=inject(HttpClient)

  getTotal():Observable<number>{
    return this.http.get<number>(`${this.apiURL}/getTotal`)
  }
}
