import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

 import { DriComponent } from './dri/dri.component';
 import { BankofficerComponent } from './bankofficer/bankofficer.component';
 import { DirectorsrelatedComponent } from './directorsrelated/directorsrelated.component';
 import { BankstockholdersComponent } from './bankstockholders/bankstockholders.component';


const routes: Routes = [
        {
          path: '',
          data: {
            title: 'DOSRI',
          },
          children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'dri',
            },
            {
              path: 'dri',
              component: DriComponent,
              data: {
                title: 'DRI ',
              },
            },
            {
              path: 'bankofficer',
              component: BankofficerComponent,
              data: {
                title: 'Bank Officers ',
              },
            },
            {
                path: 'directorsrelated/:id',
              component: DirectorsrelatedComponent,
              data: {
                title: 'Directors Related Interest',
              },
            },
            {
                path: 'bankstockholders',
              component: BankstockholdersComponent,
              data: {
                title: 'Bank Stock Holders',
              },
            },
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DosriRoutingModule {
}
