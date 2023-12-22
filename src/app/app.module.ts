import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { NgScrollbarModule } from 'ngx-scrollbar';



import { MatSortModule } from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { LocalStorageService, SessionStorageService, NgxWebstorageModule } from 'ngx-webstorage';



// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';


// For OTP
import { NgOtpInputModule } from 'ng-otp-input';

import {MatButtonModule} from '@angular/material/button';
import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
  TableModule,
  ModalModule,
  AccordionModule,
} from '@coreui/angular';

// Session Time-out

import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { Keepalive } from '@ng-idle/keepalive';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { DIR2ndDegRelativesComponent } from './views/dir2nd-deg-relatives/dir2nd-deg-relatives.component';
import { Officer2ndDegRelativesComponent } from './views/officer2nd-deg-relatives/officer2nd-deg-relatives.component'
import { ResizableDirective } from './views/arp/other-related-parties/other-related-parties.component';
import { DraggableDirective } from './views/arp/other-related-parties/other-related-parties.component';
import { SettingsComponent} from './views/maintenance/settings/settings.component';
import {MatTooltipModule} from '@angular/material/tooltip';

// DOSRI
import {DriComponent} from './views/dosri/dri/dri.component';
import {DirectorsrelatedComponent} from './views/dosri/directorsrelated/directorsrelated.component';
import {BankofficerComponent} from './views/dosri/bankofficer/bankofficer.component';
import { BankstockholdersComponent } from './views/dosri/bankstockholders/bankstockholders.component';

// Affiliates and Related Party
import { AffiliatesComponent } from './views/arp/affiliates/affiliates.component';
import { PacComponent } from './views/arp/pac/pac.component';
import { AffiliatesRelatedCompaniesComponent } from './views/arp/affiliates-related-companies/affiliates-related-companies.component';
import { OtherRelatedPartiesComponent } from './views/arp/other-related-parties/other-related-parties.component';
import { RpOfficerComponent } from './views/arp/rp-officer/rp-officer.component';
import { RPOfficerRIComponent } from './views/arp/rpofficer-ri/rpofficer-ri.component';

// Maintenance
import { LoginComponent } from './views/pages/login/login.component';
import { UsersComponent} from './views/maintenance/users/users.component';
import { ManualsComponent } from './views/maintenance/manuals/manuals.component';
import { AuditLogsComponent } from './views/maintenance/audit-logs/audit-logs.component';

// Import for directives
import { TitleCaseDirective } from './directives/titleCase.directive';
import { NumericOnlyDirective } from './directives/numeric.directive';
import { CapsLockFormatDirective } from './directives/upperCase.directive';
import { ShowIfPermissionDirective } from './directives/authority.directive';
import { HasPermissionDirective} from './directives/permission.directive';


// Modal
import { DosriModalComponent } from './modal-dialog/dosri-modal/dosri-modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { BankofficerModalComponent } from './modal-dialog/bankofficer-modal/bankofficer-modal.component';
import { DirectorsRIModalComponent } from './modal-dialog/directors-ri-modal/directors-ri-modal.component';
import { DirectorsModalComponent } from './modal-dialog/directors-modal/directors-modal.component';
import { AffiliatesModalComponent } from './modal-dialog/affiliates-modal/affiliates-modal.component';
import { BankofficerRIModalComponent } from './modal-dialog/bankofficer-rimodal/bankofficer-rimodal.component';
import { AffiliatesRPModalComponent } from './modal-dialog/affiliates-rpmodal/affiliates-rpmodal.component';
import { OtherRPModalComponent } from './modal-dialog/other-rpmodal/other-rpmodal.component';

// Simulation
import { RptListComponent } from './views/simulation/rpt-list/rpt-list.component';
import { SBLListComponent } from './views/simulation/sbl-list/sbl-list.component';
import { SBLSimulationModalComponent } from './modal-dialog/sbl-simulation-modal/sbl-simulation-modal.component';
import { RPTSimulationModalComponent } from './modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';


const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, BankofficerComponent, DirectorsrelatedComponent, AffiliatesComponent, AffiliatesRelatedCompaniesComponent, OtherRelatedPartiesComponent,
    BankstockholdersComponent, RpOfficerComponent, PacComponent, RPOfficerRIComponent, DIR2ndDegRelativesComponent, Officer2ndDegRelativesComponent,DraggableDirective,
    ResizableDirective, LoginComponent, DriComponent, UsersComponent, SettingsComponent, ManualsComponent, AuditLogsComponent, TitleCaseDirective, NumericOnlyDirective, CapsLockFormatDirective, ShowIfPermissionDirective,
    HasPermissionDirective,
    DosriModalComponent,
    BankofficerModalComponent,
    DirectorsRIModalComponent,
    DirectorsModalComponent,
    AffiliatesModalComponent,
    BankofficerRIModalComponent,
    AffiliatesRPModalComponent,
    SBLSimulationModalComponent, 
    RPTSimulationModalComponent,
    OtherRPModalComponent, RptListComponent, SBLListComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    TableModule,
    ModalModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    AccordionModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatExpansionModule,
    MatTooltipModule,
    MatButtonModule,
    NgIdleModule,
    NgIdleKeepaliveModule,
    MatCheckboxModule,
    NgOtpInputModule,
    NgxWebstorageModule,
    NgxWebstorageModule.forRoot(),
    MatDatepickerModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
    
    
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy

    },
    Keepalive,
    IconSetService,
    Title,
    LocalStorageService,
    SessionStorageService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
