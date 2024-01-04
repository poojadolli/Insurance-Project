import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = "https://localhost:4040/api"



  constructor(private http: HttpClient) { }

  customerSignUp(data: any) {

    return this.http.post(this.baseUrl + "/Customer/AddCustomer", data);

  }
  Login(data: any) {

    return this.http.post(this.baseUrl + "/User/login", data);

  }
  adminLogin(data: any) {
    return this.http.post(this.baseUrl + "/Admin/login", data);
  }
  agentLogin(data: any) {
    return this.http.post(this.baseUrl + "/Agent/login", data);
  }
  empLogin(data: any) {
    return this.http.post(this.baseUrl + "/Employee/login", data);
  }

  logOut() {
    // Clear any authentication tokens or session data
    // For example, clear a JWT token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }

  updatePassword(userName: string, newPassword: string,) {
    const body = {
      "userName": userName,
      "newPassword": newPassword
    };
    return this.http.put(this.baseUrl + "/User/updatePassword", body);
  }
}

