import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentSchemeService } from '../Services/agent-scheme.service';
import { planSchemes } from 'src/Models/admin-scheme.model';
import { PlanS } from 'src/Models/admin-planScheme';
import { PlanService } from '../Services/plan-service';
import { ActivatedRoute, Router } from '@angular/router';
import { detail } from 'src/Models/detail.model';

@Component({
  selector: 'app-overallscheme',
  templateUrl: './overallscheme.component.html',
  styleUrls: ['./overallscheme.component.css']
})
export class OverallschemeComponent {

  schemeDetail !: FormGroup;
  schemeObj: planSchemes = new planSchemes();
  schemeList!: PlanS;
  api: any;
  schemeDetails: any
  premiumType = 'yearly';
  investAmount = 0;
  premiumAmount = 0;
  totalSum = 0;
  profitRatio = 0;
  investTime = 0;
  selectedSchemeName!: string;
  planId!: number;
  pageSizes: number[] = [3, 6, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  currentPage: number=1;
  totalSchemeCount: number=0;


  constructor(private formBuilder: FormBuilder, private schemeService: AgentSchemeService, 
    private planService: PlanService, private agentService: AgentSchemeService, private router: Router
    ,private activate:ActivatedRoute) {

  }
  ngOnInit(): void {
    
this.planId = (Number)(this.activate.snapshot.paramMap.get('id'));
    this.getSchemes();
    this.schemeDetail = this.formBuilder.group({
      schemeId: ['', Validators.required],
      schemeName: ['', Validators.required],
      status: ['', Validators.required],
      
    });
  }

  getSchemes() {
    
    this.planService.getByPlansIds(this.planId).subscribe(res => {
      console.log(res);
      this.schemeList = res;

    }, err => {
      console.log(err);
    })
  }
  getByPlanId(scheme: detail) {

    this.agentService.setPlan(detail);
    this.router.navigateByUrl('/admin-scheme/' + scheme.insuranceSchemeId)
  }
  getDetails(scheme: any) {
    this.planService.getSchemeDetails(scheme).subscribe((res) => {
      this.schemeDetails = res;
      console.log(this.schemeDetails)

    },
      (error) => {
        console.log("Could not fetch data");
      }
    )
  }
  buyPolicy(scheme:any) {
  
    this.router.navigateByUrl('/policy/'+scheme.schemeId)
  }
  calculateTotalSumAndPremiumAmount() {
    console.log('investAmount:', this.investAmount);
    console.log('premiumType:', this.premiumType);
    console.log('profitRatio:', this.profitRatio);
    console.log('investTime:', this.investTime);

    // Initialize premiumMultiplier based on premiumType
    let premiumMultiplier = 1;
    if (this.premiumType === 'yearly') {
      premiumMultiplier = 12; // 1 year has 12 months
    } else if (this.premiumType === 'quarterly') {
      premiumMultiplier = 3; // 3 months in a quarter
    } else if (this.premiumType === 'monthly') {
      premiumMultiplier = 1; // Monthly premium
    }

    // Calculate the premium amount
    this.premiumAmount = (this.investAmount) / premiumMultiplier;

    // Calculate the total sum
    const decimalProfitRatio = this.profitRatio / 100;

    // Calculate the total sum
    this.totalSum = this.investAmount + (this.investAmount * decimalProfitRatio);

    // Calculate the number of installments
    const totalInstallments = this.investTime / premiumMultiplier;

    // Now, calculate the premium amount based on the selected premium type
    this.premiumAmount = this.investAmount / totalInstallments;
  }
  openCalculateModal(schemeName: string) {
    // Store the selected scheme name
    this.selectedSchemeName = schemeName;

    // Open the calculate modal
    // You can open the modal programmatically here if needed
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalSchemeCount / this.pageSize);
  }

  changePage(page: number) {

    this.currentPage = page;
    // this.getAllPlans();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    // this.getAllPlans();
  }
  onSearch(){

  }
}
