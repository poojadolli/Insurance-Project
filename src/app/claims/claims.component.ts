import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ClaimServiceService } from '../Services/claim-service.service';
import { policy } from 'src/Models/policy.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { claim } from 'src/Models/calims';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent {
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
  pageSizes: number[] = [3, 6, 15, 20];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  constructor(private formBuilder: FormBuilder, private queryService: ClaimServiceService, private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit(): void {

    this.claimDetail = this.formBuilder.group({
      policy: ['',Validators.required],
      calimId: [''],
      status: [false],
      bankAccountNumber: ['',[Validators.required,ValidateForm.min(0)]],
      claimAmount: ['',[,Validators.required,ValidateForm.min(0)]],
      ifScCode: ['',[Validators.required,ValidateForm.min(0)]],
      date: ['',Validators.required],
      policyNumber: ['',[Validators.required,ValidateForm.min(1)]],



    });
    this.getAllClaims();
        this.getAllCalim();
  }
  addClaim() {
    console.log(this.claimDetail);
    // this.calimObj.policy = this.claimDetail.value.policy;
    this.calimObj.bankAccountNumber = this.claimDetail.value.bankAccountNumber;
    this.calimObj.claimAmount = this.claimDetail.value.claimAmount;
    this.calimObj.ifScCode = this.claimDetail.value.ifScCode;
    this.calimObj.date = this.claimDetail.value.date;
    this.calimObj.policyNumber = this.claimDetail.value.policyNumber;
    this.calimObj.status = false;
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
  getAllClaims() {
    this.queryService.getAllClaims(this.currentPage, this.pageSize).subscribe(
      (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalCustomerCount = paginationData.TotalCount;
        this.calimList = response.body;

      }, (err) => {
        console.log(err);
      });

  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalCustomerCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getAllClaims();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllClaims();
  }

  onSearch() {
    this.queryService.getFilterClaims(this.currentPage, this.pageSize, this.searchQuery).subscribe(response => {
      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalCustomerCount = paginationData.TotalCount;
      this.calimList = response.body;

    }, err => {
      console.log(err);
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
  updateCustomerStatus(data: any) {
    this.queryService.updateCustomerCalim(data.custId).subscribe(
      (res) => {
        alert("Updated Successfully");
      },
      (err) => {
        alert("Something went wrong");
      }
    )
  }
}