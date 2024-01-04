import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plan } from 'src/Models/admin-plan.model';
import { PlanService } from '../Services/plan-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-plans',
  templateUrl: './agent-plans.component.html',
  styleUrls: ['./agent-plans.component.css']
})
export class AgentPlansComponent {
  planDetail !: FormGroup;
  planObj: Plan = new Plan();
  planList: any;
  api: any;
  currentPage = 1;
  totalPlanCount = 0;
  headers: any
  pageSizes: number[] = [3, 6, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';

  constructor(private formBuilder: FormBuilder, private planService: PlanService, private router: Router) {

  }
  ngOnInit(): void {
    this.getAllPlans();
    this.planDetail = this.formBuilder.group({

      planId: ['', Validators.required],
      planName: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.getAllPlans();

  }

  
    getAllPlans() {
     
      this.planService.getFilterPlans(this.currentPage, this.pageSize).subscribe({
          next: (response) => {

              const paginationHeader = response.headers.get('X-Pagination');
              console.log(paginationHeader);
              const paginationData = JSON.parse(paginationHeader!);
              console.log(paginationData.TotalCount);
              this.totalPlanCount = paginationData.TotalCount;
              this.planList = response.body;

          }
      })
  
  }
  getPlanById(plan: Plan) {
    debugger;
    this.planService.setPlan(plan);
    this.router.navigateByUrl('/agents-scheme/' + plan.planId)

  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalPlanCount / this.pageSize);
  }

  changePage(page: number) {

    this.currentPage = page;
    this.getAllPlans();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllPlans();
  }
  onSearch(){
    this.planService.getFilterPlans(this.currentPage, this.pageSize,this.searchQuery).subscribe({
      next: (response) => {

          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);

          this.totalPlanCount = paginationData.TotalCount;
          this.planList = response.body;
      }
  })
  }
}
