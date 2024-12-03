import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RptListComponent } from './rpt-list/rpt-list.component';
import { SBLListComponent } from './sbl-list/sbl-list.component';
import { RptTransactionComponent } from './rpt-transaction/rpt-transaction.component';
import { LeaseContractsComponent } from './lease-contracts/lease-contracts.component';
import { BondsInvestmentComponent } from './bonds-investment/bonds-investment.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { ORPtransactionsComponent } from './orptransactions/orptransactions.component';

const routes: Routes = [
        {
          path: '',
          data: {
            title: 'Simulation',
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'rpt-list',
            },
            {
                path: 'rpt-list',
                component: RptListComponent,
                data: {
                    title: 'RPT List ',
                },
            },
            {
                path: 'sbl-list',
                component: SBLListComponent,
                data: {
                    title: 'SBL List ',
                },
            },
            {
              path: 'rpt-transaction',
              component: RptTransactionComponent,
              data: {
                  title: 'RPT Transaction Lookup ',
              },
            },
            {
              path: 'lease-contracts',
              component: LeaseContractsComponent,
              data: {
                  title: 'Lease and Contracts ',
              },
            },
            {
              path: 'bonds-investment',
              component: BondsInvestmentComponent,
              data: {
                  title: 'Bonds And Investment ',
              },
            },
            {
              path: 'orptransactions',
              component: ORPtransactionsComponent,
              data: {
                  title: 'ORP Transactions ',
              },
            },
            {
              path: 'audit-trail',
              component: AuditTrailComponent,
              data: {
                  title: 'Audit Trail Logs ',
              },
            },
            
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SIMULATIONRoutingModule {
}

