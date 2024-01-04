import { Component } from '@angular/core';
import { PlanService } from '../Services/plan-service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { PlanS } from 'src/Models/admin-planScheme';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { detail } from 'src/Models/detail.model';
import { ValidateForm } from '../helper/validate';

@Component({
  selector: 'app-admin-schemes',
  templateUrl: './admin-schemes.component.html',
  styleUrls: ['./admin-schemes.component.css']
})
export class AdminSchemesComponent {

  schemeDetail !: FormGroup;
  schemeObj: planSchemes = new planSchemes();
  schemeList: any;
  api: any;
  schemeDetails!: any

  premiumType = 'yearly';
  investAmount = 0;
  premiumAmount = 0;
  totalSum = 0;
  profitRatio = 0;
  investTime = 0;
  selectedSchemeName: any;
  planId: any;
  schemesList: planSchemes[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  public pageNumbers: number[] = [];
  searchTerm: string = '';
  schemes: any[] = []

  constructor(private formBuilder: FormBuilder, private schemeService: AgentSchemeService, private planService: PlanService, private agentService: AgentSchemeService, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.planId = this.activatedRoute.snapshot.paramMap.get('id')
    this.getSchemes();
    this.schemeDetail = this.formBuilder.group({

      schemeId: ['',],
      schemeName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      status: ['',],
      planID: ['',],

    });
    this.getAllInsuranceScheme();

  }


  onSubmit() {

    
    if (this.schemeDetails.valid) {

      this.addScheme();

    }
    else {

      ValidateForm.validateAllFormFileds(this.schemeDetails)
      alert("your form is invalid");
    }
  }

  addScheme() {
    console.log(this.schemeDetails);
    this.schemeObj.schemeName = this.schemeDetail.value.schemeName;
    this.schemeObj.planID = this.planId
    this.schemeObj.status = true;
    this.schemeService.addInsuranceScheme(this.schemeObj).subscribe(res => {
      console.log(res);
      alert('Scheme added sucessfully');

      this.schemeDetails.reset();
      this.getAllInsuranceScheme();

    }, err => {
      alert('something went wrong');

    });
  }
  getAllInsuranceScheme() {
    this.schemeService.getAllInsuranceScheme().subscribe(res => {
      this.schemeList.schemes = res;
      this.pageNumbers = Array.from(Array(this.totalPages), (_, i) => i + 1);
    }
      , err => {
        console.log(err);



      });
  }

  getSchemes() {
    this.planService.getByPlan(this.planId).subscribe(res => {
      console.log(res);
      this.schemes = res;

    }, err => {
      console.log(err);
    })
  }
  getDetails(scheme: any) {
    this.selectedSchemeName = scheme.schemeName;
    this.planService.getSchemeDetails(scheme).subscribe((res) => {
      this.schemeDetails = res;
      console.log(this.schemeDetails)

    },
      (error) => {
        console.log("Could not fetch data");
      }
    )
  }


}

