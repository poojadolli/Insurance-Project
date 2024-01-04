import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { policy } from 'src/Models/policy.model';
import { PolicyService } from '../Services/policy.service';
import { DatePipe } from '@angular/common';
import { DataSharingService } from '../data-sharing.service';
import { customer } from 'src/Models/agent-cust.model';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { AgentCustComponent } from '../agent-cust/agent-cust.component';
import { AgentCustService } from '../Services/agent-cust.service';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidateForm } from '../helper/validate';
import { PlanService } from '../Services/plan-service';
import { ActivatedRoute, Router } from '@angular/router';
import { payment } from 'src/Models/payment.model';
import { EmpAgentService } from '../Services/emp-agent.service';
declare var window:any

@Component({
  selector: 'app-agent-policy',
  templateUrl: './agent-policy.component.html',
  styleUrls: ['./agent-policy.component.css'],
  providers: [DatePipe],
})
export class AgentPolicyComponent {


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
SchemeDetail:any={}
isCalculated=false
policyToPay:any
policy:policy=new policy()
payment:payment=new payment()
agentId?:number;
premiumCalculateForm!: FormGroup<{premiumMode: FormControl<string | null>; term: FormControl<string | null>; sumAssured: FormControl<string | null>; }>;

  constructor(private formBuilder: FormBuilder, private route: Router,
    private activate: ActivatedRoute,
    private policyService: PolicyService,
    private dataSharingService: DataSharingService,
    private agentService: EmpAgentService,
    private custService: AgentCustService, private planServices: PlanService) {
      const today = new Date();
      this.minDate = today.toISOString().split('T')[0];

  }
  ngOnInit(){
   
    this.schemeId = (Number)(this.activate.snapshot.paramMap.get('id'));
    this.premiumCalculateForm = new FormGroup(
      {
        premiumMode: new FormControl('', [Validators.required]),
        term: new FormControl('', [Validators.required,]),
        sumAssured: new FormControl('', [Validators.required,Validators.min(0)])
      },
      this.payPremiumForm=new FormGroup({
      paymentType:new FormControl('',[Validators.required]) ,
      cardHolderName:new FormControl('',[Validators.required]),
      cardNumber:new FormControl('',[Validators.required]),
      cvvNo:new FormControl('',[Validators.required]),
      expiryDate:new FormControl('',[Validators.required]),

    })
      
    );
    
    this.getCustProfile()
   this.getScheme()
  }
  getCustProfile(){
    debugger
    this.agentService.getProfile().subscribe({
      next:(res)=>{
        this.customerData=res;
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err.message);
      }
    })
   }
  getScheme()
  {
    debugger
    this.planServices.getSchemeDetail(this.schemeId).subscribe((res)=>{
     this.SchemeDetail=res;
    },
    (err)=>{console.log(err)})
    
  }
  confirmDetail() {
  this.isCalculated=true
    }
  checkRange(minValue: number, maxValue: number, value: number) {
    if (value >= minValue && value <= maxValue) {
      return true;
    } else {
      return false;
    }
  }
  calculatePremium(){
    
    if (this.premiumCalculateForm.valid) {


      if (this.checkRange(this.SchemeDetail.minimumInvestTime, this.SchemeDetail.maximumInvestTime, parseInt(this.premiumCalculateForm.get('term')?.value!)) &&
        this.checkRange(this.SchemeDetail.minimumAmount, this.SchemeDetail.maximumAmount, parseInt(this.premiumCalculateForm.get('sumAssured')?.value!))) {

        let modeMultiplier = 1;
        switch (this.premiumCalculateForm.get('premiumMode')!.value) {
          case 'Monthly':
            modeMultiplier = 12;
            this.policy.premiumType="Monthly"
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
            modeMultiplier=1
            this.policy.premiumType="Yearly"
            break
        }
        this.totalPremiumEMI = (modeMultiplier * parseInt(this.premiumCalculateForm.get('term')?.value!))
        this.premium = Math.round(parseInt(this.premiumCalculateForm.get('sumAssured')?.value!) / (this.totalPremiumEMI) * 100) / 100;

   
      let sumAssured = parseInt(this.premiumCalculateForm.get('sumAssured')?.value!);
       this.MaturityAmount = sumAssured + (sumAssured * this.SchemeDetail.profitRatio )/ 100;
        console.log(this.premium);
        console.log(this.MaturityAmount)
        //policy object
         this.policy.schemeId = this.SchemeDetail.insuranceSchemeId
         this.policy.issueDate = new Date();

        // Calculate MaturityDate
         const termInYears = (Number) (this.premiumCalculateForm.get('term')!.value);
         const maturityDate:Date = new Date(this.policy.issueDate);
         maturityDate.setFullYear(maturityDate.getFullYear() + termInYears);

         this.policy.maturityDate = maturityDate;
         this.policy.premiumAmount = this.premium
         this.policy.sumAssured = this.MaturityAmount
         this.policy.installment = this.totalPremiumEMI
        
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
 
  showPaymentModal(){
    
 this.payModal= new window.bootstrap.Modal(document.getElementById("paymentModal"));
this.payModal.show();


  }
  closeModal(){
    this.payModal= new window.bootstrap.Modal(document.getElementById("paymentModal"));
    this.payModal.hide();  
  }
  onCancel() {
     this.premiumCalculateForm.reset()
    }
    
  
  payPremium() {
    debugger
    
      if(this.payPremiumForm.valid){
      console.log(this.payPremiumForm.value)
      this.payment.amount=this.policyToPay.premiumAmount
      this.payment.date=new Date();

      this.payment.paymentType=this.payPremiumForm.get('paymentType')!.value
      this.payment.cardHolderName=this.payPremiumForm.get('cardHolderName')!.value
      this.payment.cardNumber=String(this.payPremiumForm.get('cardNumber')!.value)
      this.payment.cvvNo= String(this.payPremiumForm.get('cvvNo')!.value)
      this.payment.expiryDate=this.payPremiumForm.get('expiryDate')!.value
      this.payment.totalPayment=this.payment.amount+ this.payment.tax
      this.payment.policyNumber=this.policyToPay.policyNumber
      console.log(this.payment);
      this.policyService.addPaymnet(this.payment).subscribe(
        (res)=>{

          alert("Paid Successfully")
        },
        (err)=>{
          alert("something went wrong, Try Again")
        }
       )
       }  
    }
  
    applyPolicy() {
      debugger
      this.policyService.addPolicy(this.policy).subscribe({
        next:(res)=>{
          this.policyToPay=res;
          console.log(res);
      this.showPaymentModal();
        },
        error:(err:HttpErrorResponse)=>{
          alert("Something went wrong, Try Again!");
        }
      })
      }
}





