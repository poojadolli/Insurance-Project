import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgentCustService } from '../Services/agent-cust.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {


  customerProfile: any
  documents: any
  headers: any
  currentPage: number = 1
  pageSizes: number[] = [10, 20, 30];
  totalDocumentCount = 0;
  pageSize = this.pageSizes[0];
  constructor(private customer: AgentCustService, private http: HttpClient) { }

  ngOnInit() {

    this.getDocuments()
  }


  getDocuments() {

    this.customer.getProfile().subscribe({
      next: (res) => {
        this.customerProfile = res;
        this.customer.getCustomerDocumentsOnly(this.customerProfile.custId, this.currentPage, this.pageSize).subscribe({
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
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
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

    this.customer.downloadFile(doc.documentId).subscribe((response) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const fileName = contentDispositionHeader?.split(';')[1].split('filename=')[1].trim();

      if (response.body instanceof Blob && fileName) {
        // Create a Blob object from the response data
        const blob = new Blob([response.body], { type: response.body.type });

        // Trigger a file download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Response body is not a Blob.');
      }
    });
  }
  fileToUpload: File | null = null; // Initialize it as null
  custId: number = 0;
  uploadDocument() {
    
    if (this.fileToUpload) {
      this.customer.uploadDocument(this.fileToUpload, this.customerProfile.custId).subscribe(
        (response) => {
          // Handle the response from the server after successful upload if needed
          console.log('Upload successful', response);
          alert("document uploaded succesfully");
        },
        (error) => {
          // Handle errors if the upload fails
          console.error('Upload failed', error);
        }
      );
    } else {
      // Handle the case where there is no file selected, e.g., show an error message.
      console.error('No file selected for upload.');
    }
  }



  onFileSelected(files: FileList | null) {
    if (files && files.length > 0) {
      this.fileToUpload = files[0];
    } else {
      // Handle the case where there is no file selected, e.g., show an error message.
      this.fileToUpload = null;
      console.error('No file selected.');
    }
  }
}
