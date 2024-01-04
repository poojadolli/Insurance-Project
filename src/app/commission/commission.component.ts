import { Component } from '@angular/core';
import { CommissionService } from '../Services/commission.service';
import { Commission } from 'src/Models/Commisiion.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidateForm } from '../helper/validate';
import { PolicyService } from '../Services/policy.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent {
  commDetail !: FormGroup;
  commObj: Commission = new Commission();
  commList: Commission[] = [];
  agentProfile: any;
  constantamount: number = 2000;
  agentId: any;

  currentDate: string;

  constructor(private formBuilder: FormBuilder, private custService: CommissionService, private policyService: PolicyService) {

    this.currentDate = new Date().toISOString().split('T')[0];


  }

  ngOnInit(): void {
    this.getAllCommission();
    this.commDetail = this.formBuilder.group({

      agentId: [''],
      commissionId: ['', Validators.required],
      amount: [1000, [Validators.required, ValidateForm.min(0)]],
      date: ['', Validators.required],
      policyNumber: ['', [Validators.required, ValidateForm.min(0)]],
      status: [false],

    });
    this.policyService.getProfile().subscribe({
      next: (res) => {
        this.agentProfile = res;
        this.agentId = this.agentProfile.agentId; // Store the agent ID
        console.log(res);
        localStorage.setItem('userId', this.agentProfile.userId);
        localStorage.setItem('agentId', this.agentProfile.agentId);
      }
    });

  }



  addCommission() {
    this.commDetail.patchValue({ date: this.currentDate });

    console.log(this.commDetail);

    this.commObj.agentId = this.agentId;
    this.commObj.amount = this.commDetail.value.amount;
    this.commObj.policyNumber = this.commDetail.value.policyNumber;
    this.commObj.date = this.commDetail.value.date;
    this.commObj.status = false
    this.custService.addCommission(this.commObj).subscribe(res => {
      console.log(res);
      alert('Thank-You');
      this.commDetail.reset();

    }, err => {
      alert('something went wrong');

    });

  }

  getAllCommission() {
    this.custService.getAllCommission().subscribe(res => {
      this.commList = res;

    }
      , err => {
        console.log(err);



      });

  }
}
