import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BankofficerComponent } from './bankofficer.component';

const routes: Routes = [
    {
      path: '',
      component: BankofficerComponent,
      data: {
        title: 'Bank Officer',
      },
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankofficerRoutingModule {
}
