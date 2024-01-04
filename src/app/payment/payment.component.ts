import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { payment } from 'src/Models/payment.model';
import { PaymentServiceService } from '../Services/payment.service';
import { DataSharingService } from '../data-sharing.service';
import { PolicyService } from '../Services/policy.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { policy } from 'src/Models/policy.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  payPremiumForm!:FormGroup
  minDate: string;
  payment:payment=new payment();
  policyToPay: any;
  policyNumber!:number
  constructor( private activate: ActivatedRoute,
    private policyService: PolicyService){
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  ngOnInit(){
 this.policyNumber=Number(this.activate.snapshot.paramMap.get('id'));
  
  this.payPremiumForm = new FormGroup({
    amount:new FormControl(''),
    paymentType: new FormControl('', [Validators.required]),
    cardHolderName: new FormControl('', [Validators.required]),
    cardNumber: new FormControl('', [Validators.required]),
    cvvNo: new FormControl('', [Validators.required]),
    expiryDate: new FormControl('', [Validators.required]),

  })
  this.getPolicyData();
  }
  getPolicyData() {
    this.policyService.getPolicyID(this.policyNumber).subscribe(
      (res: any) => {
        this.policyToPay = res;
        console.log(this.policyToPay) 
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }

 
  payPremium() {
    debugger
    if (this.payPremiumForm.valid) {
      console.log(this.payPremiumForm.value)
      this.payment.amount = this.policyToPay.premiumAmount
      this.payment.date = new Date();
      this.payment.paymentType = this.payPremiumForm.get('paymentType')!.value
      this.payment.cardHolderName = this.payPremiumForm.get('cardHolderName')!.value
      this.payment.cardNumber = String(this.payPremiumForm.get('cardNumber')!.value)
      this.payment.cvvNo = String(this.payPremiumForm.get('cvvNo')!.value)
      this.payment.expiryDate = this.payPremiumForm.get('expiryDate')!.value
      this.payment.totalPayment = this.payment.amount + this.payment.tax
      this.payment.policyNumber = this.policyNumber
      console.log(this.payment);
      this.policyService.addPaymnet(this.payment).subscribe(
        (res) => {
          alert("paid successfully")
          this.payPremiumForm.reset()
        },
        (err) => {
          alert("something went wrong, Try Again")
        }
      )
    }
  }
}
