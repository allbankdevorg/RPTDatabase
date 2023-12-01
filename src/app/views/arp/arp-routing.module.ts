import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffiliatesComponent } from './affiliates/affiliates.component';
import {AffiliatesRelatedCompaniesComponent} from './affiliates-related-companies/affiliates-related-companies.component';
import { OtherRelatedPartiesComponent } from './other-related-parties/other-related-parties.component';
import { RpOfficerComponent } from './rp-officer/rp-officer.component';
import { PacComponent } from './pac/pac.component';
import { RPOfficerRIComponent } from './rpofficer-ri/rpofficer-ri.component';


const routes: Routes = [
        {
          path: '',
          data: {
            title: 'Affiliates Related Party',
          },
          children: [
            {
              path: 'affiliates',
              component: AffiliatesComponent,
              data: {
                title: 'Affiliates ',
              },
            },
            {
              path: 'pac/:id',
            component: PacComponent,
            data: {
              title: 'Directors Related Interest',
            },
            },
            {
              path: 'affiliates-related-companies',
              component: AffiliatesRelatedCompaniesComponent,
              data: {
                title: 'Affiliates Related Companies ',
              },
            },
            {
              path: 'other-related-parties',
              component: OtherRelatedPartiesComponent,
              data: {
                title: 'Other Related Parties ',
              },
            },
            {
              path: 'rp-officer',
              component: RpOfficerComponent,
              data: {
                title: 'Related Parties Officers ',
              },
            },
            {
              path: 'rpofficer-ri/:id',
              component: RPOfficerRIComponent,
              data: {
                title: 'Related Party Officers Related Interest',
              },
            },
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ARPRoutingModule {
}

