import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffiliatesComponent } from './affiliates.component';

const routes: Routes = [
    {
      path: '',
      component: AffiliatesComponent,
      data: {
        title: 'Bank Stockholder',
      },
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliatesRoutingModule {
}
