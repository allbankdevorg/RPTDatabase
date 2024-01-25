import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeniedComponent } from './denied/denied.component';
import {ForapprovalComponent} from './forapproval/forapproval.component';
import { ForreviewComponent } from './forreview/forreview.component';


const routes: Routes = [
    {
        path: '',
        data: {
          title: 'Entries',
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'denied',
          },
          {
            path: 'denied',
            component: DeniedComponent,
            data: {
              title: 'Denied ',
            },
          },
          {
            path: 'forreview',
            component: ForapprovalComponent,
            data: {
              title: 'For Review ',
            },
          },
          {
            path: 'forapproval',
            component: ForreviewComponent,
            data: {
              title: 'For Approval ',
            },
          },
        ]
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class EntryRoutingModule {
  }
  