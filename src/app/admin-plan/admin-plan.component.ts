import { Component, OnInit } from '@angular/core';
import { PlanService } from '../Services/plan-service';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plan } from 'src/Models/admin-plan.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PlanS } from 'src/Models/admin-planScheme';
import { ValidateForm } from '../helper/validate';

@Component({
    selector: 'app-admin-plan',
    templateUrl: './admin-plan.component.html',
    styleUrls: ['./admin-plan.component.css']
})
export class AdminPlanComponent {
    planDetail !: FormGroup;
    planObj: Plan = new Plan();
    planList: any;
    // <-------------->
    currentPage = 1;
    totalPlanCount = 0;
    employees: any;
    headers: any
    paginatedEmployees: any[] = [];
    oldEmpObj: any
    pageSizes: number[] = [4,10,15,20];
    pageSize = this.pageSizes[0];
    searchQuery: string | number = '';
    // <-------------->
    api: any;

    constructor(private formBuilder: FormBuilder, private planService: PlanService, private router: Router) {

    }
    ngOnInit(): void {
        
        this.planDetail = this.formBuilder.group({

            planId: [''],
            planName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
            status: ['',],
        });
        this.getAllPlans();

    }

    onSubmit() {

        if (this.planDetail.valid) {
            this.addInsurancePlan();
        }
        else {
            ValidateForm.validateAllFormFileds(this.planDetail)
            alert("your form is invalid");
        }
    }
    onUpdateSubmit() {
        if (this.planDetail.valid) {
            this.updatePlan();
        }
        else {

            ValidateForm.validateAllFormFileds(this.planDetail)
            alert("your form is invalid");
        }
    }

    //////////////////////////
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
 

    addInsurancePlan() {

        console.log(this.planDetail);
        this.planObj.planId = this.planDetail.value.planId;
        this.planObj.planName = this.planDetail.value.planName;

        this.planService.addInsurancePlan(this.planObj).subscribe(res => {
            console.log(res);
            alert("Plan Added succesfully")
            this.planDetail.reset();
            location.reload();
        }, err => {
            console.log(err);

        });
    }
    onSearch() {
        console.log(typeof this.searchQuery)
        this.planService.getFilterPlans(this.currentPage, this.pageSize, this.searchQuery).subscribe({
            next: (response) => {

                const paginationHeader = response.headers.get('X-Pagination');
                console.log(paginationHeader);
                const paginationData = JSON.parse(paginationHeader!);
                console.log(paginationData.TotalCount);

                this.totalPlanCount = paginationData.TotalCount;
                this.planList = response.body;

            },
            error:(err)=>{
                console.log(err);
            }
        })
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
    editPlan(plan: Plan) {
        this.planDetail.controls['planId'].setValue(plan.planId);
        this.planDetail.controls['planName'].setValue(plan.planName);

    }
    updatePlan() {
        debugger

        this.planObj.planId = this.planDetail.value.planId;
        this.planObj.planName = this.planDetail.value.planName;


        this.planService.updatePlan(this.planObj).subscribe(res => {
            console.log(res);
            alert("Plan Updated Successfully")
            this.getAllPlans();
        }, err => {

            console.log(err);
        })
    }
    deletePlan(plan: Plan) {
        this.planService.deletePlan(plan).subscribe(res => {
            console.log(res);
            alert(' Plan Deleted Sucessfully');
            this.getAllPlans();
        }, err => {
            console.log(err);
        }
        )
    }

    getPlanById(plan: Plan) {

        this.planService.setPlan(plan);
        this.router.navigateByUrl('/admin-scheme/' + plan.planId)
    }

}

