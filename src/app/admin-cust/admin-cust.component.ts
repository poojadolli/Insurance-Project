import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customer } from 'src/Models/agent-cust.model';
import { AgentCustService } from '../Services/agent-cust.service';

@Component({
  selector: 'app-admin-cust',
  templateUrl: './admin-cust.component.html',
  styleUrls: ['./admin-cust.component.css']
})
export class AdminCustComponent {

  custDetail !: FormGroup;
  custObj: customer = new customer();
  custList: any;
  currentPage = 1;
  totalCustomerCount = 0;
  headers: any
  
  searchTerm: string = '';
  pageSizes: number[] = [4,8,12,16];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';


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
      status: [''],
    });

    this.getAllCustomer();


  }



  addCustomer() {

    console.log(this.custDetail);

    this.custObj.custFirstName = this.custDetail.value.custFirstName;
    this.custObj.custLastName = this.custDetail.value.custLastName;
    this.custObj.city = this.custDetail.value.city;
    this.custObj.state = this.custDetail.value.state;
    this.custObj.custEmail = this.custDetail.value.custEmail;
    this.custObj.custPhoneNumber = this.custDetail.value.custPhoneNumber;
    this.custService.addCustomer(this.custObj).subscribe(res => {
      console.log(res);
      alert('Customer added sucessfully');
      this.custDetail.reset();

    }, err => {
      alert('something went wrong');

    });

  }

  getAllCustomer() {
    this.custService.getAllCustomer(this.currentPage,this.pageSize).subscribe(response => {
      const paginationHeader = response.headers.get('X-Pagination');
                console.log(paginationHeader);
                const paginationData = JSON.parse(paginationHeader!);
                console.log(paginationData.TotalCount);

                this.totalCustomerCount = paginationData.TotalCount;
                this.custList = response.body;

    }, err => {
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
    this.getAllCustomer();
}
calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
}
onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllCustomer();
}

onSearch() {
  this.custService.getAllCustomer(this.currentPage,this.pageSize,this.searchQuery).subscribe(response => {
    const paginationHeader = response.headers.get('X-Pagination');
              console.log(paginationHeader);
              const paginationData = JSON.parse(paginationHeader!);
              console.log(paginationData.TotalCount);

              this.totalCustomerCount = paginationData.TotalCount;
              this.custList = response.body;

  }, err => {
      console.log(err);
    });
}

}


