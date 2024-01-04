import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { claim } from 'src/Models/calims';
import { ClaimServiceService } from '../Services/claim-service.service';
import { policy } from 'src/Models/policy.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-calims',
  templateUrl: './admin-calims.component.html',
  styleUrls: ['./admin-calims.component.css']
})
export class AdminCalimsComponent {
  claimDetail !: FormGroup;
  calimObj: claim = new claim();
  calimList: any;
  currentPage: number | undefined;
  pageSize: number | undefined;
  totalCustomerCount: any;

  policy: policy = new policy();

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private queryService: ClaimServiceService) {

  }
  ngOnInit(): void {

    this.claimDetail = this.formBuilder.group({
      policy: [''],
      calimId: [''],
      bankAccountNumber: [''],
      claimAmount: [''],
      ifScCode: [''],
      date: [''],
      policyNumber: [''],
      status: [''],



    });
    this.getAllCalim();
  }
  addClaim() {

    console.log(this.claimDetail);
    this.calimObj.policy = this.claimDetail.value.policy;
    this.calimObj.bankAccountNumber = this.claimDetail.value.bankAccountNumber;
    this.calimObj.claimAmount = this.claimDetail.value.claimAmount;
    this.calimObj.ifScCode = this.claimDetail.value.ifScCode;
    this.calimObj.date = this.claimDetail.value.date;
    this.calimObj.policyNumber = this.claimDetail.value.policyNumber;

    this.queryService.addClaim(this.calimObj).subscribe(res => {
      console.log(res);
      alert('Claim added sucessfully');
      this.getAllCalim();
      this.claimDetail.reset();
      location.reload();

    }, err => {
      alert('something went wrong');

    });

  }
  

  fetchPolicyDetails(policyNumber: number) {

    this.http.get<policy>(`https://localhost:7237/api/InsurancePolicy/getInsurancePolicyById/${policyNumber}`).subscribe((data) => {
      this.policy = data;
      console.log(data);
    });
  }
  getAllCalim() {
    this.queryService.getAllClaim().subscribe(res => {
      this.calimList = res;

    }
      , err => {
        console.log(err);


      });

  }
  updateStatus(data: any) {

    data.status = true;
    this.queryService.updateCalim(data).subscribe(
      (res) => {
        console.log("Update Success:", res);
        alert("Updated Successfully");
        window.location.reload()
      },
      (err) => {
        console.log("error:", err);
        alert("Approved");
        window.location.reload()
      }
    )
  }
}
