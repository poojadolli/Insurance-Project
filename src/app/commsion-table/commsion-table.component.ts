import { Component } from '@angular/core';
import { CommissionService } from '../Services/commission.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Commission } from 'src/Models/Commisiion.model';
import { ValidateForm } from '../helper/validate';
import { policy } from 'src/Models/policy.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-commsion-table',
  templateUrl: './commsion-table.component.html',
  styleUrls: ['./commsion-table.component.css']
})
export class CommsionTableComponent {
  commDetail !: FormGroup;
  commObj: Commission = new Commission();
  commList: Commission[] = [];
  
  newPolicy: policy = new policy();
  comms: Commission = new Commission();

  constructor(private formBuilder: FormBuilder, private custService: CommissionService, private http: HttpClient) {

  }

  ngOnInit(): void {

    this.commDetail = this.formBuilder.group({

      agentId: ['', Validators.required],
      commissionId: ['', Validators.required],
      amount: ['', [Validators.required, ValidateForm.min(0)]],
      date: ['', Validators.required],
      policyNumber: ['', [Validators.required, ValidateForm.min(0)]],
      status: [''],

    });
    this.getAllCommission();


  }
  updateCommission(data: any) {

    data.status = true;
    this.custService.updateCommission(data).subscribe(
      (res) => {
        alert("Approved successfully");
        window.location.reload()
      },
      (err) => {
        alert("Something went wrong");
        window.location.reload()
      }
    )
  }


  addCommission() {

    console.log(this.commDetail);

    this.commObj.agentId = this.commDetail.value.agentId;
    this.commObj.amount = this.commDetail.value.amount;
    this.commObj.policyNumber = this.commDetail.value.policyNumber;
    this.commObj.date = this.commDetail.value.date;

    this.custService.addCommission(this.commObj).subscribe(res => {
      console.log(res);
      alert('Commission added sucessfully');
      this.commDetail.reset();

    }, err => {
      alert('something went wrong');

    });

  }
 

  editCommission(cust: Commission) {

    this.commDetail.controls['agentId'].setValue(cust.agentId);
    this.commDetail.controls['commissionId'].setValue(cust.commissionId);
    this.commDetail.controls['policyNumber'].setValue(cust.policyNumber);
    this.commDetail.controls['date'].setValue(cust.date);
    this.commDetail.controls['amount'].setValue(cust.amount);
    
    this.commDetail.controls['status'].setValue(true);

  }

  getAllCommission() {
    this.custService.getAllCommission().subscribe(res => {
      this.commList = res;

    }
      , err => {
        console.log(err);



      });

  }

  fetchCustomerDetails(policyNumber: number) {

    this.http.get<policy>(`https://localhost:7237/api/InsurancePolicy/getInsurancePolicyById/${policyNumber}`).subscribe((data) => {
      console.log(this.newPolicy)
      this.newPolicy = data;
      console.log(data);


    });
  }
  fetchCommDetails(policyNumber: number) {

    this.http.get<Commission>(`https://localhost:7237/api/Commission/GetById?Id=${policyNumber}`).subscribe((data) => {
      console.log(this.newPolicy)
      this.comms = data;
      console.log(data);


    });
  }
}
