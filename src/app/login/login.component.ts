import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  LoginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl(0, [Validators.required])
  })
  token: any
 
  constructor(private auth: AuthService, private router: Router) { }
  customerLogin() {
    console.log(this.LoginForm.value)
    if(this.LoginForm.valid){
    this.auth.Login(this.LoginForm.value).subscribe({
      next: (data) => {

        this.token = data
        console.log(this.token)

        alert("Login Successfully")
        localStorage.setItem("token", this.token.actualToken);
        localStorage.setItem("userName", this.LoginForm.get('userName')?.value!)
        localStorage.setItem("password", this.LoginForm.get('password')?.value!)
        if(this.LoginForm.get('role')?.value==1)
        {
          this.router.navigateByUrl('/admin')

        }
        else if(this.LoginForm.get('role')?.value==2)
        {
          this.router.navigateByUrl('/customer')
        }
        else if(this.LoginForm.get('role')?.value==3)
        {
          this.router.navigateByUrl('/agent')
        }
        else if(this.LoginForm.get('role')?.value==4){
          this.router.navigateByUrl('/emp')
        }
        

      },
      error: (error: HttpErrorResponse) => {
        alert(error.error)
        console.log(error)

      }
    })
  }
  else{
    alert("One or more fields are required")
  }

  }

}


