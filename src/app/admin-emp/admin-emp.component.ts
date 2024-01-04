import { Component, OnInit } from '@angular/core';
import { EmpServiceService } from '../Services/emp-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/Models/admin-emp.model';
import { ValidateForm } from '../helper/validate';



@Component({
  selector: 'app-admin-emp',
  templateUrl: './admin-emp.component.html',
  styleUrls: ['./admin-emp.component.css']
})
export class AdminEmpComponent {


  empDetails!: FormGroup;
  empObj: Employee = new Employee();
  empList: any;
  // <-------------->
  currentPage = 1;
  totalEmployeeCount = 0;
  employees: any;
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  searchTerm: string = '';
  pageSizes: number[] = [4, 8, 12, 16];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  // <-------------->
  constructor(private formBuilder: FormBuilder, private empService: EmpServiceService) {

  }
  ngOnInit(): void {

    this.empDetails = this.formBuilder.group({

      employeeId: [''],
      employeeFirstName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      employeeLastName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      phoneNumber: ['', [Validators.required, ValidateForm.phoneValidator]],
      email: ['', Validators.required],
      userName: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      password: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      salary: ['', Validators.required],
      status: [''],
      userId: ['']
    });
    this.getEmployees();
  }
  //////////////////////////


  /////////////////////

  addEmployee() {
    console.log(this.empDetails);
    this.empObj.employeeFirstName = this.empDetails.value.employeeFirstName;
    this.empObj.employeeLastName = this.empDetails.value.employeeLastName;
    this.empObj.salary = this.empDetails.value.salary;
    this.empObj.email = this.empDetails.value.email;
    this.empObj.phoneNumber = this.empDetails.value.phoneNumber;
    this.empObj.userName = this.empDetails.value.userName;
    this.empObj.password = this.empDetails.value.password;

    this.empService.addEmployee(this.empObj).subscribe(res => {
      console.log(res);
      alert('Employee added sucessfully');
      this.empDetails.reset();
      this.getEmployees();
    }, err => {
      alert('something went wrong');

    });
  }

  onSubmit() {

    if (this.empDetails.valid) {

      this.addEmployee();

    }
    else {

      ValidateForm.validateAllFormFileds(this.empDetails)
      alert("your form is invalid");
    }
  }
  onUpdateSubmit() {
    if (this.empDetails.valid) {
      this.updateEmployee();
    }
    else {

      ValidateForm.validateAllFormFileds(this.empDetails)
      alert("your form is invalid");
    }
  }
  getEmployees() {

    this.empService.getAllEmployee(this.currentPage, this.pageSize).subscribe(response => {


      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalEmployeeCount = paginationData.TotalCount;
      this.empList = response.body;

    }, err => {
      console.log(err);
    });


  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalEmployeeCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getEmployees();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getEmployees();
  }
  onSearch() {

    this.empService.getFilterEmployees(this.currentPage, this.pageSize, this.searchQuery).subscribe(response => {


      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalEmployeeCount = paginationData.TotalCount;
      this.empList = response.body;

    }, err => {
      console.log(err);
    });
  }
  editEmployee(emp: Employee) {
    console.log(emp);
    this.empDetails.controls['employeeId'].setValue(emp.employeeId);
    this.empDetails.controls['employeeFirstName'].setValue(emp.employeeFirstName);
    this.empDetails.controls['employeeLastName'].setValue(emp.employeeLastName);
    this.empDetails.controls['phoneNumber'].setValue(emp.phoneNumber);
    this.empDetails.controls['email'].setValue(emp.email);
    this.empDetails.controls['salary'].setValue(emp.salary);
    this.empDetails.controls['userId'].setValue(emp.userId);

  }

  updateEmployee() {

    this.empObj.employeeId = this.empDetails.value.employeeId;
    this.empObj.employeeFirstName = this.empDetails.value.employeeFirstName;
    this.empObj.employeeLastName = this.empDetails.value.employeeLastName;
    this.empObj.salary = this.empDetails.value.salary;
    this.empObj.email = this.empDetails.value.email;
    this.empObj.phoneNumber = this.empDetails.value.phoneNumber;
    this.empObj.userId = this.empDetails.value.userId;

    this.empService.updateEmployee(this.empObj).subscribe(res => {
      console.log(res);
      this.getEmployees();
    }, err => {
      console.log(err);
    })
  }
  deleteEmployee(emp: Employee) {
    if (window.confirm("Are you sure you want to proceed?")) {
      this.empService.deleteEmployee(emp).subscribe(res => {
        console.log(res);
        alert(' Status changed Sucessfully');
        this.getEmployees();

        window.location.reload()
      }, err => {
        alert(' Status Not changed ');
        console.log(err);
      }
      )
    } else {

    }
  }

 
}


