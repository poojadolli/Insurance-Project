
export class payment {
    paymentId: number = 0
    paymentType: string = ''
    amount: number = 0
    date:Date=new Date()
    tax: number = 0
    totalPayment: number = 0
    policyNumber!: number
    cardHolderName: string=''
    cardNumber:string=''
    cvvNo:string=''
    expiryDate:Date= new Date()


    
}