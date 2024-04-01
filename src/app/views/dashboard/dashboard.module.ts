import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { WidgetsModule } from '../widgets/widgets.module';
import { DashboardCardsComponent } from './modules/dashboard-cards/dashboard-cards.component';
import { DashboardTrafficComponent } from './modules/dashboard-traffic/dashboard-traffic.component';
import { DashboardTrafficSalesComponent } from './modules/dashboard-traffic-sales/dashboard-traffic-sales.component';
import { DashboardUsersComponent } from './modules/dashboard-users/dashboard-users.component';
import { RptTransactionComponent } from '../simulation/rpt-transaction/rpt-transaction.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule
  ],
  declarations: [DashboardComponent, DashboardCardsComponent, DashboardTrafficComponent, DashboardTrafficSalesComponent, DashboardUsersComponent]
})
export class DashboardModule {
}
