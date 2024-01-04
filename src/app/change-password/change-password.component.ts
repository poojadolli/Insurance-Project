import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { AgentCustService } from '../Services/agent-cust.service';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  constructor(
    private passwordService: AuthService, private cust: AgentCustService,
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      username: ['', [Validators.required] ],
      oldPassword: ['', [Validators.required]],
      newPassword: ['',[ Validators.required,ValidateForm.passwordPatternValidator]]
    });
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
      },
      (error) => {
        console.error('Password update failed:', error);
        alert('Password update failed. Please try again later.');
      }
    );
  }
}
