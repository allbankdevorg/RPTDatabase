import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator'
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';

import {CurrencyPipe} from '@angular/common';



import { ReactiveFormsModule } from '@angular/forms';

import { rpAffilitesRoutingModule} from './rp-affiliates-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    CurrencyPipe,
    rpAffilitesRoutingModule
  ]
})
export class RpAffiliatesModule { }
