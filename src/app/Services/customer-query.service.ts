import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { query } from 'src/Models/query.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerQueryService {
  apiUrl:string="https://localhost:4040/api/";
  
  constructor(private http:HttpClient) { 
  

  }
  addQuery(query:query):Observable<query>{
    return this.http.post<query>(this.apiUrl+"Query/AddQuery",query);
       
}
getAllQuery():Observable<query[]> {
  return this.http.get<query[]>(this.apiUrl+"Query/GetAllQuery");
     
     }
updateQuery(query:query):Observable<query>{
  return this.http.put<query>(this.apiUrl+"Query/updateQuery",query)
}
containsOnlyDigits(s: string) {
  return /^\d+$/.test(s);
}
getFilterQuery(pgNo?: number, pgSize?: number, searchQuery?: any) {
  var serachUrl = this.apiUrl+"Query/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
  if (searchQuery !== undefined) {
    if (this.containsOnlyDigits(searchQuery)) {
      searchQuery = parseInt(searchQuery);
    }

    serachUrl += (typeof searchQuery === 'number') ? `&QueryId=${searchQuery}` :  `&CustEmail=${searchQuery}`;
  }
  return this.http.get(serachUrl, { observe: 'response' });

}
getQuery(pgNo?: number, pageSize?: number) {
  return this.http.get(this.apiUrl+"Query/get" + `?PageNumber=` + pgNo + `&PageSize= `+ pageSize, { observe: 'response' });

}
}