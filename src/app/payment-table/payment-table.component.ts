import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { payment } from 'src/Models/payment.model';
import { PaymentServiceService } from '../Services/payment.service';
import { policy } from 'src/Models/policy.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.css']
})
export class PaymentTableComponent {
  paymentDetail !: FormGroup;
  paymentObj: payment = new payment();
  paymentList: payment[] = [];
  constantTax: number = 4;
  newPolicy: policy = new policy();
  constructor(private formBuilder: FormBuilder, private paymentService: PaymentServiceService, private http: HttpClient) { }
  ngOnInit(): void {

    this.paymentDetail = this.formBuilder.group({
      paymentId: [''],
      paymentType: [''],
      amount: [''],
      tax: [this.constantTax],
      date: [''],
      totalPayment: [''],
      policyNumebr: ['']

    });
    this.getAllPayment();
  }
  getAllPayment() {
    this.paymentService.getAllPayment().subscribe(res => {
      this.paymentList = res;


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
  addPayment() {

    console.log(this.paymentDetail);
    //this.paymentObj.paymentId=this.paymentDetail.value.paymentId;
    this.paymentObj.paymentType = this.paymentDetail.value.paymentType;
    this.paymentObj.amount = this.paymentDetail.value.amount;
    this.paymentObj.tax = this.paymentDetail.value.tax;
    this.paymentObj.date = this.paymentDetail.value.date;
    this.paymentObj.totalPayment = this.paymentDetail.value.totalPayment;
    this.paymentObj.policyNumber = this.paymentDetail.value.policyNumebr;


    // this.paymentObj.email=this.queryDetail.value.email;
    // this.queryObj.description=this.queryDetail.value.description;
    // this.queryObj.customerID=this.queryDetail.value.customerID;
    this.paymentService.addPayment(this.paymentObj).subscribe(res => {
      console.log(res);
      alert('Payment added sucessfully');
      this.paymentDetail.reset();
      location.reload();

    }, err => {
      alert('something went wrong');

    });

  }

}
