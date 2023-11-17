import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OtherRelatedCompaniesComponent } from './other-related-companies.component';
const routes: Routes = [
    {
      // path: '',
      // data: {
      //   title: 'Other Related Companies',
      // },
      // children: [
      //   {
          path: '',
          component: OtherRelatedCompaniesComponent,
          data: {
            title: 'Other Related Companies Under JMN ',
          },
      //   },
      // ]
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class otherRelatedCompaniesRoutingModule {
}