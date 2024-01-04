import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from 'src/Models/agent-cust.model';
import { AgentCustService } from '../Services/agent-cust.service';

@Component({
  selector: 'app-emp-cust',
  templateUrl: './emp-cust.component.html',
  styleUrls: ['./emp-cust.component.css']
})
export class EmpCustComponent {
  custDetail !: FormGroup;
  custObj: customer = new customer();
  custList: customer[] = [];
  // <-------------->
  currentPage = 1;
  totalEmployeeCount = 0;
  customers: any;
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  pageSizes: number[] = [3, 6, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  // <-------------->


  constructor(private formBuilder: FormBuilder, private custService: AgentCustService) {

  }

  ngOnInit(): void {

    this.custDetail = this.formBuilder.group({

      custId: ['', Validators.required],
      custFirstName: ['', Validators.required],
      custLastName: ['', Validators.required],
      custPhoneNumber: ['', Validators.required],
      custEmail: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.getCustomers();


  }
  addCustomer() {

    console.log(this.custDetail);

    this.custObj.custFirstName = this.custDetail.value.custFirstName;
    this.custObj.custLastName = this.custDetail.value.custLastName;
    this.custObj.city = this.custDetail.value.city;
    this.custObj.state = this.custDetail.value.state;
    this.custObj.custEmail = this.custDetail.value.custEmail;
    this.custObj.custPhoneNumber = this.custDetail.value.custPhoneNumber;
    this.custObj.status = true;
    this.custService.addCustomer(this.custObj).subscribe(res => {
      console.log(res);
      alert('Customer added sucessfully');
      this.custDetail.reset();
      this.getCustomers();
    }, err => {
      alert('something went wrong');

    });

  }

  getAllCustomer() {
    this.custService.getAllCustomer().subscribe(res => {
      this.custList = res;
    }
      , err => {
        console.log(err);
      });
  }

  //==============================================
  getCustomers() {
    {
      this.custService.getAllCustomer(this.currentPage, this.pageSize).subscribe({
        next: (response) => {

          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);

          this.totalEmployeeCount = paginationData.TotalCount;
          this.customers = response.body;

        }
      })
    }
  }

  onSearch() {
    console.log(typeof this.searchQuery)
    this.custService.getFilterCustomers(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalEmployeeCount = paginationData.TotalCount;
        this.customers = response.body;

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
    this.getCustomers();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getCustomers();
  }
}


