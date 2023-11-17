import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RpRelatedCompaniesComponent } from './rp-related-companies.component';

const routes: Routes = [
    {
      // path: '',
      // data: {
      //   title: 'Affiliates of Related Party',
      // },
      // children: [
      //   {
          path: '',
          component: RpRelatedCompaniesComponent,
          data: {
            title: 'Other Related Companies ',
          },
      //   },
      // ]
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class rpRelatedCompaniesRoutingModule {
}