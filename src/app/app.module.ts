import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { NgScrollbarModule } from 'ngx-scrollbar';


import { MatSortModule } from '@angular/material/sort';
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

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';

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

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { PRIComponent } from './views/pri/pri.component';
import { BankofficerComponent } from './views/bankofficer/bankofficer.component';
import { BankstockholderComponent } from './views/bankstockholder/bankstockholder.component';
import { DRIComponent } from './views/dri/dri.component';
import { DirectorsrelatedComponent } from './views/dri/directorsrelated/directorsrelated.component';
import { PACComponent } from './views/rp-affiliates/pac/pac.component';
import { RpAffiliatesComponent } from './views/rp-affiliates/rp-affiliates.component';
import { RpRelatedCompaniesComponent } from './views/rp-related-companies/rp-related-companies.component';
import { RpOtherOfficerComponent } from './views/rp-other-officer/rp-other-officer.component';
import { RpOfficerRIComponent } from './views/rp-other-officer/rp-officer-ri/rp-officer-ri.component';
import { DIR2ndDegRelativesComponent } from './views/dir2nd-deg-relatives/dir2nd-deg-relatives.component';
import { Officer2ndDegRelativesComponent } from './views/officer2nd-deg-relatives/officer2nd-deg-relatives.component'
import { ResizableDirective } from './views/rp-related-companies/rp-related-companies.component';
import { DraggableDirective } from './views/rp-related-companies/rp-related-companies.component';
import { LoginComponent } from './views/pages/login/login.component';
import { UsersComponent} from './views/maintenance/users/users.component';
import { SettingsComponent} from './views/maintenance/settings/settings.component';
import { OtherRelatedCompaniesComponent } from './views/other-related-companies/other-related-companies.component';
import {MatTooltipModule} from '@angular/material/tooltip';

// Import for directives
import { TitleCaseDirective } from './directives/titleCase.directive';
import { NumericOnlyDirective } from './directives/numeric.directive';
import { CapsLockFormatDirective } from './directives/upperCase.directive';
import { ShowIfPermissionDirective } from './directives/authority.directive';
import { HasPermissionDirective} from './directives/permission.directive'

    
 

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, PRIComponent, BankofficerComponent, BankstockholderComponent, DRIComponent, DirectorsrelatedComponent, RpAffiliatesComponent, PACComponent, RpRelatedCompaniesComponent, RpOtherOfficerComponent, RpOfficerRIComponent, DIR2ndDegRelativesComponent, Officer2ndDegRelativesComponent,DraggableDirective,
    ResizableDirective, LoginComponent, UsersComponent, SettingsComponent, OtherRelatedCompaniesComponent, TitleCaseDirective, NumericOnlyDirective, CapsLockFormatDirective, ShowIfPermissionDirective,
    HasPermissionDirective],
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
    MatCheckboxModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
