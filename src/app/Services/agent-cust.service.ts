import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { customer } from 'src/Models/agent-cust.model';

@Injectable({
  providedIn: 'root'
})
export class AgentCustService {

 
  baseURL: string="https://localhost:4040/api/";
  constructor(private http: HttpClient) { }


  addCustomer(cust: customer): Observable<customer> {
    return this.http.post<customer>(this.baseURL+"Customer/addCustomer", cust);
  }
 
  getAllCustomer(pgNo?: number, pgSize?: number, searchQuery?: any): Observable<any> {
    let serachUrl = this.baseURL+`Customer/get?PageNumber=${pgNo}&PageSize=${pgSize}`
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&CustId=${searchQuery}` : ` &CustFirstName=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });
  }

  getCustomerById(cust: any): Observable<customer> {
    return this.http.get<any>(this.baseURL + "Customer/getCustomerById" + '/' + cust.custId)
  }
  
  updateCustomer(cust: customer): Observable<customer> {

    return this.http.put<customer>(this.baseURL+"Customer/updateCustomer", cust);
  }
  deleteCustomer(cust: customer): Observable<customer> {
    return this.http.delete<customer>(this.baseURL + 'Customer/Delete' + '/' + cust.custId)
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterCustomers(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl = this.baseURL+"Customer/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&CustId=${searchQuery}` : `&CustFirstName=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }
 

  getProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Customer/getProfile?name=" + name);
  }

  getTaxPercent() {
    return this.http.get(this.baseURL+"Tax/get");
  }

 
  uploadDocument(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.baseURL+`Document/upload?id=${id}`, formData);
  }

  downloadFile(fileId: number): Observable<HttpResponse<Blob>> {
    const url = this.baseURL+`Document/DownloadFile?documentId=${fileId}`; 
    return this.http.get(url, {
      observe: 'response', // This is crucial to get the full HTTP response, including headers
      responseType: 'blob', // Specify that you expect binary data (a file) in the response
    });
  }
  getAllDocuments() {
    return this.http.get<any>(this.baseURL+"Document/GetAllDocuments");
  }
 
  updateCustomerDocuments(documnetId: number) {
    return this.http.put(this.baseURL+"Document/update?documentId=" + documnetId, { observe: 'response' });
  }
  getCustomerDocumentsOnly(custId: number, pgNo?: number, pgSize?: number) {
    return this.http.get(this.baseURL+"Customer/douments?PageNumber=" + pgNo + "&PageSize=" + pgSize + "&customerID=" + custId, { observe: 'response' });
  }




  makePayment(data: any) {
    return this.http.post(this.baseURL+"Payment/addPayment", data);
  }
}


