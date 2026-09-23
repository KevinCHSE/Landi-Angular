import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginInterface } from '../Interface/login-interface';
import { environment } from '../../Environments/environments.development';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http=inject(HttpClient)
  private apiURl:string=`${environment.apiUrl}`

  login(id:string, password:string):Observable<LoginInterface>{
      return this.http.post<LoginInterface>(`${this.apiURl}/login`,{id,password});
  }

}
