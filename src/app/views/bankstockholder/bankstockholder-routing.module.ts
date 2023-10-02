import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BankstockholderComponent } from './bankstockholder.component';

const routes: Routes = [
    {
      path: '',
      component: BankstockholderComponent,
      data: {
        title: 'Bank Stockholder',
      },
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankStockholderRoutingModule {
}
