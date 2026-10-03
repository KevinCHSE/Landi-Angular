import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModule } from '../Models/user/user-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL=`${environment.apiUrl}/User`
  http=inject(HttpClient);

  saveUser(user:UserModule):Observable<UserModule>{
    return this.http.post<UserModule>(`${this.apiURL}/saveUser`,user)
  }
}
