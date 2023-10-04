import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DRIComponent } from './dri.component';
import { DirectorsrelatedComponent } from './directorsrelated/directorsrelated.component';

const routes: Routes = [
    {
      path: '',
      component: DRIComponent,
      data: {
        title: 'DRI',
      },
    },
    {
        path: 'directorsrelated/:id',
      component: DirectorsrelatedComponent,
      data: {
        title: 'Directors Related Interest',
      },
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DRIRoutingModule {
}
