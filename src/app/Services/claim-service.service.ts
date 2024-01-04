import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { claim } from 'src/Models/calims';

@Injectable({
  providedIn: 'root'
})
export class ClaimServiceService {
  apiUrl: string="https://localhost:4040/api/"
 
  constructor(private http: HttpClient) {
   
    
  }
  addClaim(query: claim): Observable<claim> {
    return this.http.post<claim>(this.apiUrl+"Claim/addClaim", query);

  }
  getAllClaim(): Observable<claim[]> {
    return this.http.get<claim[]>(this.apiUrl+"Claim/GetAllClaim");

  }
  getAllClaims(pgNo?: number, pageSize?: number) {
    return this.http.get(this.apiUrl + `?PageNumber= ` + pgNo + `&PageSize=` + pageSize, { observe: 'response' });
  }
 

  updateCalim(calim: claim): Observable<claim> {
    return this.http.put<claim>(this.apiUrl+"Claim/updateClaim",calim) ;
  }
  updateCustomerCalim(calim: any) {
    return this.http.put(this.apiUrl+"Customer/updateCustomer", calim, { observe: 'response' });
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterClaims(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.apiUrl+"Claim/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&CalimId=${searchQuery}` : `&Policy=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
}

