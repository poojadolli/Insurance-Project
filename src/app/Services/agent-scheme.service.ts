import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanS } from 'src/Models/admin-planScheme';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { detail } from 'src/Models/detail.model';
import { scheme } from 'src/Models/schemedetail.model';

@Injectable({
  providedIn: 'root'
})
export class AgentSchemeService {
  setPlan(detail: any) {
    throw new Error('Method not implemented.');
  }

  apiUrl: string = "https://localhost:4040/api/";
  constructor(private http: HttpClient) {


  }
  addInsuranceScheme(scheme: planSchemes): Observable<planSchemes> {
    return this.http.post<planSchemes>(this.apiUrl + "InsuranceScheme/addInsuranceScheme", scheme);

  }
  getAllInsuranceScheme(): Observable<planSchemes[]> {
    return this.http.get<planSchemes[]>(this.apiUrl + "InsuranceScheme/GetAllInsuranceScheme");

  }
  updateScheme(scheme: planSchemes): Observable<planSchemes> {

    return this.http.put<planSchemes>(this.apiUrl + "InsuranceScheme/updateInsurancePolicy", scheme);
  }
  deleteScheme(scheme: planSchemes): Observable<planSchemes> {
    return this.http.delete<planSchemes>(this.apiUrl + "InsuranceScheme/deleteInsuranceScheme" + '/' + scheme.schemeId)
  }


  getBySchemeId(scheme: detail): Observable<detail> {
    return this.http.get<detail>(this.apiUrl + "InsuranceScheme/getInsuranceSchemeById" + '/' + scheme)
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterScheme(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.apiUrl + "InsuranceScheme/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&SchemeId=${searchQuery}` : `&SchemeName=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
  getSchemes(pgNo?: number, pageSize?: number) {
    return this.http.get(this.apiUrl + "InsuranceScheme/get" + `?PageNumber=` + pgNo + `&PageSize=` + pageSize, { observe: 'response' });
  }




}
