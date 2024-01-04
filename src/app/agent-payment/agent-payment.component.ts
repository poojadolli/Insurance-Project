import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { policy } from 'src/Models/policy.model';
import { PolicyService } from '../Services/policy.service';
import { DataSharingService } from '../data-sharing.service';
import { PaymentServiceService } from '../Services/payment.service';
import { payment } from 'src/Models/payment.model';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-agent-payment',
  templateUrl: './agent-payment.component.html',
  styleUrls: ['./agent-payment.component.css']
})
export class AgentPaymentComponent {

  paymentDetail !: FormGroup;
  paymentObj: payment = new payment();
  paymentList: payment[] = [];
  constantTax: number = 4;
  premiumAmount: any;
  currentDate: string;
  
  constructor(private formBuilder: FormBuilder, private paymentService: PaymentServiceService,
    private dataSharingService: DataSharingService) {
      this.currentDate = new Date().toISOString().split('T')[0];

  }
  getPremiumAmount(): number {
    return this.dataSharingService.getPremiumAmount();
  }
  ngOnInit(): void {

    this.paymentDetail = this.formBuilder.group({
      paymentId: [''],
      paymentType: [''],
      amount: [''],
      tax: [''],
      date: [''],
      totalPayment: [''],
      policyNumebr: [''],
      cardHolderName:['',[Validators.required,ValidateForm.onlyCharactersValidator]],
      cardNumber:['',[Validators.required,Validators.min(16)]],
      cvvNo:['',[Validators.required,ValidateForm.min(3)]],
      expiryDate:['']


    }
    ); this.fetchPremiumAmount();
    const taxControl = this.paymentDetail.get('tax');
    if (taxControl) {
      taxControl.valueChanges.subscribe(() => {
        this.calculateTotalSum();
      });
    }

    const amountControl = this.paymentDetail.get('amount');
    if (amountControl) {
      amountControl.valueChanges.subscribe(() => {
        this.calculateTotalSum();
      });
    }



    this.getAllPayment();
  }
  calculateTotalSum() {
    const taxControl = this.paymentDetail.get('tax');
    const amountControl = this.paymentDetail.get('amount');
    if (taxControl && amountControl) {
      const tax = taxControl.value;
      const amount = amountControl.value;

      // Calculate the 'totalPayment' field based on 'tax' and 'amount'
      const totalPayment = (tax * amount) / 100;

      const totalPaymentControl = this.paymentDetail.get('totalPayment');
      if (totalPaymentControl) {
        totalPaymentControl.setValue(totalPayment);
      }
    }
  }
  getAllPayment() {
    this.paymentService.getAllPayment().subscribe(res => {
      this.paymentList = res;
    }
      , err => {
        console.log(err);

      });

  }
  fetchPremiumAmount() {
    this.premiumAmount = this.dataSharingService.premiumAmount;
  }

  addPayment() {

    // Calculate the totalPayment before adding the payment
    this.calculateTotalSum();

    console.log(this.paymentDetail);

    console.log(this.paymentDetail);
    this.paymentObj.paymentType = this.paymentDetail.value.paymentType;
    this.paymentObj.amount = this.paymentDetail.value.amount;
    this.paymentObj.tax = this.paymentDetail.value.tax;
    this.paymentObj.date = this.paymentDetail.value.date;
    this.paymentObj.totalPayment = this.paymentDetail.value.totalPayment;
    this.paymentObj.policyNumber = this.paymentDetail.value.policyNumebr;
    this.paymentObj.cardHolderName=this.paymentDetail.value.cardHolderName;
    this.paymentObj.cardNumber=this.paymentDetail.value.cardNumber;
    this.paymentObj.cvvNo=this.paymentDetail.value.cvvNo;
    this.paymentObj.expiryDate=this.paymentDetail.value.expiryDate;
    this.paymentService.addPayment(this.paymentObj).subscribe(res => {
      console.log(res);
      alert('Payment is Sucessfull');
      this.paymentDetail.reset();
      location.reload();

    }, err => {
      alert('something went wrong');

    });

  }

}


