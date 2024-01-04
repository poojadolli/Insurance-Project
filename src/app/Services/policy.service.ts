import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { policy } from 'src/Models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {  
  baseURL: string="https://localhost:4040/api/";
  constructor(private http: HttpClient) {
  }
  addPolicy(policy: policy): Observable<policy> {
    return this.http.post<policy>(this.baseURL+"InsurancePolicy/addInsurancePolicy", policy);
  }
  getPolicyID(policy: number): Observable<policy> {
    return this.http.get<policy>(this.baseURL +"InsurancePolicy/getInsurancePolicyById"+ '/' + policy)
  }
  getAllPolicy(): Observable<policy[]> {
    return this.http.get<policy[]>(this.baseURL +"InsurancePolicy/GetAllInsurancePolicy");
  }
  updatePolicy(policy: policy): Observable<policy> {
    return this.http.put<policy>(this.baseURL+"InsurancePolicy/updateInsurancePolicy", policy);
  }
  deletePolicy(policy: policy): Observable<policy> {
    return this.http.delete<policy>(this.baseURL + "InsurancePolicy/deleteInsurancePolicy" + '/' + policy.policyNumber)
  }
  getProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Agent/getProfile?name=" + name);
  }
  getCustomerPoliciesById(custId: number) {
    return this.http.get<any>(this.baseURL+ "InsurancePolicy/GetByCustomerId"+ '/' + custId)
  }
  getCustPoliciesById(policy: number) {
    return this.http.get<any>(this.baseURL + "InsurancePolicy/GetByCustomerId" + '/' + policy)
  }
  getCustProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Customer/getProfile?name=" + name);
  }
  getAgentProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Agent/getProfile?name=" + name);
  }
  addPaymnet(data:any){
    return this.http.post(this.baseURL+"Payment/addPayment",data);
  }
}
