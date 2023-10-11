import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Officer2ndDegRelativesComponent } from './officer2nd-deg-relatives.component';

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Affiliates of Related Party',
      },
      children: [
        {
          path: '',
          component: Officer2ndDegRelativesComponent,
          data: {
            title: 'Officer 2nd Degree Relatives ',
          },
        },
      ]
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Officer2ndDegRelativesRoutingModule {
}