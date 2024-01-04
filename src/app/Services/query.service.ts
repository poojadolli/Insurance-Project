import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { query } from 'src/Models/query.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  baseURL: string = "https://localhost:4040/api/"
  constructor(private http: HttpClient) {

  }
  addQuery(query: query): Observable<query> {
    return this.http.post<query>(this.baseURL + "Query/addQuery", query);
  }
  getQuery(): Observable<query[]> {
    return this.http.get<query[]>(this.baseURL + "Query/GetAllQuery");
  }
  updateQuery(query: query): Observable<query> {
    return this.http.put<query>(this.baseURL + "Query/updateQuery", query);
  }


}
