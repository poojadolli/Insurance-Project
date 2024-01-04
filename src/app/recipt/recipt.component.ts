import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AgentCustService } from '../Services/agent-cust.service';
import { PolicyService } from '../Services/policy.service';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { PaymentServiceService } from '../Services/payment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipt',
  templateUrl: './recipt.component.html',
  styleUrls: ['./recipt.component.css']
})
export class ReciptComponent {
  paymentList:any={} 
   
schemeData:any={} 
policyData:any={} 
 schemeId:any 
  paymentId!:number 
  http: any; 
  custList: any={}; 
 
  Payment:any={} 
constructor(private customer:AgentCustService,private policy:PolicyService,private scheme:AgentSchemeService,private payment:PaymentServiceService,private activatedRoute:ActivatedRoute){} 
 
 ngOnInit(){ 
this.paymentId = (Number)(this.activatedRoute.snapshot.paramMap.get('id')); 
this.getCustomerDetail(); 
this.getPaymentDetails() 
 } 
  getPaymentDetails() {
  this.payment.getPaymentById(this.paymentId).subscribe(
    (res)=>{
      this.Payment=res
      console.log(this.Payment)
      this.getPolicyData(this.Payment.policyNumber);
    },
    (err)=>{
      console.log(err);
    }
  )
  }
  getPolicyData(policyNumber: any) {
    this.policy.getPolicyID(policyNumber).subscribe(
      (res)=>{
        this.policyData=res
        console.log(this.policyData)
        
      },
      (err)=>{
        console.log(err)
      }
    )
  }
 getCustomerDetail() { 
  this.customer.getProfile().subscribe((res) => { 
    this.custList= res 
    console.log(this.custList) 
  }, 
    (err: HttpErrorResponse) => { 
      console.log(err); 
    }) 
}
}
