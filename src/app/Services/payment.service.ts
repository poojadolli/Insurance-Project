import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { payment } from 'src/Models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
 
  baseURL:string="https://localhost:4040/api/";

  constructor(private http: HttpClient) {
   
  }
  addPayment(payment: payment): Observable<payment> {
    return this.http.post<payment>(this.baseURL+"Payment/addPayment", payment);


  }
  getAllPayment(): Observable<payment[]> {
    return this.http.get<payment[]>(this.baseURL+"Payment/GetAllPayment");

  }
  getPaymentById(id:number){
   return this.http.get(this.baseURL+"Payment/getPaymentById/"+id);
  }
}