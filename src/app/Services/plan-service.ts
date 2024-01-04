import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Plan } from "src/Models/admin-plan.model";
import { PlanS } from "src/Models/admin-planScheme";
import { scheme } from "src/Models/schemedetail.model";

@Injectable({
    providedIn: 'root'
})
export class PlanService {
    planObj!: Plan;
   
    baseURL:string="https://localhost:4040/api/"
    constructor(private http: HttpClient) {

       

    }
    addInsurancePlan(plan: Plan): Observable<Plan> {
        return this.http.post<Plan>(this.baseURL+"InsurancePlan/addInsurancePlan", plan);
    }
    getAllPlans(): Observable<Plan[]> {
        return this.http.get<Plan[]>(this.baseURL+"InsurancePlan/get");
    }
    updatePlan(plan: Plan): Observable<Plan> {
        return this.http.put<Plan>(this.baseURL+"InsurancePlan/updateInsurancePlan", plan);
    }
    deletePlan(plan: Plan): Observable<Plan> {
        return this.http.delete<Plan>(this.baseURL+"InsurancePlan/deleteInsurancePlan"+ '/'+plan.planId)
    }
    containsOnlyDigits(s: string) {
        return /^\d+$/.test(s);
    }
    getFilterPlans(pgNo?: number, pgSize?: number, searchQuery?: any) {
        var serachUrl =this.baseURL+ "InsurancePlan/get?PageNumber=" + pgNo + "&PageSize=" + pgSize;
        if (searchQuery !== undefined) {
            if (this.containsOnlyDigits(searchQuery)) {
                searchQuery = parseInt(searchQuery);
            }

            serachUrl += (typeof searchQuery === 'number') ? `&PlanId=${searchQuery}` : ` &PlanName=${searchQuery}`;
        }

        return this.http.get(serachUrl, { observe: 'response' });

    }
    setPlan(plan: Plan) {
        this.planObj = plan;
    }
    getByPlanId(planId: number): Observable<PlanS> {
        return this.http.get<PlanS>(this.baseURL +"InsurancePlan/getInsurancePlanById" + '/' + planId)
    }
    getByPlan(planId: number): Observable<PlanS[]> {
        return this.http.get<PlanS[]>(this.baseURL + "InsurancePlan/getInsurancePlanById" + '/' + planId)
    }
    getByPlansId(plan: Plan): Observable<PlanS> {
        return this.http.get<PlanS>(this.baseURL + "InsurancePlan/getInsurancePlanById" + '/' + plan.planId)
    }
    getByPlansIds(plan: number): Observable<PlanS> {
        return this.http.get<PlanS>(this.baseURL + "InsurancePlan/getInsurancePlanById"+ '/'+ plan)
    }
    getSchemeDetails(scheme: any) {
        return this.http.get(this.baseURL+"SchemeDetail/getschemedetailByInsuranceSchemeId/" + scheme.schemeId);
    }
    getSchemeDetail(scheme: number) {
        return this.http.get(this.baseURL+"SchemeDetail/getschemedetailByInsuranceSchemeId/" + scheme);
    }
    getSchemeBySchemeID(sechmeId: number) {
        return this.http.get(this.baseURL+"InsuranceScheme/getInsuranceSchemeById/" + sechmeId)

    }

}