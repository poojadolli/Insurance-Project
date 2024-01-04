
export class policy {
    policyNumber: number = 0;
    issueDate: Date = new Date()
    maturityDate: Date = new Date()
    premiumType! :string;
    premiumAmount: number = 0;
    paymentCount:number=0;
    sumAssured: number = 0;
    status: boolean = false
    schemeId: number = 0
    customerID: number = 0
    agentId?: number ;
    installment: number = 0;
}