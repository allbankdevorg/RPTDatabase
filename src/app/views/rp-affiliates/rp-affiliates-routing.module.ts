import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RpAffiliatesComponent } from './rp-affiliates.component';

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
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rpAffilitesRoutingModule {
}