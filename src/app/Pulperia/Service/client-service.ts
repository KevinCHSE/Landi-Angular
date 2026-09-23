import { inject, Injectable } from '@angular/core';
import { Client } from '../Models/Client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ClientService {
  http=inject(HttpClient)
  private apiURl:string=`${environment.apiUrl}/apiClients`

  getClients():Observable<Client[]>{
    return this.http.get<Client[]>(`${this.apiURl}/getClients`);
  }

  saveClient(client:Client):Observable<Client>{
    return this.http.post<Client>(`${this.apiURl}/saveClient`,client)
  }

  updateCliente(id:string, client:Client):Observable<Client>{
    return this.http.put<Client>(`${this.apiURl}/updateClient/${id}`,client);
  }

  getClient(id:string):Observable<Client>{
    return this.http.get<Client>(`${this.apiURl}/getClient/${id}`);
  }

  clientCount():Observable<number>{
    return this.http.get<number>(`${this.apiURl}/clientCount`);
  }

}
