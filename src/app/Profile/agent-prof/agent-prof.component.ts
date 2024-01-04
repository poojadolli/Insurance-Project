import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ValidateForm } from '../../helper/validate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { EmpAgentService } from 'src/app/Services/emp-agent.service';

@Component({
  selector: 'app-agent-prof',
  templateUrl: './agent-prof.component.html',
  styleUrls: ['./agent-prof.component.css']
})
export class AgentProfComponent {



  passwordForm: FormGroup;
  agentProfile: any
  isEdit: boolean = false
  constructor(
    private passwordService: AuthService, private agent: EmpAgentService,
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      userName: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],


    });
  }
  ngOnInit() {
    this.getAgentProfile();
  }

  updatePassword() {
    debugger
    if (this.passwordForm.invalid) {
      alert('Please fill in all fields.');
      return;
    }

    // Check if the old password matches the one in local storage
    const storedPassword = localStorage.getItem('password');
    if (this.passwordForm.value.oldPassword !== storedPassword) {
      alert('Old password is incorrect.');
      return;
    }

    // Send a request to update the password using the service
    this.passwordService.updatePassword(
      this.passwordForm.value.userName,
      this.passwordForm.value.newPassword
    ).subscribe(
      (response) => {
        alert("Password updated ");
        window.history.back()
        // You can also clear local storage or perform other actions here.
      },
      (error) => {
        console.error('Password update failed:', error);
        alert('Password update failed. Please try again later.');
      }
    );
  }


  // getEmployeeProfile(){
  //   debugger
  //   this.employee.getProfile().subscribe({
  //     next:(res)=>{
  //       this.employeeProfile=res;
  //     },
  //     error:(err:HttpErrorResponse)=>{
  //       console.log(err.message);
  //     }
  //   })
  //  }
  //  onEdit(){
  //   this.isEdit=true
  //  }
  //  updateProfile()
  //  {
  //   console.log(this.employeeProfile)
  //    this.employee.updateEmployee(this.employeeProfile).subscribe({
  //     next:(res)=>{

  //       alert("Updated Successfully");
  //       location.reload()

  //     },
  //     error:(err:HttpErrorResponse)=>{
  //       alert(err.message);
  //     }
  //    })

  //  }

  getAgentProfile() {

    this.agent.getProfile().subscribe({
      next: (res) => {
        this.agentProfile = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    })
  }
  onEdit() {
    this.isEdit = true
  }
  updateProfile() {
    console.log(this.agentProfile)
    this.agent.updateAgent(this.agentProfile).subscribe({
      next: (res) => {

        alert("Updated Successfully");
        location.reload()

      },
      error: (err: HttpErrorResponse) => {
        alert(err.message);
      }
    })

  }
  validateEmail(item: any) {
    const regexPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (regexPattern.test(item))
      return false;
    return true
  }
  validatePhone(item: any) {
    const regexPattern = /^\d{10}$/;
    if (regexPattern.test(item))
      return false
    return true
  }
  validateField(item: any) {
    if (item !== '')
      return false;
    else
      return true

  }
}
