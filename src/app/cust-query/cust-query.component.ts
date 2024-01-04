import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { query } from 'src/Models/query.model';
import { CustomerQueryService } from '../Services/customer-query.service';

import { customer } from 'src/Models/agent-cust.model';
import { HttpClient } from '@angular/common/http';
import { PolicyService } from '../Services/policy.service';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-cust-query',
  templateUrl: './cust-query.component.html',
  styleUrls: ['./cust-query.component.css']
})
export class CustQueryComponent {

  queryDetail !: FormGroup;
  queryObj: query = new query();
  queryList: query[] = [];
  customer: customer = new customer();
  customers: any;
  // <-------------->
  currentPage = 1;
  totalQuriesCount = 0;
  agents: any;
  headers: any
  paginatedAgents: any[] = [];
  oldAgentObj: any
  pageSizes: number[] = [4, 7, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  quries: any
  // <-------------->

  constructor(private formBuilder: FormBuilder,
    private policyService: PolicyService, private queryService: CustomerQueryService, private http: HttpClient) {

  }

  ngOnInit(): void {

    this.queryDetail = this.formBuilder.group({

      customerID: ['', Validators.required],
      queryId: [''],
      email: ['', [Validators.email]],
      status: [''],
      description: ['', Validators.required]
    });
    this.getQuries();

    this.policyService.getCustProfile().subscribe({
      next: (res) => {
        this.customers = res;
        console.log(res);
        localStorage.setItem('userId', '' + this.customer.userId);
        //  localStorage.setItem('customerId', this.customer.custId)



        localStorage.setItem('customerId', '' + this.customer.custId);

      }

    })
  }
  cust!: number;
  onQuerySubmit() {
    
    if (this.queryDetail.valid) {

      this.addQuery();

    }
    else {

      ValidateForm.validateAllFormFileds(this.queryDetail)
      alert("your form is invalid");
    }
  }
  addQuery() {

    console.log(this.queryDetail);


    this.queryObj.email = this.queryDetail.value.email;
    this.queryObj.description = this.queryDetail.value.description;
    this.queryObj.customerID = this.queryDetail.value.customerID;
    this.queryService.addQuery(this.queryObj).subscribe(res => {
      console.log(res);
      alert('Query added sucessfully');
      this.queryDetail.reset();
      this.getQuries()
      location.reload();

    }, err => {
      alert('Check your fields');

    });

  }

  fetchCustomerDetails(custId: number) {
    console.log(custId)

    this.http.get<customer>(`https://localhost:7237/api/Customer/getCustomerById/${custId}`).subscribe((data) => {
      this.customer = data;
      console.log(data);


    });
  }
  onSubmit() {
    this.queryService.addQuery(this.queryDetail.value).subscribe(() => {
      alert('Query sent successfully!');
      this.queryDetail.reset();
    });
  }
  updateQuery() {

    this.queryObj.customerID = this.queryDetail.value.customerID;
    this.queryObj.queryId = this.queryDetail.value.queryId;
    this.queryObj.email = this.queryDetail.value.email;
    this.queryObj.description = this.queryDetail.value.description;
    this.queryObj.reply = this.queryDetail.value.reply;

    this.queryService.updateQuery(this.queryObj).subscribe(res => {
      console.log(res);

      alert('update sucessfull');

      this.getQuries();
    }, err => {
      console.log(err);
    })



  }
  editQuery(query: query) {
    this.queryDetail.controls['customerID'].setValue(query.customerID);
    this.queryDetail.controls['queryId'].setValue(query.queryId);
    this.queryDetail.controls['email'].setValue(query.email);
    this.queryDetail.controls['description'].setValue(query.description);
    this.queryDetail.controls['reply'].setValue(query.reply);

    
  }

  getQuries() {
    {
      this.queryService.getQuery(this.currentPage, this.pageSize).subscribe({
        next: (response) => {

          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);

          this.totalQuriesCount = paginationData.TotalCount;
          this.quries = response.body;

        }
      })
    }
  }
  onSearch() {
    console.log(typeof this.searchQuery)
    this.queryService.getFilterQuery(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalQuriesCount = paginationData.TotalCount;
        this.quries = response.body;

      }
    })
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalQuriesCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getQuries();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getQuries();
  }
}





