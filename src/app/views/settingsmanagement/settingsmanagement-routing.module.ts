import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsmanagementComponent } from './settingsmanagement.component'

const routes: Routes = [
    {
      path: '',
      data: {
        title: 'Maintenance',
      },
      children: [
        {
          path: '',
          component: SettingsmanagementComponent,
          data: {
            title: 'Settings ',
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


