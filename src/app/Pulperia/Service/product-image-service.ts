import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Image } from '../Models/Image';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductImageService {
  private apiURL=`${environment.apiUrl}/apiImage`
  http=inject(HttpClient);


  saveImage(idProduct:number, fileImage:Blob):Observable<Image>{
    const form=new FormData();
    form.append('file',fileImage,'foto.jpg');
    return this.http.post<Image>(`${this.apiURL}/saveImage/${idProduct}/image`,form);
  }

  getImage(idProduct:number, version?:number):string{
    return `${this.apiURL}/${idProduct}/image` + (version ? `?v=${version}` : '');
  }
}
