import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RpAffiliatesComponent } from './rp-affiliates.component';
import { PACComponent } from './pac/pac.component';
const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Affiliates of Related Party',
      },
      children: [
        {
          path: '',
          component: RpAffiliatesComponent,
          data: {
            title: 'Affiliates ',
          },
        },
      ]
    },
    {
      path: 'pac/:id',
    component: PACComponent,
    data: {
      title: 'Directors Related Interest',
    },
  },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rpAffilitesRoutingModule {
}