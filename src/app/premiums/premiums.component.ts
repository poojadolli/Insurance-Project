import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { DataSharingService } from '../data-sharing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { payment } from 'src/Models/payment.model';
import { AgentCustService } from '../Services/agent-cust.service';
import { PolicyService } from '../Services/policy.service';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { policy } from 'src/Models/policy.model';
declare var window: any


@Component({
  selector: 'app-premiums',
  templateUrl: './premiums.component.html',
  styleUrls: ['./premiums.component.css']
})
export class PremiumsComponent {

  policyNo!: number
  policyList: any
  Tax: any = {}
  tax: any;
  payPremiumForm!: FormGroup;
  policy: policy = new policy()
  payModal: any;
  custListForDisplay: any
  schemeList: any
  installment: { number: number, isPaid: boolean }[] = [{ number: 1, isPaid: true }]
  paymentModal: any
  recieptModal: any
  PaymentForm!: FormGroup
  installmentNo!: number
  custList: any
  isInstallmentPaid: boolean[] = Array(this.installment.length).fill(false);
  payment: any;
  policyToPay: any;

  constructor(private activatedroute: ActivatedRoute, private policyService: PolicyService, private customer: AgentCustService, private policyservice: PolicyService, private scheme: AgentSchemeService, private fb: FormBuilder
    , private router: Router) { }
  ngOnInit() {
    this.policyNo = (Number)(this.activatedroute.snapshot.paramMap.get('id'));
    this.getPolicyData();
    //this.getTax();
    this.paymentModal = new window.bootstrap.Modal(document.getElementById("emiPaymentModal"));
    this.PaymentForm = this.fb.group({
      payType: ['null', [Validators.required]],
      cHolderName: ['', [Validators.required]],
      cNumber: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      DateOfExpiry: ['', [Validators.required]],
    })
  }

  showPaymentModal() {
    this.payModal = new window.bootstrap.Modal(document.getElementById("paymentModal"));
    this.payModal.show();
  }

  closeModal() {
    this.payModal = new window.bootstrap.Modal(document.getElementById("paymentModal"));
    this.payModal.hide();
  }

  getPolicyData() {
    this.policyservice.getPolicyID(this.policyNo).subscribe(
      (res: any) => {
        this.policyList = res;
        console.log(this.policyList)
        this.installment = Array.from(
          { length: this.policyList.installment },
          (_, i) => ({ number: i + 1, isPaid: false })
        );
        this.getCustomerDetail();
        this.getSchemeData();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }

  getCustomerDetail() {
    this.customer.getProfile().subscribe((res) => {
      this.custList = res
      console.log(this.custList)
    },
      (err: HttpErrorResponse) => {
        console.log(err);
      })
  }
  getSchemeData() {
    this.scheme.getBySchemeId(this.policyList.schemeId).subscribe(
      (res) => {
        this.schemeList = res

      },
      (err: HttpErrorResponse) => {
        console.log(err)
      }
    )
  }
  getCustPolicyId() {
    this.policyservice.getCustPoliciesById(this.policyList.custId).subscribe(
      (res: any) => {
        this.policyList = res
      },
      (err: HttpErrorResponse) => {
        console.log(err)
      }
    )
  }

  getTax() {
    this.customer.getTaxPercent().subscribe({
      next: (res) => {
        this.Tax = res;
        this.tax = res;

        console.log(res)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    })
  }

  calculateTotalAmoutToPay() {
    return (((this.policyList.premiumAmount * this.Tax.tax) / 100) + this.policyList.premiumAmount)
  }

  calculateDueDate(emi: number) {
    let issueDate = this.policyList.issueDate;
    let emiMode: number = this.policyList.premiumMode;
    const parsedIssueDate = new Date(issueDate);
    const dueDate = new Date(parsedIssueDate);

    if (emiMode == (3)) {
      dueDate.setMonth(dueDate.getMonth() + (1 * emi));
    } else if (emiMode == 2) {
      dueDate.setMonth(dueDate.getMonth() + (3 * emi));
    } else if (emiMode == 1) {
      dueDate.setMonth(dueDate.getMonth() + (6 * emi));
    }
    else {
      dueDate.setMonth(dueDate.getMonth() + (12 * emi));
    }

    return dueDate;

  }
  allPremiumsPaid(): boolean {
    var res= this.installment.every(emi => emi.isPaid) ;
    return res
  }
  downloadReceipt(index: number) {
    debugger

    console.log(this.policyList.policyNo)
    this.router.navigateByUrl("payment/receipt/" + this.policyList.payments[index].paymentId)
  }

  applyPolicy() {
    debugger
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
  ClaimPolicy(){
    this.router.navigateByUrl("/new-claim/"+this.policyNo);

    // this.router.navigateByUrl("/claims");
  }

  payPremium(index:number) {
    this.installment[index].isPaid=true
    this.router.navigateByUrl("payment/"+this.policyNo)
  }
}
