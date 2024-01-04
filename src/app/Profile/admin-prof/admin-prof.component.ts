import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { ValidateForm } from '../../helper/validate';

@Component({
  selector: 'app-admin-prof',
  templateUrl: './admin-prof.component.html',
  styleUrls: ['./admin-prof.component.css']
})
export class AdminProfComponent {

  passwordForm: FormGroup;

  constructor(
    private passwordService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      username: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      oldPassword: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      newPassword: ['', [Validators.required, ValidateForm.passwordPatternValidator]]
    });
  }

  onSubmit() {

    // const control=this.agentDetail.get('agentId');
    // control?.removeValidators([Validators.required]);
    // this.agentDetail.get('')
    if (this.passwordForm.valid) {

      this.updatePassword();

    }
    else {

      ValidateForm.validateAllFormFileds(this.passwordForm)
      alert("your form is invalid");
    }
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
}
