import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { ValidateForm } from '../helper/validate';
import { Plan } from 'src/Models/admin-plan.model';
import { PlanService } from '../Services/plan-service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-admin-add-scheme',
  templateUrl: './admin-add-scheme.component.html',
  styleUrls: ['./admin-add-scheme.component.css']
})
export class AdminAddSchemeComponent {

  schemeDetails!: FormGroup;
  schemeObj: planSchemes = new planSchemes();

  schemeList: any;
  planList: Plan[] = [];
    currentPage = 1;
  totalSchemeCount = 0;
  employees: any;
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  pageSizes: number[] = [4, 10, 15, 20];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  planScheme: Plan = new Plan();
  constructor(private formBuilder: FormBuilder, private schemeService: AgentSchemeService, private planService: PlanService, private http: HttpClient, private route: ActivatedRoute) {

  }
  ngOnInit(): void {

    this.schemeDetails = this.formBuilder.group({

      schemeId: [''],
      schemeName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      planID: ['', Validators.required],
      status: [''],
    });

    this.getAllInsuranceScheme();
    this.getPlanNames();


  }

  onSubmit() {


    if (this.schemeDetails.valid) {

      this.addScheme();

    }
    else {

      ValidateForm.validateAllFormFileds(this.schemeDetails)
      alert("Your form is invalid");
    }
  }
  onUpdateSubmit() {
    if (this.schemeDetails.valid) {
      this.updateScheme();
    }
    else {

      ValidateForm.validateAllFormFileds(this.schemeDetails)
      alert("Your form is invalid");
    }
  }


  addScheme() {
    console.log(this.schemeDetails);

    this.schemeObj.schemeName = this.schemeDetails.value.schemeName;
    this.schemeObj.planID = this.schemeDetails.value.planID;
    this.schemeService.addInsuranceScheme(this.schemeObj).subscribe(res => {
      console.log(res);
      alert('Scheme added sucessfully');

      this.schemeDetails.reset();
      this.getAllInsuranceScheme();

    }, err => {
      alert('Something went wrong');

    });
  }

  getAllInsuranceScheme() {
    this.schemeService.getAllInsuranceScheme().subscribe(res => {
      this.schemeList = res;
    }
      , err => {
        console.log(err);

      });
  }

  editScheme(scheme: planSchemes) {

    this.schemeDetails.controls['schemeId'].setValue(scheme.schemeId);
    this.schemeDetails.controls['schemeName'].setValue(scheme.schemeName);

    this.schemeDetails.controls['planID'].setValue(scheme.planID);
  }

  updateScheme() {

    this.schemeObj.schemeId = this.schemeDetails.value.schemeId;
    this.schemeObj.schemeName = this.schemeDetails.value.schemeName;
    this.schemeObj.planID = this.schemeDetails.value.planID;

    this.schemeService.updateScheme(this.schemeObj).subscribe(res => {
      console.log(res);

      alert('Scheme updated sucessfully');

      this.getAllInsuranceScheme();
    }, err => {
      console.log(err);
    })
  }
  fetchSchemeDetails(planID: any) {
    this.http.get<Plan>(`https://localhost:7237/api/InsurancePlan/getInsurancePlanById/${planID}`).subscribe((data) => {
      this.planScheme = data;
      console.log(data)
    });
  }

  getPlanNames() {
    debugger
    this.planService.getAllPlans().subscribe(
      (res: any) => {
      
        this.planList = res;
        console.log(this.planList);
      },
      (err: any) => {
        
        console.log("Unable to fetch the data");
      }
    );

  }
  deleteScheme(scheme: planSchemes) {
    this.schemeService.deleteScheme(scheme).subscribe(res => {
      console.log(res);
      alert(' Scheme deleted sucessfully');
      this.getAllInsuranceScheme();

      location.reload();
    }, err => {
      console.log(err);
    }
    )
  }
  getAllScheme() {
    this.schemeService.getSchemes(this.currentPage, this.pageSize).subscribe(response => {
      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalSchemeCount = paginationData.TotalCount;
      this.schemeList = response.body;

    }, err => {
      console.log(err);
    });

  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalSchemeCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getAllScheme();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllScheme();
  }

  onSearch() {
    this.schemeService.getFilterScheme(this.currentPage, this.pageSize, this.searchQuery).subscribe(response => {
      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalSchemeCount = paginationData.TotalCount;
      this.schemeList = response.body;

    }, err => {
      console.log(err);
    });
  }

}