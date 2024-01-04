import { Component } from '@angular/core';
import { Agent } from 'src/Models/emp-agent.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpAgentService } from '../Services/emp-agent.service';
import { ValidateForm } from '../helper/validate';
@Component({
  selector: 'app-emp-agent',
  templateUrl: './emp-agent.component.html',
  styleUrls: ['./emp-agent.component.css']
})
export class EmpAgentComponent {
  agentDetail !: FormGroup;
  agentObj: Agent = new Agent();
   agentList: Agent[] = [];
  // <-------------->
  currentPage = 1;
  totalAgentCount = 0;
  agents: any={};
  headers: any
  paginatedAgents: any[] = [];
  oldAgentObj: any
  pageSizes: number[] = [4, 8, 9];
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  // <-------------->
  constructor(private formBuilder: FormBuilder, private agentService: EmpAgentService) { }
  ngOnInit(): void {

    this.agentDetail = this.formBuilder.group({

      agentId: [''],
      agentFirstName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      agentLastName: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      phoneNumber: ['', [Validators.required, ValidateForm.phoneValidator]],
      email: ['', Validators.email],
      qualification: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
      commission: ['', [Validators.required, ValidateForm.min(0)]],
      userName: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      password: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      status: ['', Validators.required],
      userId: ['']
    });


    this.getAgents();
  }
  onSubmit() {

    
    if (this.agentDetail.valid) {

      this.addAgent();

    }
    else {

      ValidateForm.validateAllFormFileds(this.agentDetail)
      alert("your form is invalid");
    }
  }
  onUpdateSubmit() {
    if (this.agentDetail.valid) {
      this.updateAgent();
    }
    else {

      ValidateForm.validateAllFormFileds(this.agentDetail)
      alert("your form is invalid");
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalAgentCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getAgents();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAgents();
  }
  
  addAgent() {

    console.log(this.agentDetail);

    this.agentObj.agentFirstName = this.agentDetail.value.agentFirstName;
    this.agentObj.agentLastName = this.agentDetail.value.agentLastName;
    this.agentObj.qualification = this.agentDetail.value.qualification;
    this.agentObj.email = this.agentDetail.value.email;
    this.agentObj.phoneNumber = this.agentDetail.value.phoneNumber;
    this.agentObj.commission = this.agentDetail.value.commission;
    this.agentObj.password = this.agentDetail.value.password;
    this.agentObj.userName = this.agentDetail.value.userName;
    this.agentService.addAgent(this.agentObj).subscribe(res => {
      console.log(res);
      alert('Agent added sucessfully');
      this.agentDetail.reset();

    }, err => {
      alert('something went wrong');

    });
  }
  getAgents() {
    {
      this.agentService.getAllAgent(this.currentPage, this.pageSize).subscribe({
        next: (response) => {

          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);

          this.totalAgentCount = paginationData.TotalCount;
          this.agents = response.body;

        }
      })
    }
  }
  onSearch() {
    console.log(typeof this.searchQuery)
    this.agentService.getFilterAgents(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalAgentCount = paginationData.TotalCount;
        this.agents = response.body;

      }
    })
  }
   getAllAgent() {
    this.agentService.getAllAgent().subscribe(res => {
      this.agents = res;

    }, err => {
      console.log(err);

    });
  }

  editAgent(agent: Agent) {
    console.log(agent);
    this.agentDetail.controls['agentId'].setValue(agent.agentId);
    this.agentDetail.controls['agentFirstName'].setValue(agent.agentFirstName);
    this.agentDetail.controls['agentLastName'].setValue(agent.agentLastName);
    this.agentDetail.controls['phoneNumber'].setValue(agent.phoneNumber);
    this.agentDetail.controls['email'].setValue(agent.email);
    this.agentDetail.controls['qualification'].setValue(agent.qualification);
    this.agentDetail.controls['commission'].setValue(agent.commission);
    this.agentDetail.controls['userId'].setValue(agent.userId);

  }
  deleteAgent(agent: Agent) {
    if (window.confirm("Are you sure you want to proceed?")) {
   

      this.agentService.deleteAgent(agent).subscribe(res => {
        console.log(res);
        alert(' Status changed sucessfully');
        this.getAgents();

        window.location.reload()
      }, err => {
        alert(' Status not changed ');
        console.log(err);
      }
      )
    } else {

    }
  }
  
  updateAgent() {
    this.agentObj.agentId = this.agentDetail.value.agentId;
    this.agentObj.agentFirstName = this.agentDetail.value.agentFirstName;
    this.agentObj.agentLastName = this.agentDetail.value.agentLastName;
    this.agentObj.qualification = this.agentDetail.value.qualification;
    this.agentObj.email = this.agentDetail.value.email;
    this.agentObj.phoneNumber = this.agentDetail.value.phoneNumber;
    this.agentObj.userId = this.agentDetail.value.userId;
    this.agentObj.commission = this.agentDetail.value.commission;

    this.agentService.updateAgent(this.agentObj).subscribe(res => {
      console.log(res);
      this.getAgents();
    }, err => {
      console.log(err);
    })

  }

}
