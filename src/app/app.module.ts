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


import { IconModule, IconSetService } from '@coreui/icons-angular';
import { PRIComponent } from './views/pri/pri.component';
import { BankofficerComponent } from './views/bankofficer/bankofficer.component';
import { BankstockholderComponent } from './views/bankstockholder/bankstockholder.component';
import { AffiliatesComponent } from './views/affiliates/affiliates.component';
import { DRIComponent } from './views/dri/dri.component';
import { DirectorsrelatedComponent } from './views/dri/directorsrelated/directorsrelated.component';
import { PACComponent } from './views/rp-affiliates/pac/pac.component';
import { RpAffiliatesComponent } from './views/rp-affiliates/rp-affiliates.component';
import { RpRelatedCompaniesComponent } from './views/rp-related-companies/rp-related-companies.component';
import { RpOtherOfficerComponent } from './views/rp-other-officer/rp-other-officer.component';
import { DIR2ndDegRelativesComponent } from './views/dir2nd-deg-relatives/dir2nd-deg-relatives.component';
import { Officer2ndDegRelativesComponent } from './views/officer2nd-deg-relatives/officer2nd-deg-relatives.component'
import { ResizableDirective } from './views/rp-related-companies/rp-related-companies.component';
import { DraggableDirective } from './views/rp-related-companies/rp-related-companies.component';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, PRIComponent, BankofficerComponent, BankstockholderComponent, AffiliatesComponent, DRIComponent, DirectorsrelatedComponent, RpAffiliatesComponent, PACComponent, RpRelatedCompaniesComponent, RpOtherOfficerComponent, DIR2ndDegRelativesComponent, Officer2ndDegRelativesComponent,DraggableDirective,
    ResizableDirective],
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
