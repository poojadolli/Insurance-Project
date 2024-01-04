import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/Models/admin-emp.model';


@Injectable({
  providedIn: 'root'
})
export class EmpServiceService {

 
  baseURL: string="https://localhost:4040/api/";
  constructor(private http: HttpClient) {

  }
  addEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseURL+"Employee/AddEmployee", emp);

  }
  getAllEmployee(pgNo?: number, pageSize?: number) {
    return this.http.get(this.baseURL+"Employee/get" + `?PageNumber=` + pgNo + `&PageSize=` + pageSize, { observe: 'response' });

  }
  updateEmployee(emp: Employee): Observable<Employee> {

    return this.http.put<Employee>(this.baseURL+"Employee/updateEmployee", emp);
  }
  deleteEmployee(emp: Employee): Observable<Employee> {
    return this.http.delete<Employee>(this.baseURL + "Employee/Delete"+ '/' + emp.employeeId)
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterEmployees(pgNo?: number, pgSize?: number, searchQuery?: any) {
    var serachUrl =this.baseURL+ "Employee/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
    if (searchQuery !== undefined) {
      if (this.containsOnlyDigits(searchQuery)) {
        searchQuery = parseInt(searchQuery);
      }

      serachUrl += (typeof searchQuery === 'number') ? `&EmployeeId=${searchQuery}` : ` &EmployeeFirstName=${searchQuery}`;
    }
    return this.http.get(serachUrl, { observe: 'response' });

  }

  getProfile() {
    let name = localStorage.getItem('userName');
    return this.http.get(this.baseURL + "Employee/getProfile?name=" + name);
  }
}


