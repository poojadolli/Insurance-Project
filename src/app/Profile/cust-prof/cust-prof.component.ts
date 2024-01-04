import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentCustService } from 'src/app/Services/agent-cust.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-cust-prof',
  templateUrl: './cust-prof.component.html',
  styleUrls: ['./cust-prof.component.css']
})
export class CustProfComponent {
  passwordForm: FormGroup;
  custProfile:any
  isEdit:boolean=false
  constructor(
    private passwordService: AuthService,private cust:AgentCustService,
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }
  ngOnInit(){
    this.getCustProfile();
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
      this.passwordForm.value.username,
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
  getCustProfile(){
    debugger
    this.cust.getProfile().subscribe({
      next:(res)=>{
        this.custProfile=res;
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err.message);
      }
    })
   }
   onEdit(){
    this.isEdit=true
   }
   updateProfile()
   {
    console.log(this.custProfile)
     this.cust.updateCustomer(this.custProfile).subscribe({
      next:(res)=>{
     
        alert("Updated Successfully");
        location.reload()
       
      },
      error:(err:HttpErrorResponse)=>{
        alert(err.message);
      }
     })
  
   }
   validateEmail(item:any){
    const regexPattern=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(regexPattern.test(item))
     return false;
    return true
   }
   validatePhone(item:any){
    const regexPattern=/^\d{10}$/;
    if(regexPattern.test(item))
    return false
  return true
   }
   validateField(item:any){
    if(item!=='')
    return false;
   else
    return true
  
   }
  }


  // updateProfileForm!: FormGroup;
  // custProfile:any
  // isEdit:boolean=false
  // constructor(
  //   private passwordService: AuthService,private cust:AgentCustService,
  //   private formBuilder: FormBuilder
  // ) {
  //   this.updateProfileForm = this.formBuilder.group({
  //     email: ['', [Validators.required,Validators.email]],
  //     phone: ['', [Validators.required,]],
     
  //   });
  // }
  // ngOnInit(){
  //   this.getCustProfile();
  //   }

  // getCustProfile(){
  //   debugger
  //   this.cust.getProfile().subscribe({
  //     next:(res)=>{
  //       this.custProfile=res;
  //     },
  //     error:(err:HttpErrorResponse)=>{
  //       console.log(err.message);
  //     }
  //   })
  //  }
  
  //  updateProfile()
  //  {
  //   debugger
  //   console.log(this.custProfile)
  //   if(this.updateProfileForm.valid)
  //   {

  //    this.cust.updateCustomer(this.custProfile).subscribe({
  //     next:(res)=>{
     
  //       alert("Updated Successfully");
  //       location.reload()
       
  //     },
  //     error:(err:HttpErrorResponse)=>{
  //       alert(err.message);
  //     }
  //    })
  //   }
  
  //  }
  //  validateEmail(item:any){
  //   const regexPattern=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  //   if(regexPattern.test(item))
  //    return false;
  //   return true
  //  }
  //  validatePhone(item:any){
  //   const regexPattern=/^\d{10}$/;
  //   if(regexPattern.test(item))
  //   return false
  // return true
  //  }
  //  validateField(item:any){
  //   if(item!=='')
  //   return false;
  //  else
  //   return true
  
  //  }
  // }

