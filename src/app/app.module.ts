import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CustomerComponent } from './customer-dashboard/customer.component';
//import { PlansComponent } from './plans/plans.component';

import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin-dashboard/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminEmpComponent } from './admin-emp/admin-emp.component';
import { AdminPlanComponent } from './admin-plan/admin-plan.component';
import { CustomerPlansComponent } from './customer-plans/customer-plans.component';
import { EmpAgentComponent } from './emp-agent/emp-agent.component';
// import { EmployeeComponent } from './employee-dashboard/employee.component';
import { AdminSchemesComponent } from './admin-schemes/admin-schemes.component';
// import { AgentComponent } from './agent-dashboard/agent.component';
//import { AgentCustComponent } from './agent-cust/AgentCustComponent';
import { AdminAgentComponent } from './admin-agent/admin-agent.component';
//import { AdminCustComponent } from './admin-cust/admin-cust.component';
import { EmpCustComponent } from './emp-cust/emp-cust.component';
import { AdminAddSchemeComponent } from './admin-add-scheme/admin-add-scheme.component';
import { RegsiterComponent } from './regsiter/regsiter.component';
//import { CustQueryComponent } from './cust-query/CustQueryComponent';
import { EmpQueryComponent } from './emp-query/emp-query.component';


import { OverallschemeComponent } from './overallscheme/overallscheme.component';
import { EmployeeComponent } from './employee/employee.component';
import { AgentComponent } from './agent/agent.component';
import { CustQueryComponent } from './cust-query/cust-query.component';
import { PaymentComponent } from './payment/payment.component';
import { SchemedetailsComponent } from './schemedetails/schemedetails.component';
//import { PolicyComponent } from './policy/PolicyComponent';
import { PolicyTableComponent } from './policy-table/policy-table.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { AdminProfComponent } from './Profile/admin-prof/admin-prof.component';
import { AgentProfComponent } from './Profile/agent-prof/agent-prof.component';
import { EmpProfComponent } from './Profile/emp-prof/emp-prof.component';
import { CustProfComponent } from './Profile/cust-prof/cust-prof.component';
import { DocumentComponent } from './document/document.component';
import { AdminCustComponent } from './admin-cust/admin-cust.component';
import { AgentCustComponent } from './agent-cust/agent-cust.component';
import { AgentPlansComponent } from './agent-plans/agent-plans.component';
import { AgentSchemesComponent } from './agent-schemes/agent-schemes.component';
import { AgentPolicyComponent } from './agent-policy/agent-policy.component';
import { DataSharingService } from './data-sharing.service';
import { EmpDocumentsComponent } from './emp-documents/emp-documents.component';
import { CommissionComponent } from './commission/commission.component';
import { AgentPaymentComponent } from './agent-payment/agent-payment.component';
import { CommsionTableComponent } from './commsion-table/commsion-table.component';
import { AgentcommtableComponent } from './agentcommtable/agentcommtable.component';
import { CustPoliciesComponent } from './cust-policies/cust-policies.component';
import { PremiumsComponent } from './premiums/premiums.component';
import { ClaimsComponent } from './claims/claims.component';
import { AdminCalimsComponent } from './admin-calims/admin-calims.component';
import { PolicyComponent } from './policy/policy.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReciptComponent } from './recipt/recipt.component';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';
import { AgentHeaderComponent } from './admin-header/agent-header/agent-header.component';
import { EmpHeaderComponent } from './admin-header/emp-header/emp-header.component';
import { NewClaimComponent } from './new-claim/new-claim.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ContactComponent,
    AboutUsComponent,
    CustomerComponent,
   // PlansComponent,
    AdminComponent,
    AdminEmpComponent,
    AdminSchemesComponent,
    AdminPlanComponent,
    CustomerPlansComponent,
    EmpAgentComponent,
    EmployeeComponent,
    AgentComponent,
    AgentCustComponent,
    AdminAgentComponent,
    AdminCustComponent,
    EmpCustComponent,
    AdminAddSchemeComponent,
    RegsiterComponent,
    CustQueryComponent,
    EmpQueryComponent,
 
   
    OverallschemeComponent,
    PaymentComponent,
    SchemedetailsComponent,
    PolicyComponent,
    PolicyTableComponent,
    PaymentTableComponent,
    AdminProfComponent,
    AgentProfComponent,
    EmpProfComponent,
    CustProfComponent,
    DocumentComponent,
    AgentPlansComponent,
    AgentSchemesComponent,
    AgentPolicyComponent,
    EmpDocumentsComponent,
    CommissionComponent,
    AgentPaymentComponent,
    CommsionTableComponent,
    AgentcommtableComponent,
    CustPoliciesComponent,
    PremiumsComponent,
    ClaimsComponent,
    AdminCalimsComponent,
    AdminHeaderComponent,
    ChangePasswordComponent,
    ReciptComponent,
    CustomerHeaderComponent,
    AgentHeaderComponent,
    EmpHeaderComponent,
    NewClaimComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule

  ],
  providers: [DataSharingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
