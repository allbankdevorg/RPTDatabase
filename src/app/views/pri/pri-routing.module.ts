import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PRIComponent } from './pri.component';

const routes: Routes = [
    {
      path: '',
      component: PRIComponent,
      data: {
        title: 'PRI',
      },
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PRIRoutingModule {
}
