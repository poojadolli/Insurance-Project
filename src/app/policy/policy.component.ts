import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { policy } from 'src/Models/policy.model';
import { PolicyService } from '../Services/policy.service';
import { DataSharingService } from '../data-sharing.service';
import { customer } from 'src/Models/agent-cust.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { AgentCustService } from '../Services/agent-cust.service';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { PlanService } from '../Services/plan-service';
import { ValidateForm } from '../helper/validate';
import { HttpErrorResponse } from '@angular/common/http';
import { payment } from 'src/Models/payment.model';
import { pipe } from 'rxjs';
declare var window: any
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent {


  minDate: string;
  customerData: any;
  isDisabled: any;
  totalPremiumEMI!: number;

  schemeId!: number;
  payModal: any;
  payPremiumForm!: FormGroup
  AgentForm!: FormGroup
  premiumAmount: any;
  premiumType: any;
  sumAssured: any;
  premium!: any;
  MaturityAmount: any;
  SchemeDetail: any = {}
  isCalculated = false
  policyToPay: any
  policy: policy = new policy()
  payment: payment = new payment()
  agentId?: number;
  premiumCalculateForm!: FormGroup<{ premiumMode: FormControl<string | null>; term: FormControl<string | null>; sumAssured: FormControl<string | null>; }>;

  constructor(private formBuilder: FormBuilder, private route: Router,
    private activate: ActivatedRoute,
    private policyService: PolicyService,
    private dataSharingService: DataSharingService,

    private custService: AgentCustService, private planServices: PlanService) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

  }
  ngOnInit() {
    this.getCustProfile();
    this.schemeId = (Number)(this.activate.snapshot.paramMap.get('id'));
    this.premiumCalculateForm = new FormGroup(
      {
        premiumMode: new FormControl('', [Validators.required]),
        term: new FormControl('', [Validators.required,]),
        sumAssured: new FormControl('', [Validators.required, Validators.min(0)])
      },
      this.payPremiumForm = new FormGroup({
        paymentType: new FormControl('', [Validators.required]),
        cardHolderName: new FormControl('', [Validators.required]),
        cardNumber: new FormControl('', [Validators.required]),
        cvvNo: new FormControl('', [Validators.required]),
        expiryDate: new FormControl('', [Validators.required]),

      })

    );

    this.getCustProfile()
    this.getScheme()
  }
  getCustProfile() {

    this.custService.getProfile().subscribe({
      next: (res) => {

        this.customerData = res;
        console.log(this.customerData);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    })
  }
  getScheme() {

    this.planServices.getSchemeDetail(this.schemeId).subscribe((res) => {
      this.SchemeDetail = res;
    },
      (err) => { console.log(err) })

  }
  confirmDetail() {
    this.isCalculated = true
  }
  checkRange(minValue: number, maxValue: number, value: number) {
    if (value >= minValue && value <= maxValue) {
      return true;
    } else {
      return false;
    }
  }
  calculatePremium() {

    if (this.premiumCalculateForm.valid) {


      if (this.checkRange(this.SchemeDetail.minimumInvestTime, this.SchemeDetail.maximumInvestTime, parseInt(this.premiumCalculateForm.get('term')?.value!)) &&
        this.checkRange(this.SchemeDetail.minimumAmount, this.SchemeDetail.maximumAmount, parseInt(this.premiumCalculateForm.get('sumAssured')?.value!))) {

        let modeMultiplier = 1;
        switch (this.premiumCalculateForm.get('premiumMode')!.value) {
          case 'Monthly':
            modeMultiplier = 12;
            this.policy.premiumType = "Monthly"
            break;
          case 'Quaterly':
            modeMultiplier = 4;
            this.policy.premiumType = "Quaterly";
            break;
          case 'Half Yearly':
            modeMultiplier = 2;
            this.policy.premiumType = "Half Yearly";
            break;
          default:
            modeMultiplier = 1
            this.policy.premiumType = "Yearly"
            break
        }
        this.totalPremiumEMI = (modeMultiplier * parseInt(this.premiumCalculateForm.get('term')?.value!))
        this.premium = Math.round(parseInt(this.premiumCalculateForm.get('sumAssured')?.value!) / (this.totalPremiumEMI) * 100) / 100;


        let sumAssured = parseInt(this.premiumCalculateForm.get('sumAssured')?.value!);
        this.MaturityAmount = sumAssured + (sumAssured * this.SchemeDetail.profitRatio) / 100;
        console.log(this.premium);
        console.log(this.MaturityAmount)
        //policy object
        this.policy.schemeId = this.SchemeDetail.insuranceSchemeId
        this.policy.issueDate = new Date();

        // Calculate MaturityDate
        const termInYears = (Number)(this.premiumCalculateForm.get('term')!.value);
        const maturityDate: Date = new Date(this.policy.issueDate);
        maturityDate.setFullYear(maturityDate.getFullYear() + termInYears);

        this.policy.maturityDate = maturityDate;
        this.policy.premiumAmount = this.premium
        this.policy.sumAssured = this.MaturityAmount
        this.policy.installment = this.totalPremiumEMI

        this.policy.customerID = this.customerData.custId

        console.log(this.policy)
        this.isDisabled = true;



      }
      else {
        alert("Invalid Term/SumAssured")
      }

    }
    else {
      ValidateForm.validateAllFormFileds(this.premiumCalculateForm)
      alert("one or more field required")
    }
  }
  showPaymentModal() {
    this.payModal = new window.bootstrap.Modal(document.getElementById("paymentModal"));
    this.payModal.show();
  }
  closeModal() {
    this.payModal = new window.bootstrap.Modal(document.getElementById("paymentModal"));
    this.payModal.hide();
  }
  onCancel() {
    this.premiumCalculateForm.reset()
  }
  payPremium() {
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
      this.payment.policyNumber = this.policyToPay.policyNumber
      console.log(this.payment);
      this.policyService.addPaymnet(this.payment).subscribe(
        (res) => {
          alert("paid successfully")
        },
        (err) => {
          alert("something went wrong, Try Again")
        }
      )
    }
  }
  applyPolicy() {
    debugger
    console.log(this.customerData)
    if(this.customerData.documents!=-1){
    if (this.customerData.documents >= 3) { 
      this.policyService.addPolicy(this.policy).subscribe({
        next: (res) => {
          this.policyToPay = res;
          console.log(res);
          this.showPaymentModal();
        },
        error: (err: HttpErrorResponse) => {
          alert("Something went wrong, Try Again!");
        }
      })
    }
    else
      alert("Documents are not verified")
  }
  else{
    alert("Upload all documents")
  }
}

}




