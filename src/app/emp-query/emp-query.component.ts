import { Component } from '@angular/core';
import { CustomerQueryService } from '../Services/customer-query.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { query } from 'src/Models/query.model';
import { ValidateForm } from '../helper/validate';
import { Employee } from 'src/Models/admin-emp.model';
import { customer } from 'src/Models/agent-cust.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emp-query',
  templateUrl: './emp-query.component.html',
  styleUrls: ['./emp-query.component.css']
})
export class EmpQueryComponent {

  currentPage = 1;
  totalEmployeeCount = 0;
  agents: any;
  headers: any
  paginatedAgents: any[] = [];
  oldAgentObj: any
  pageSizes: number[] = [4, 8, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  quries: any
  //---------------------------
  queryDetail !: FormGroup;
  queryObj: query = new query();
  queryList: query[] = [];
  customer: customer = new customer();
  constructor(private formBuilder: FormBuilder, private queryService: CustomerQueryService, private http: HttpClient) {

  }
  ngOnInit(): void {

    this.queryDetail = this.formBuilder.group({

      customerID: [''],
      queryId: [''],
      email: ['', Validators.required],
      reply: ['', Validators.required],
      status: [''],
      description: ['', Validators.required]
    });
    this.getQuries();
  }

 


  fetchCustomerDetails(custId: number) {
    console.log(custId)

    this.http.get<customer>(`https://localhost:7237/api/Customer/getCustomerById/${custId}`).subscribe((data) => {
      this.customer = data;
      console.log(data);


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
      this.getQuries
    }, err => {
      console.log(err);
    })
  }
  onQuerySubmit() {
   
    if (this.queryDetail.valid) {
      this.updateQuery();
    }
    else {
      ValidateForm.validateAllFormFileds(this.queryDetail)
      alert("your form is invalid");
    }
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

          this.totalEmployeeCount = paginationData.TotalCount;
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

        this.totalEmployeeCount = paginationData.TotalCount;
        this.quries = response.body;

      }
    })
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalEmployeeCount / this.pageSize);
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
