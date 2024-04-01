import { Component } from '@angular/core';
import { RptTransactionComponent } from '../simulation/rpt-transaction/rpt-transaction.component';


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {

  componentToRender = RptTransactionComponent;

  
}
