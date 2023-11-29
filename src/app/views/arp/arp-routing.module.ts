import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AffiliatesComponent } from './affiliates/affiliates.component';
import {AffiliatesRelatedCompaniesComponent} from './affiliates-related-companies/affiliates-related-companies.component';
import { OtherRelatedPartiesComponent } from './other-related-parties/other-related-parties.component';

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
          ]
        },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ARPRoutingModule {
}

