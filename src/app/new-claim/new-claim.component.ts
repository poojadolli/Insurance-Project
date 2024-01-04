import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from '../Services/policy.service';
import { ClaimServiceService } from '../Services/claim-service.service';
import { ValidateForm } from '../helper/validate';
import { claim } from 'src/Models/calims';
import { policy } from 'src/Models/policy.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.css']
})
export class NewClaimComponent {

  claimDetail !: FormGroup;
  calimObj: claim = new claim();
  calimList: any;
  // Your claim list data
  selectedClaim: any = null;
  policy: policy = new policy();
  policyDetails: any[] = [];
  currentPage = 1;
  totalCustomerCount = 0;
  headers: any
  policyData: any = {}

  pageSizes: number[] = [3, 6, 15, 20];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  policyToPay: any;
  policyNo!: number;
  constructor(private formBuilder: FormBuilder,
    private policyservice: PolicyService, private queryService: ClaimServiceService, private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.policyNo = (Number)(this.route.snapshot.paramMap.get('id'));
    this.claimDetail = this.formBuilder.group({
      policy: ['', Validators.required],
      calimId: [''],
      status: [false],
      bankAccountNumber: ['', [Validators.required, ValidateForm.min(0)]],
      claimAmount: ['', [, Validators.required, ValidateForm.min(0)]],
      ifScCode: ['', [Validators.required, ValidateForm.min(0)]],
      date: ['', Validators.required],
      policyNumber: ['', [Validators.required, ValidateForm.min(1)]],



    });
    this.getPolicyData()
    //this.getAllCalim();
    // this.getAllCalim();
  }
  addClaim() {
    console.log(this.claimDetail);
    // this.calimObj.policy = this.claimDetail.value.policy;
    this.calimObj.bankAccountNumber = this.claimDetail.value.bankAccountNumber;
    this.calimObj.claimAmount = this.policyData.sumAssured;
    this.calimObj.ifScCode = this.claimDetail.value.ifScCode;
    this.calimObj.date = new Date();
    this.calimObj.policyNumber = this.policyNo;
    this.calimObj.status = false;
    this.queryService.addClaim(this.calimObj).subscribe(res => {
      console.log(res);
      alert('Claim applied sucessfully');
     // this.getAllCalim();
      // this.getAllCalim();
      this.claimDetail.reset();
      location.reload();

    }, err => {
      alert('Try Again');

    });

  }


  getPolicyData() {
    this.policyservice.getPolicyID(this.policyNo).subscribe(
      (res) => {
        this.policyData = res
        console.log(this.policyData)

      },
      (err) => {
        console.log(err)
      }
    )
  }

  // getAllCalim() {
  //   this.queryService.getAllClaim().subscribe(res => {
  //     this.calimList = res;

  //   }
  //     , err => {
  //       console.log(err);
  //     });

  // }
}