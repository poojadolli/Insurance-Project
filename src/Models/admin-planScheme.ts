import { planSchemes } from "./admin-scheme.model";

export class PlanS {
    planId: number = 0;
    planName: string = '';
    status: boolean = false;
    schemes: planSchemes[] = [];

    investTime: number = 0;
    investAmount: number = 0;
    premiumType: string = '';
    profitRatio: number = 0;
    totalSum: number = 0;
    premiumAmount: number = 0;
}