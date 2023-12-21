import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RptListComponent } from './rpt-list/rpt-list.component';
import { SBLListComponent } from './sbl-list/sbl-list.component';


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
            
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SIMULATIONRoutingModule {
}

