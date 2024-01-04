import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentCustService } from '../Services/agent-cust.service';
import { customer } from 'src/Models/agent-cust.model';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-regsiter',
  templateUrl: './regsiter.component.html',
  styleUrls: ['./regsiter.component.css']
})
export class RegsiterComponent {
  custDetail !: FormGroup;
  custObj: customer = new customer();
  custList: customer[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  public pageNumbers: number[] = [];
  searchTerm: string = '';


  constructor(private formBuilder: FormBuilder, private custService: AgentCustService) {

  }

  ngOnInit(): void {

    this.custDetail = this.formBuilder.group({
      custId: ['', Validators.required],
      custFirstName: ['', [Validators.required,ValidateForm.onlyCharactersValidator]],
      custLastName: ['', [Validators.required,ValidateForm.onlyCharactersValidator]],
      custPhoneNumber: ['', [Validators.required,ValidateForm.phoneValidator]],
      custEmail: ['', Validators.email],
      city: ['', [Validators.required,ValidateForm.onlyCharactersValidator]],
      state: ['', [Validators.required,ValidateForm.onlyCharactersValidator]],
      status: ['', Validators.required],
      userName: ['', [Validators.required,ValidateForm.passwordPatternValidator]],
      password: ['', [Validators.required,ValidateForm.passwordPatternValidator]],

      // custId: ['', Validators.required],
      // custFirstName: ['', Validators.required],
      // custLastName: ['', Validators.required],
      // custPhoneNumber: ['', Validators.required],
      // custEmail: ['', Validators.required],
      // city: ['', Validators.required],
      // state: ['', Validators.required],
      // status: ['', Validators.required],
      // userName: ['', Validators.required],
      // password: ['', Validators.required],
    });


  }



  addCustomer() {

    console.log(this.custDetail);

    this.custObj.custFirstName = this.custDetail.value.custFirstName;
    this.custObj.custLastName = this.custDetail.value.custLastName;
    this.custObj.city = this.custDetail.value.city;
    this.custObj.state = this.custDetail.value.state;
    this.custObj.custEmail = this.custDetail.value.custEmail;
    this.custObj.custPhoneNumber = this.custDetail.value.custPhoneNumber;
    // this.custObj.status = this.custDetail.value.status === 'true';
    this.custObj.userName = this.custDetail.value.userName;
    this.custObj.password = this.custDetail.value.password;

    this.custService.addCustomer(this.custObj).subscribe(res => {
      console.log(res);
      alert('Registered sucessfully');
      this.custDetail.reset();

    }, err => {
      alert('Please Fill all the feilds');

    });

  }

}




