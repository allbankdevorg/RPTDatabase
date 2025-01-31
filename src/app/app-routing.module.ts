import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';

import { AuthGuard } from './guard/auth-guard.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'dosri',
        loadChildren: () =>
          import('./views/dosri/dosri.module').then((m) => m.DOSRIModule)
      },
      {
        path: 'arp',
        loadChildren: () =>
          import('./views/arp/arp.module').then((m) => m.ARPModule)
      },
      {
        path: 'simulation',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./views/simulation/simulation.module').then((m) => m.SimulationModule)
      },
      {
        path: 'entry',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./views/entry/entry.module').then((m) => m.EntryModule)
      },{
        path: 'maintenance',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./views/maintenance/maintenance.module').then((m) => m.MaintenanceModule)
      },
      {
        path: 'dir2nd-deg-relatives',
        loadChildren: () =>
          import('./views/dir2nd-deg-relatives/dir2nd-deg-relatives.module').then((m) => m.DIR2ndDegRelativesModule)
      },      
      {
        path: 'officer2nd-deg-relatives',
        loadChildren: () =>
          import('./views/officer2nd-deg-relatives/officer2nd-deg-relatives.module').then((m) => m.Officer2ndDegRelativesModule)
      },
      
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
