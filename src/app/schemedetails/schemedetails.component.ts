import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetailService } from '../Services/detail.service';
import { scheme } from 'src/Models/schemedetail.model';
import { ValidateForm } from '../helper/validate';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { HttpClient } from '@angular/common/http';
import { AgentCustService } from '../Services/agent-cust.service';
import { AgentSchemeService } from '../Services/agent-scheme.service';

@Component({
  selector: 'app-schemedetails',
  templateUrl: './schemedetails.component.html',
  styleUrls: ['./schemedetails.component.css']
})
export class SchemedetailsComponent {

  schemes:any
  currentPage = 1;
  totalEmployeeCount = 0;
  employees: any;
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  pageSizes: number[] = [4, 8, 12];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
schemeList:any
  schemeDetail !: FormGroup;
  schemeObj: scheme = new scheme();
  scheme: planSchemes = new planSchemes();
  planList: planSchemes[] = [];
  constructor(private formBuilder: FormBuilder, private schemeService: DetailService, private http: HttpClient, private agentService: AgentSchemeService) {

  }
  ngOnInit(): void {

    this.schemeDetail = this.formBuilder.group({

      detailId: [''],

      description: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      minimumAmount: ['', [Validators.required, ValidateForm.rangeValidator(500, 1000)]],
      maximumAmount: ['', [Validators.required, ValidateForm.rangeValidator(1000, 1000000)]],
      minimumInvestTime: ['', [Validators.required, ValidateForm.rangeValidator(1, 2)]],
      maximumInvestTime: ['', [Validators.required, ValidateForm.rangeValidator(3, 12)]],
      maximumAge: ['', [Validators.required, ValidateForm.rangeValidator(25, 100)]],
      minimumAge: ['', [Validators.required, ValidateForm.rangeValidator(18, 25)]],
      profitRatio: [null, [Validators.required, ValidateForm.min(0)]],

      registrationCommRatio: ['', [Validators.required, ]],
      installmentCommRatio: [''],
      insuranceSchemeId: [''],
      status: ['']
    });
    this.getAllScheme();
    this.getPlanNames();
  }
  addScheme() {
    debugger
    console.log(this.schemeDetail);

    this.schemeObj.detailId = this.schemeDetail.value.detailId;

    this.schemeObj.description = this.schemeDetail.value.description;
    this.schemeObj.minimumAmount = this.schemeDetail.value.minimumAmount;
    this.schemeObj.maximumAmount = this.schemeDetail.value.maximumAmount;
    this.schemeObj.minimumInvestTime = this.schemeDetail.value.minimumInvestTime;
    this.schemeObj.maximumInvestTime = this.schemeDetail.value.maximumInvestTime;
    this.schemeObj.maximumAge = this.schemeDetail.value.maximumAge;
    this.schemeObj.minimumAge = this.schemeDetail.value.minimumAge;
    this.schemeObj.profitRatio = this.schemeDetail.value.profitRatio;

    this.schemeObj.registrationCommRatio = this.schemeDetail.value.registrationCommRatio;
    this.schemeObj.insuranceSchemeId = this.schemeDetail.value.insuranceSchemeId;
    this.schemeObj.installmentCommRatio = this.schemeDetail.value.installmentCommRatio;
    this.schemeService.addScheme(this.schemeObj).subscribe(res => {
      console.log(res);
      alert('Scheme added sucessfully');
      this.schemeDetail.reset();
      location.reload();

    }, err => {
      alert('something went wrong');

    });

  }

  getAllScheme() {
    this.schemeService.getAllScheme().subscribe(res => {
      this.schemeList = res;
    }
      , err => {
        console.log(err);
      });

  }
  updateScheme() {
    this.schemeObj.detailId = this.schemeDetail.value.detailId;
    this.schemeObj.description = this.schemeDetail.value.description;
    this.schemeObj.minimumAmount = this.schemeDetail.value.minimumAmount;
    this.schemeObj.maximumAmount = this.schemeDetail.value.maximumAmount;
    this.schemeObj.minimumInvestTime = this.schemeDetail.value.minimumInvestTime;
    this.schemeObj.maximumInvestTime = this.schemeDetail.value.maximumInvestTime;
    this.schemeObj.maximumAge = this.schemeDetail.value.maximumAge;
    this.schemeObj.minimumAge = this.schemeDetail.value.minimumAge;
    this.schemeObj.profitRatio = this.schemeDetail.value.profitRatio;
    this.schemeObj.registrationCommRatio = this.schemeDetail.value.registrationCommRatio;
    this.schemeObj.insuranceSchemeId = this.schemeDetail.value.insuranceSchemeId;
    this.schemeObj.installmentCommRatio = this.schemeDetail.value.installmentCommRatio;
    this.schemeService.updateScheme(this.schemeObj).subscribe(res => {
      console.log(res);
      alert('update sucessfull');
      this.getAllScheme();
    }, err => {
      console.log(err);
    })
  }
  editScheme(scheme: scheme) {
    this.schemeDetail.controls['detailId'].setValue(scheme.detailId);
    this.schemeDetail.controls['description'].setValue(scheme.description);
    this.schemeDetail.controls['maximumAmount'].setValue(scheme.maximumAmount);
    this.schemeDetail.controls['minimumAmount'].setValue(scheme.minimumAmount);
    this.schemeDetail.controls['maximumInvestTime'].setValue(scheme.maximumInvestTime);
    this.schemeDetail.controls['minimumInvestTime'].setValue(scheme.minimumInvestTime);
    this.schemeDetail.controls['maximumAge'].setValue(scheme.maximumAge);
    this.schemeDetail.controls['minimumAge'].setValue(scheme.minimumAge);
    this.schemeDetail.controls['profitRatio'].setValue(scheme.profitRatio);
    this.schemeDetail.controls['registrationCommRatio'].setValue(scheme.registrationCommRatio);
    this.schemeDetail.controls['insuranceSchemeId'].setValue(scheme.insuranceSchemeId);
    this.schemeDetail.controls['installmentCommRatio'].setValue(scheme.installmentCommRatio);
  }
  deleteScheme(scheme: scheme) {
    this.schemeService.deleteScheme(scheme).subscribe(res => {
      console.log(res);
      alert(' Scheme Deleted Sucessfully');
      location.reload();
      this.getAllScheme();

    }, err => {
      console.log(err);
    }
    )
  }
  fetchCustomerDetails(schemedetails: number) {
    this.http.get<planSchemes>(`https://localhost:7237/api/InsuranceScheme/getInsuranceSchemeById/${schemedetails}`).subscribe((data) => {
      this.scheme = data;
      console.log(data);


    });
  }
  getPlanNames() {
    debugger
    this.agentService.getAllInsuranceScheme().subscribe(
      (res: any) => {
        this.planList = res;
      },
      (err: any) => {
        console.log("unable to fetch the data");
      }
    );

  }
  getSchemes() {
    {
      debugger
      this.schemeService. getAllSchemes(this.currentPage, this.pageSize).subscribe({
        next: (response) => {

          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);

          this.totalEmployeeCount = paginationData.TotalCount;
          this.schemeList = response.body;


        }
      })
    }
  }

  onSearch() {
    console.log(typeof this.searchQuery)
    this.schemeService.getFilterSchemes(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalEmployeeCount = paginationData.TotalCount;
        this.schemeList = response.body;

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
    this.getSchemes();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getSchemes();
  }


}
