import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginInterface } from '../Interface/login-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http=inject(HttpClient)
  private apiURl:string="https://demo-vlte.onrender.com"

  login(id:string, password:string):Observable<LoginInterface>{
      return this.http.post<LoginInterface>(`${this.apiURl}/login`,{id,password});
  }

}
