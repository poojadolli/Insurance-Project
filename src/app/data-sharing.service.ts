import { Injectable } from '@angular/core';
type PremiumTypeMonths = {
  [key: string]: number;
};
@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  public premiumAmount: number = 0  // Define as public to allow access from other components

  setPremiumAmount(amount: number) {
    this.premiumAmount = amount;
  }

  getPremiumAmount(): number {
    return this.premiumAmount;
  }
  calculatePremiumDates(issueDate: Date, investTime: number, premiumType: string): Date[] {
    const premiumTypeMonths: PremiumTypeMonths = {
      yearly: 12,
      monthly: 1,
      quarterly: 3
    };
    const premiumDates: Date[] = [];

    if (issueDate && investTime) {
      const currentDate = new Date(issueDate);

      for (let i = 0; i < investTime; i++) {
        premiumDates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + premiumTypeMonths[premiumType]);
      }
    }
    return premiumDates;
  }
  private isPaid: boolean = false;

  setIsPaidStatus(status: boolean) {
    this.isPaid = status;
  }

  getIsPaidStatus() {
    return this.isPaid;
  }
}






