import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersmanagementComponent } from './usersmanagement.component'

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Maintenance',
      },
      children: [
        {
          path: '',
          component: UsersmanagementComponent,
          data: {
            title: 'Users ',
          },
        },
      ]
    },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersmanagementRoutingModule {
}


