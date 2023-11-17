import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RpOtherOfficerComponent } from './rp-other-officer.component';
import { RpOfficerRIComponent } from './rp-officer-ri/rp-officer-ri.component';

const routes: Routes = [
    {
      // path: '',
      // data: {
      //   title: 'Affiliates of Related Party',
      // },
      // children: [
      //   {
          path: '',
          component: RpOtherOfficerComponent,
          data: {
            title: 'Other Related Companies Officer ',
          },
      //   },
      // ]
    },
    {
      path: 'rp-officer-ri/:id',
    component: RpOfficerRIComponent,
    data: {
      title: 'Persons in Affiliated Companies',
    },
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rpOtherOfficerRoutingModule {
}