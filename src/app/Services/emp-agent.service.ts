import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agent } from 'src/Models/emp-agent.model';

@Injectable({
  providedIn: 'root'
})
export class EmpAgentService {
  baseURL: string="https://localhost:4040/api/";
  constructor(private http: HttpClient) {
  }

  addAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.baseURL+"Agent/addAgent", agent);
  }
  
  getAllAgent(pgNo?: number, pageSize?: number) {
    return this.http.get(this.baseURL+"Agent/get" + `?PageNumber=` + pgNo + `&PageSize=` + pageSize, { observe: 'response' });
  }
  updateAgent(agent: Agent): Observable<Agent> {

    return this.http.put<Agent>(this.baseURL+"Agent/updateAgent", agent);
  }
  deleteAgent(agent: Agent): Observable<Agent> {
    return this.http.delete<Agent>(this.baseURL + "Agent/deleteAgent" + '/' + agent.agentId)
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterAgents(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl =this.baseURL+ "Agent/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&AgentId=${searchQuery}` : ` &AgentFirstName=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }

  getProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Agent/getProfile?name=" + name);



  }
}
