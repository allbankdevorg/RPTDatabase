import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
    {
          path: '',
          pathMatch: 'full',
          redirectTo: 'users',
        },
        {
          path: './users',
          component: UsersComponent,
          data: {
            title: 'Users',
          },
        },
        {
            path: './settings',
            component: SettingsComponent,
            data: {
                title: 'Settings',
            },
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {
}
