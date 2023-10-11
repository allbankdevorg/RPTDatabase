import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RpOtherOfficerComponent } from './rp-other-officer.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Affiliates of Related Party',
      },
      children: [
        {
          path: '',
          component: RpOtherOfficerComponent,
          data: {
            title: 'Other Related Companies ',
          },
        },
      ]
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rpOtherOfficerRoutingModule {
}