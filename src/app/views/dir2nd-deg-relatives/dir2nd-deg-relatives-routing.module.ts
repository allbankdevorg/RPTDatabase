import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DIR2ndDegRelativesComponent } from './dir2nd-deg-relatives.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Affiliates of Related Party',
      },
      children: [
        {
          path: '',
          component: DIR2ndDegRelativesComponent,
          data: {
            title: 'DIR 2nd Degree Relatives ',
          },
        },
      ]
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DIR2ndDegRelativesRoutingModule {
}