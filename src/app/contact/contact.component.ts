import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  formData: any = {};

  onSubmit() {
    // Handle form submission, e.g., sending data to the server
    console.log('Form submitted with data:', this.formData);
  }
}
