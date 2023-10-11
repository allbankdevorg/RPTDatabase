import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
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
        path: 'dri',
        loadChildren: () =>
          import('./views/dri/dri.module').then((m) => m.DRIModule)
      },
      {
        path: 'dri/directorsrelated/bn',
        loadChildren: () =>
          import('./views/dri/directorsrelated/directorsrelated.module').then((m) => m.DirectorsrelatedModule)
      },
      {
        path: 'bankofficer',
        loadChildren: () =>
          import('./views/bankofficer/bankofficer.module').then((m) => m.BankofficerModule)
      },
      {
        path: 'bankstockholder',
        loadChildren: () =>
          import('./views/bankstockholder/bankstockholder.module').then((m) => m.BankstockholderModule)
      },
      {
        path: 'affiliates',
        loadChildren: () =>
          import('./views/affiliates/affiliates.module').then((m) => m.AffiliatesModule)
      },
      {
        path: 'rp-affiliates',
        loadChildren: () =>
          import('./views/rp-affiliates/rp-affiliates.module').then((m) => m.RpAffiliatesModule)
      },
      {
        path: 'rp-affiliates/pac/cis',
        loadChildren: () =>
          import('./views/rp-affiliates/pac/pac.module').then((m) => m.PACModule)
      },
      {
        path: 'rp-related-companies',
        loadChildren: () =>
          import('./views/rp-related-companies/rp-related-companies.module').then((m) => m.RpRelatedCompaniesModule)
      },
      {
        path: 'rp-other-officer',
        loadChildren: () =>
          import('./views/rp-other-officer/rp-other-officer.module').then((m) => m.RpOtherOfficerModule)
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
