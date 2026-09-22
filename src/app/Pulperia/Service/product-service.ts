import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../Models/Products';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl="http://localhost:8080/apiProducts";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${this.apiUrl}/Products`);
  }

  needStock():Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/needStock`);
  }

  saveProduct(product: Products):Observable<Products>{
    return this.http.post<Products>(`${this.apiUrl}/NewProduct`,product);
  }
  updateProduct(id:number,product: Products):Observable<Products>{
    return this.http.put<Products>(`${this.apiUrl}/updateProduct/${id}`,product);
  }
  deleteProduct(id:number):Observable<Products>{
    return this.http.delete<Products>(`${this.apiUrl}/deleteProduct/${id}`);
  }
  findById(id:number):Observable<Products>{
    return this.http.get<Products>(`${this.apiUrl}/getProduct/${id}`);
  }

  updateStock(id:number, newStock:number):Observable<Products>{
    return this.http.put<Products>(`${this.apiUrl}/updateStockProduct/${id}`,newStock);
  }

}
