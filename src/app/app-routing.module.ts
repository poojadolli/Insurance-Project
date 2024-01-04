import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { CustomerComponent } from './customer-dashboard/customer.component';
//import { PlansComponent } from './plans/plans.component';

import { AdminComponent } from './admin-dashboard/admin.component';
// import { EmployeeComponent } from './employee-dashboard/employee.component';
// import { AgentComponent } from './agent-dashboard/agent.component';

import { AdminEmpComponent } from './admin-emp/admin-emp.component';
import { AdminPlanComponent } from './admin-plan/admin-plan.component';
import { AdminSchemesComponent } from './admin-schemes/admin-schemes.component';
import { CustomerPlansComponent } from './customer-plans/customer-plans.component';
import { EmpAgentComponent } from './emp-agent/emp-agent.component';
//import { AgentCustComponent } from './agent-cust/AgentCustComponent';
import { AdminAgentComponent } from './admin-agent/admin-agent.component';
//import { AdminCustComponent } from './admin-cust/admin-cust.component';

import { EmpCustComponent } from './emp-cust/emp-cust.component';
import { AdminAddSchemeComponent } from './admin-add-scheme/admin-add-scheme.component';
import { RegsiterComponent } from './regsiter/regsiter.component';
//import { CustQueryComponent } from './cust-query/CustQueryComponent';
import { EmpQueryComponent } from './emp-query/emp-query.component';

import { OverallschemeComponent } from './overallscheme/overallscheme.component';
//import { AdminProfileComponent } from './admin-dashboard/admin-profile/AdminProfileComponent';
import { AgentComponent } from './agent/agent.component';
import { EmployeeComponent } from './employee/employee.component';
import { CustQueryComponent } from './cust-query/cust-query.component';
import { SchemedetailsComponent } from './schemedetails/schemedetails.component';
import { PolicyComponent } from './policy/policy.component';
import { PolicyTableComponent } from './policy-table/policy-table.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { AdminProfComponent } from './Profile/admin-prof/admin-prof.component';
import { CustProfComponent } from './Profile/cust-prof/cust-prof.component';
import { AgentProfComponent } from './Profile/agent-prof/agent-prof.component';
import { EmpProfComponent } from './Profile/emp-prof/emp-prof.component';
import { DocumentComponent } from './document/document.component';
import { AdminCustComponent } from './admin-cust/admin-cust.component';
import { AgentCustComponent } from './agent-cust/agent-cust.component';
import { AgentPlansComponent } from './agent-plans/agent-plans.component';
import { AgentSchemesComponent } from './agent-schemes/agent-schemes.component';
import { AgentPolicyComponent } from './agent-policy/agent-policy.component';
import { EmpDocumentsComponent } from './emp-documents/emp-documents.component';
import { AgentPaymentComponent } from './agent-payment/agent-payment.component';
import { CommissionComponent } from './commission/commission.component';
import { CommsionTableComponent } from './commsion-table/commsion-table.component';
import { AgentcommtableComponent } from './agentcommtable/agentcommtable.component';
import { CustPoliciesComponent } from './cust-policies/cust-policies.component';
import { PremiumsComponent } from './premiums/premiums.component';
import { AdminCalimsComponent } from './admin-calims/admin-calims.component';
import { ClaimsComponent } from './claims/claims.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReciptComponent } from './recipt/recipt.component';
import { NewClaimComponent } from './new-claim/new-claim.component';

const routes: Routes = [
  { path: '', component:HomeComponent},
  { path: 'admin-emp', component: AdminEmpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'customer', component: CustomerComponent },//Customer Dashboard
  { path: 'admin', component: AdminComponent },// Admin Dashboard
  { path: 'policy/:id', component: PolicyComponent },
  { path: 'admin-profile', component: AdminProfComponent },
  { path: 'cust-profile', component: CustProfComponent },
  { path: 'agent-profile', component: AgentProfComponent },
  { path: 'emp-profile', component: EmpProfComponent },
  { path: 'policy-table', component: PolicyTableComponent },
  { path: 'emp', component: EmployeeComponent }, //Emp Component
  { path: 'emp-agent', component: EmpAgentComponent },
  { path: 'emp-cust', component: EmpCustComponent },
  { path: 'agent', component: AgentComponent }, //Agent Component
  { path: 'admin-withdrawal', component: CommsionTableComponent },
  { path: 'agent-cust', component: AgentCustComponent },
  { path: 'register', component: RegsiterComponent },
  { path: 'admin-emp', component: AdminEmpComponent },
  { path: 'admin-plan', component: AdminPlanComponent },
  { path: 'admin-agent', component: AdminAgentComponent },
{path:'new-claim/:id',component:NewClaimComponent},
  { path: 'admin-customer', component: AdminCustComponent },
  { path: 'admin-scheme/:id', component: AdminSchemesComponent },
  { path: 'admin-addscheme', component: AdminAddSchemeComponent },
  { path: 'detail', component: SchemedetailsComponent },
  { path: 'customer-plans', component: CustomerPlansComponent },
  { path: 'agents-plans', component: AgentPlansComponent },
  { path: 'agents-scheme/:id', component: AgentSchemesComponent },
  { path: 'agents-policy/:id', component: AgentPolicyComponent },
  { path: 'query', component: CustQueryComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'overall-scheme/:id', component: OverallschemeComponent },
  { path: 'emp-query', component: EmpQueryComponent },
  { path: 'detail', component: SchemedetailsComponent },
  { path: 'payment-table', component: PaymentTableComponent },
  { path: 'documents', component: DocumentComponent },
  { path: 'emp-documents', component: EmpDocumentsComponent },
  { path: 'agent-payment', component: AgentPaymentComponent },
  { path: 'commission', component: CommissionComponent },
  { path: 'cust-poli', component: CustPoliciesComponent },
  { path: 'commission-table', component: CommsionTableComponent },
  { path: 'cust-premium/:id', component: PremiumsComponent },
  { path: 'claims', component: ClaimsComponent },
  { path: 'admin-calims', component: AdminCalimsComponent },
  { path: 'agentcommtable', component: AgentcommtableComponent },
  { path: 'login', component: LoginComponent },
  {path:'auth/update-password',component:ChangePasswordComponent  },
  { path:'payment/receipt/:id',component:ReciptComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
