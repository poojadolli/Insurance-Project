

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpAgentService } from '../Services/emp-agent.service';
import { Agent } from 'src/Models/emp-agent.model';

@Component({
  selector: 'app-admin-agent',
  templateUrl: './admin-agent.component.html',
  styleUrls: ['./admin-agent.component.css']
})
export class AdminAgentComponent {
  agentDetail !: FormGroup;
  agentObj: Agent = new Agent();
  agentList: any;
  agents: any;
  totalAgentCount = 0;
  currentPage = 1;
  searchQuery: string | number = '';
  headers: any;
  pageSizes: number[] = [4, 8, 12, 16];
  pageSize = this.pageSizes[0];


  constructor(private formBuilder: FormBuilder, private agentService: EmpAgentService) { }
  ngOnInit(): void {

    this.agentDetail = this.formBuilder.group({

      agentId: ['', Validators.required],
      agentFirstName: ['', Validators.required],
      agentLastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      qualification: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.getAllAgent();
  }

  addAgent() {

    console.log(this.agentDetail);

    this.agentObj.agentFirstName = this.agentDetail.value.agentFirstName;
    this.agentObj.agentLastName = this.agentDetail.value.agentLastName;
    this.agentObj.qualification = this.agentDetail.value.qualification;
    this.agentObj.email = this.agentDetail.value.email;
    this.agentObj.phoneNumber = this.agentDetail.value.phoneNumber;
    this.agentObj.status = this.agentDetail.value.status === 'true';
    this.agentService.addAgent(this.agentObj).subscribe(res => {
      console.log(res);
      alert('Agent added sucessfully');
      this.agentDetail.reset();

    }, err => {
      alert('something went wrong');

    });
  }

  getAllAgent() {
    this.agentService.getAllAgent(this.currentPage, this.pageSize).subscribe(response => {
      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalAgentCount = paginationData.TotalCount;
      this.agentList = response.body;

    }, err => {
      console.log(err);
    });

  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalAgentCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getAllAgent();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllAgent();
  }

  onSearch() {
    this.agentService.getFilterAgents(this.currentPage, this.pageSize, this.searchQuery).subscribe(response => {
      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalAgentCount = paginationData.TotalCount;
      this.agentList = response.body;

    }, err => {
      console.log(err);
    });
  }

}