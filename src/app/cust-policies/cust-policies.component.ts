import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { policy } from 'src/Models/policy.model';
import { PolicyService } from '../Services/policy.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentCustService } from '../Services/agent-cust.service';
import { customer } from 'src/Models/agent-cust.model';
import { Agent } from 'src/Models/emp-agent.model';

@Component({
  selector: 'app-cust-policies',
  templateUrl: './cust-policies.component.html',
  styleUrls: ['./cust-policies.component.css']
})
export class CustPoliciesComponent {


  agents:Agent=new Agent();
  policyDetail !: FormGroup;
  policyObj: policy = new policy();
  policyList: policy[] = [];
  customerProfile: any
  customer: any
  router: any;
  premiumAmount: any;
  customers:customer=new customer()
  currentPage: number=1;
  totalPoliciesCount: any=0;
  pageSizes: number[] = [3, 6, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  constructor(private formBuilder: FormBuilder, private policyService: PolicyService,private http:HttpClient) {

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
      agentId: [''],
      installment: ['']
    });
    this.getAllPolicy();
  }




  getAllPolicy() {

    this.policyService.getCustProfile().subscribe({
      next: (res) => {
        this.customerProfile = res;
        console.log(this.customerProfile.custId);
        this.policyService.getCustomerPoliciesById(this.customerProfile.custId,).subscribe(
          res => {
            this.policyList = res;
            console.log(this.policyList)
          },
          (err) => {
            
            console.log("Unable to fetch commission data", err);
          }
        );

      },
     
    })
  }
  fetchCustomerDetails(custId: number) {
    console.log(custId)

    this.http.get<customer>(`https://localhost:7237/api/Customer/getCustomerById/${custId}`).subscribe((data) => {
      this.customers = data;
      console.log(data);


    });
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalPoliciesCount / this.pageSize);
  }
  changePage(page: number) {
    this.currentPage = page;
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
  }
  onSearch(){
  
  }
  fetchAgentDetails(agentId: number) {
    console.log(agentId)

    this.http.get<Agent>(`https://localhost:7237/api/Agent/getAgentById/${agentId}`).subscribe((data) => {
      this.agents = data;
      console.log(data);


    });
  
}
}
