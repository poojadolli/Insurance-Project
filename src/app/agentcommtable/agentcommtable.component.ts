import { Component } from '@angular/core';
import { CommissionService } from '../Services/commission.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators } from '@angular/forms';
import { Commission } from 'src/Models/Commisiion.model';
import { ValidateForm } from '../helper/validate';
import { policy } from 'src/Models/policy.model';

@Component({
  selector: 'app-agentcommtable',
  templateUrl: './agentcommtable.component.html',
  styleUrls: ['./agentcommtable.component.css']
})
export class AgentcommtableComponent {
  agentProfile: any
  agents: any
  commDetail !: FormGroup;
  commObj: Commission = new Commission();
  commList: any[] = [];
  formBuilder: any;
  policy:policy=new policy();
  constructor(private customer: CommissionService, private http: HttpClient) { }

  ngOnInit() {

    this.getAllCommission()
    this.commDetail = this.formBuilder.group({
      agentId: ['', Validators.required],
      commissionId: ['', Validators.required],
      amount: ['', [Validators.required, ValidateForm.min(0)]],
      date: ['', Validators.required],
      policyNumber: ['', [Validators.required, ValidateForm.min(0)]],
      status: [''],

    });

  }
  getApprovalStatus(status: boolean): string {
    return status ? 'Approved' : 'Denied';
  }
  addCommission() {

    console.log(this.commDetail);

    this.commObj.agentId = this.commDetail.value.agentId;
    this.commObj.amount = this.commDetail.value.amount;
    this.commObj.policyNumber = this.commDetail.value.policyNumber;
    this.commObj.date = this.commDetail.value.date;

    this.customer.addCommission(this.commObj).subscribe(res => {
      console.log(res);
      alert('Commission added sucessfully');
      this.commDetail.reset();

    }, err => {
      alert('something went wrong');

    });

  }
  updateCommission() {

    this.commObj.commissionId = this.commDetail.value.commissionId;
    this.commObj.agentId = this.commDetail.value.agentId;
    this.commObj.policyNumber = this.commDetail.value.policyNumber;
    this.commObj.amount = this.commDetail.value.amount;
    this.commObj.date = this.commDetail.value.date;

    this.customer.updateCommission(this.commObj).subscribe(res => {
      console.log(res);


      this.getAllCommission();
    }, err => {
      console.log(err);
    })
  }
  fetchPolicyDetails(policyNumber: number) {
    debugger
    console.log(policyNumber)

    this.http.get<policy>(`https://localhost:7237/api/InsurancePolicy/getInsurancePolicyById/${policyNumber}`).subscribe((data) => {
      this.policy = data;
      console.log(data);


    });
  }
  editCommission(cust: Commission) {
    this.commDetail.controls['agentId'].setValue(cust.agentId);
    this.commDetail.controls['commissionId'].setValue(cust.commissionId);
    this.commDetail.controls['policyNumber'].setValue(cust.policyNumber);
    this.commDetail.controls['date'].setValue(cust.date);
    this.commDetail.controls['amount'].setValue(cust.amount);
    this.updateCommission()
  }


  getAllCommission() {
    this.customer.getProfile().subscribe({
      next: (res) => {
        this.agentProfile = res;
        console.log(this.agentProfile.agentId);
        this.customer.getCommisionAgent(this.agentProfile.agentId).subscribe(
          res => {
            this.commList = res;
            console.log(this.commList)
          },
          (err) => {
            console.log("Unable to fetch commission data", err);
          }
        );
      }
    })
  }
}



