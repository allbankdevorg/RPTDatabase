import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';
import { ManualsComponent } from './manuals/manuals.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';


const routes: Routes = [
        {
          path: '',
          data: {
            title: 'Maintenance',
          },
          children: [
            {
            path: '',
            pathMatch: 'full',
            redirectTo: 'users',
            },
            {
              path: 'users',
              component: UsersComponent,
              data: {
                title: 'Users ',
              },
            },
            {
              path: 'settings',
              component: SettingsComponent,
              data: {
                title: 'Settings ',
              },
            },
            {
              path: 'manuals',
              component: ManualsComponent,
              data: {
                title: 'Manuals ',
              },
            },
            {
              path: 'audit-logs',
              component: AuditLogsComponent,
              data: {
                title: 'Audit Logs ',
              },
            },
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {
}
