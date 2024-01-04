import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scheme } from 'src/Models/schemedetail.model';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  
  baseUrl:string="https://localhost:4040/api/";
  constructor(private http: HttpClient) {
    
  }
  addScheme(scheme: scheme): Observable<scheme> {
    return this.http.post<scheme>(this.baseUrl+"SchemeDetail/addsSchemeDetail", scheme);


  }
  getAllScheme(): Observable<scheme[]> {
    return this.http.get<scheme[]>(this.baseUrl+"SchemeDetail/GetAllSchemeDetail");

  }
  updateScheme(scheme: scheme): Observable<scheme> {
    return this.http.put<scheme>(this.baseUrl+"SchemeDetail/updateAdmin", scheme);
  }
  deleteScheme(scheme: scheme): Observable<scheme> {
    return this.http.delete<scheme>(this.baseUrl + 'SchemeDetail/deleteSchemeDetail' +'/'+ scheme.detailId)
  }

  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterSchemes(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl =this.baseUrl+ "SchemeDetail/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&DetailId=${searchQuery}` :  `&Description=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  getAllSchemes(pgNo?: number, pageSize?: number) {
    return this.http.get(this.baseUrl+"SchemeDetail/get" + `?PageNumber=` + pgNo + `&PageSize=` + pageSize, { observe: 'response' });

  }

 
}
