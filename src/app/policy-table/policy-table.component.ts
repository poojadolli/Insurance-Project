import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { policy } from 'src/Models/policy.model';
import { PolicyService } from '../Services/policy.service';
import { CommonModule } from '@angular/common';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { HttpClient } from '@angular/common/http';
import { customer } from 'src/Models/agent-cust.model';
import { Agent } from 'src/Models/emp-agent.model';

@Component({
  selector: 'app-policy-table',
  templateUrl: './policy-table.component.html',
  styleUrls: ['./policy-table.component.css']
})


export class PolicyTableComponent {

  policyDetail !: FormGroup;
  policyObj: policy = new policy();
  policyList: policy[] = [];
  scheme: planSchemes = new planSchemes();
  cust: customer = new customer();

  agent: Agent = new Agent();
  isCalculated=false

  constructor(private formBuilder: FormBuilder, private policyService: PolicyService, private http: HttpClient) {

  }
  ngOnInit(): void {

    this.policyDetail = this.formBuilder.group({

      policyNumber: [''],
      issueDate: [''],
      maturityDate: [''],
      premiumType: [''],
      premiumAmount: [''],
      paymentCount: [''],
      sumAssured: [''],
      status: [''],
      schemeId: [''],
      customerID: [''],
      agentID: [''],
      installment: [''],
    });
    this.getAllPolicy();
  }

  getAllPolicy() {
    this.policyService.getAllPolicy().subscribe(res => {
      this.policyList = res;

    }
      , err => {
        console.log(err);
      });

  }
  fetchCustomerDetails(schemedetails: number) {
    this.http.get<planSchemes>(`https://localhost:7237/api/InsuranceScheme/getInsuranceSchemeById/${schemedetails}`).subscribe((data) => {
      this.scheme = data;
      console.log(data);


    });
  }

  fetchCustDetails(custId: number) {
    this.http.get<customer>(`https://localhost:7237/api/Customer/getCustomerById/${custId}`).subscribe((data) => {
      this.cust = data;
      console.log(data);


    });
  }

  fetchAgentDetails(agentID: any) {
   
    this.http.get<Agent>(`https://localhost:7237/api/Customer/getCustomerById/${agentID}`).subscribe((data) => {
      this.agent = data;
      console.log(data);
    });
  }
}
