import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commission } from 'src/Models/Commisiion.model';

@Injectable({
  providedIn: 'root'
})
export class CommissionService {

 
  baseURL: string = "https://localhost:4040/api/";

  
  constructor(private http: HttpClient) {}
  


  addCommission(comm: Commission): Observable<Commission> {
    return this.http.post<Commission>(this.baseURL+"Commission/addCommission", comm);
  }
  getAllCommission(): Observable<Commission[]> {
    return this.http.get<Commission[]>(this.baseURL+"Commission/GetAllCommission");

  }
 
  getCommisionAgent(agentId: number) {
    return this.http.get<any>(`${this.baseURL}Commission/GetByAgentId/${agentId}`);
  }
  updateCommission(cust: Commission): Observable<Commission> {

    return this.http.put<Commission>(this.baseURL+"Commission/UpdateCommission", cust);
  }
  getProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Agent/getProfile?name=" + name);



  }
}