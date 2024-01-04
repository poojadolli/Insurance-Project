import { Component } from '@angular/core';
import { AgentCustService } from '../Services/agent-cust.service';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { customer } from 'src/Models/agent-cust.model';

@Component({
  selector: 'app-emp-documents',
  templateUrl: './emp-documents.component.html',
  styleUrls: ['./emp-documents.component.css']
})
export class EmpDocumentsComponent {
  customerID: any
  documents: any
  customer:customer=new customer()
  headers: any
  employeeDocuments:any[]=[]
  currentPage: number = 1
  pageSizes: number[] = [10, 20, 30];
  totalDocumentCount = 0;
  pageSize = this.pageSizes[0];
  constructor(private customers: AgentCustService, private activatedroute: ActivatedRoute, private http: HttpClient) { }
  isEmployee = false
  isAdmin = false
  jwtHelper = new JwtHelperService()

  ngOnInit() {
    this.customerID = this.activatedroute.snapshot.paramMap.get('id');
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);

    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'Employee') {
      this.isEmployee = true
    }
    else {
      this.isAdmin = true
    }
    this.getDocuments()
  }
  getDocuments() {
    this.customers.getAllDocuments().subscribe({
      next: (res) => {
        this.employeeDocuments = res;
        const documents = res;
        console.log(documents);
        // Handle the retrieved documents as needed
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  getDocument() {
    this.customers.getCustomerDocumentsOnly(this.customerID, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);
        this.totalDocumentCount = paginationData.TotalCount;
        this.documents = response.body;
        console.log(this.documents)

      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalDocumentCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getDocuments();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getDocuments();
  }
  downloadDocument(doc: any) {
    this.customers.downloadFile(doc.documentId).subscribe((response) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const fileName = contentDispositionHeader?.split(';')[1].split('filename=')[1].trim();

      if (response.body instanceof Blob && fileName) {
        const blob = new Blob([response.body], { type: response.body.type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Response body is not a blob.');
      }
    });
  }
  updateDocumentStatus(data: any) {
    this.customers.updateCustomerDocuments(data.documentId).subscribe(
      (res) => {
        alert("Updated successfully");
      },
      (err) => {
        alert("Something went wrong");
      }
    )
  }

  fetchCustomerDetails(custId: number) {
    console.log(custId)
    this.http.get<customer>(`https://localhost:7237/api/Customer/getCustomerById/${custId}`).subscribe((data) => {
      this.customer = data;
      console.log(data);
    });
  }
}
