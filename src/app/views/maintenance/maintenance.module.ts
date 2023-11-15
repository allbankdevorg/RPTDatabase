import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { ManualsComponent } from './manuals/manuals.component';

@NgModule({
  declarations: [
  
    ManualsComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule
  ]
})
export class MaintenanceModule { }
