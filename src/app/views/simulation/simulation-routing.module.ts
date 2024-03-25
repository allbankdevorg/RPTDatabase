import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RptListComponent } from './rpt-list/rpt-list.component';
import { SBLListComponent } from './sbl-list/sbl-list.component';
import { RptTransactionComponent } from './rpt-transaction/rpt-transaction.component';


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
            
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SIMULATIONRoutingModule {
}

