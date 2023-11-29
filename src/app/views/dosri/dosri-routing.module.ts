import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

 import { DriComponent } from './dri/dri.component';
 import { BankofficerComponent } from './bankofficer/bankofficer.component';
 import { DirectorsrelatedComponent } from './directorsrelated/directorsrelated.component';


const routes: Routes = [
        {
          path: '',
          data: {
            title: 'DOSRI',
          },
          children: [
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
                title: 'Settings ',
              },
            },
            {
                path: 'directorsrelated/:id',
              component: DirectorsrelatedComponent,
              data: {
                title: 'Directors Related Interest',
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
