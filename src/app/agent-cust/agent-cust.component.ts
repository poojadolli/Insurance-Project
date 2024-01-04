import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from 'src/Models/agent-cust.model';
import { AgentCustService } from '../Services/agent-cust.service';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-agent-cust',
  templateUrl: './agent-cust.component.html',
  styleUrls: ['./agent-cust.component.css']
})
export class AgentCustComponent {


  custDetail !: FormGroup;
  custObj: customer = new customer();
  currentPage: number = 1;

  totalPages: number = 1;
  searchTerm: string = '';
  custList:any ;
  // <-------------->
 
  totalCustomerCount = 0;
  employees: any;
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  pageSizes: number[] = [4, 8, 9,12,15];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  customers:any
  // <-------------->

  constructor(private formBuilder: FormBuilder, private custService: AgentCustService) {

  }

  ngOnInit(): void {

    this.custDetail = this.formBuilder.group({

      custId: [''],
      custFirstName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      custLastName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      custPhoneNumber: ['', [Validators.required, ValidateForm.phoneValidator]],
      custEmail: ['', Validators.required],
      city: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      state: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      userName: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      password: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      userId: ['']
    });
    this.getAllCustomer();
this.getCustomers();

  }
  getCustomers() {
    {
      this.custService.getAllCustomer(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
  
          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);
  
          this.totalCustomerCount = paginationData.TotalCount;
          this.custList = response.body;
  
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
  
        this.totalCustomerCount = paginationData.TotalCount;
        this.custList= response.body;
  
      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalCustomerCount / this.pageSize);
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
  ////
  onSubmit() {

  
    if (this.custDetail.valid) {

      this.addCustomer();

    }
    else {

      ValidateForm.validateAllFormFileds(this.custDetail)
      alert("your form is invalid");
    }
  }
  onUpdateSubmit() {
    if (this.custDetail.valid) {
      this.updateCustomer();
    }
    else {

      ValidateForm.validateAllFormFileds(this.custDetail)
      alert("your form is invalid");
    }
  }

  addCustomer() {
debugger
    console.log(this.custDetail);

    this.custObj.custFirstName = this.custDetail.value.custFirstName;
    this.custObj.custLastName = this.custDetail.value.custLastName;
    this.custObj.city = this.custDetail.value.city;
    this.custObj.state = this.custDetail.value.state;
    this.custObj.custEmail = this.custDetail.value.custEmail;
    this.custObj.custPhoneNumber = this.custDetail.value.custPhoneNumber;
    this.custObj.password = this.custDetail.value.password;
    this.custObj.userName = this.custDetail.value.userName;
    this.custObj.status = true;
    this.custService.addCustomer(this.custObj).subscribe(res => {
      console.log(res);
      alert('Customer added sucessfully');
      this.getCustomers();
      this.custDetail.reset();

    }, err => {
      alert('something went wrong');

    });

  }

  getAllCustomer() {
    this.custService.getAllCustomer().subscribe(res => {
      this.custList = res;
      this.totalPages = Math.ceil(this.custList.length / this.pageSize);

    }
      , err => {
        console.log(err);



      });

  }



  editCustomer(cust: customer) {

    this.custDetail.controls['custId'].setValue(cust.custId);
    this.custDetail.controls['custFirstName'].setValue(cust.custFirstName);
    this.custDetail.controls['custLastName'].setValue(cust.custLastName);
    this.custDetail.controls['custPhoneNumber'].setValue(cust.custPhoneNumber);
    this.custDetail.controls['custEmail'].setValue(cust.custEmail);
    this.custDetail.controls['city'].setValue(cust.city);
    this.custDetail.controls['state'].setValue(cust.state);
    this.custDetail.controls['userId'].setValue(cust.userId);
  }
 
  deleteCustomer(cust: customer) {
    debugger
    if (window.confirm("Are you sure you want to proceed?")) {
      
      this.custService.deleteCustomer(cust).subscribe(res => {
        console.log(res);
        alert('Status changed successfully');
        this.getAllCustomer();
        window.location.reload()
      }, err => {
        console.log(err);
      }
      )
    } else {

    }
  }
  updateCustomer() {

    this.custObj.custId = this.custDetail.value.custId;
    this.custObj.custFirstName = this.custDetail.value.custFirstName;
    this.custObj.custLastName = this.custDetail.value.custLastName;
    this.custObj.city = this.custDetail.value.city;
    this.custObj.state = this.custDetail.value.state;
    this.custObj.custEmail = this.custDetail.value.custEmail;
    this.custObj.custPhoneNumber = this.custDetail.value.custPhoneNumber;
    this.custObj.userId = this.custDetail.value.userId;
    this.custService.updateCustomer(this.custObj).subscribe(res => {
      console.log(res);


      this.getAllCustomer();
    }, err => {
      console.log(err);
    })
  }
}

