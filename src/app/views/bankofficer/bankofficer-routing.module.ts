import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BankofficerComponents } from './bankofficer.component';

const routes: Routes = [
    {
        path: '',
        data: {
          title: 'DOSRI',
        },
        children: [{
          path: '',
          component: BankofficerComponents,
          data: {
            title: 'Bank Officer',
          },
        }
      ]
    },
];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankofficerRoutingModule {
}
