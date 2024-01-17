import {AfterViewInit,Component,ViewChild,ElementRef,OnInit,Renderer2,Directive,HostListener} from '@angular/core';


import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import {animate,state,style,transition,trigger} from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';


import {createAffil} from '../../../functions-files/add/postAPI';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';


// Service
import { OrgsDataServicesService } from '../../../services/orgs-data-services.service'
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import {AffiliatesService} from '../../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors


// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';

// For Modals
import { AffiliatesRPModalComponent } from 'src/app/modal-dialog/affiliates-rpmodal/affiliates-rpmodal.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UpdateManagingCompanyModalComponent} from 'src/app/modal-dialog/update-managing-company-modal/update-managing-company-modal.component'

declare var google: any;
export interface Child {
  name: string;
}


export interface Data {
  cis: number;
  cn: string;
  type: string;
  LDUpdated: String;
  action: string;
  view: string;
  children?: DData[];
  // children?: Child[];
}

export interface DData {
  cis: number;
  comN: string;
  ofcrName: string;
  position: String;
  action: string;
  view: string;
}

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'resize', 'both');
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'auto');
  }
}
@Directive({
  selector: '[appDraggable]'
})

export class DraggableDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
    const initialX = event.clientX - this.el.nativeElement.getBoundingClientRect().left;
    const initialY = event.clientY - this.el.nativeElement.getBoundingClientRect().top;

    const move = (e: MouseEvent) => {
      const left = e.clientX - initialX;
      const top = e.clientY - initialY;
      this.renderer.setStyle(this.el.nativeElement, 'left', left + 'px');
      this.renderer.setStyle(this.el.nativeElement, 'top', top + 'px');
    };

    const cleanup = () => {
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', cleanup);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', cleanup);
  }
}

@Component({
  selector: 'app-affiliates-related-companies',
  templateUrl: './affiliates-related-companies.component.html',
  styleUrls: ['./affiliates-related-companies.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AffiliatesRelatedCompaniesComponent implements OnInit{
  sharedData: string | any;
  private chart: any;
  private isNodeDetailsVisible: boolean = false
  
  
  selectedData: any


  // private orgData:any;
  constructor(
    private router: Router,
    public _dialog: MatDialog,
    private dataService: AffiliatesService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    private orgsDataService: OrgsDataServicesService,
    private get: FetchDataService,
    private auditTrailService: AuditTrailService
  ) { 
      this.fetchAssocCompany();
  }


  @ViewChild('actionModal') actionModal!: ElementRef;
  @ViewChild('nodePopover') nodePopover!: ElementRef;
  @ViewChild('nodeDetails', { static: true }) nodeDetails!: ElementRef;

  ngOnInit() {
    this.fetchAssocCompany().then(() => {//load google tree
      // Now you can safely use this.orgsData
    });
    //this.drawChart();
  }

  drawChart(dataArr) {
      
    var chart;
    
    var data = new google.visualization.DataTable();
      data.addColumn('string', 'Name');
      data.addColumn('string', 'Manager');
      data.addColumn('string', 'Name_cis');
      data.addColumn('string', 'managerCIS');

      data.addRows(dataArr);
      var options = {
        allowCollapse: true,
        nodeStyle: {
          background: '#7a7a7a', // Background color for nodes
          border: '1px solid #ccc',
          borderRadius: '5px',
        },
      };

      chart = new google.visualization.OrgChart(document.getElementById('org-chart-container'));
      

      var lastClickTime = 0; // Variable to store the last click time
      google.visualization.events.addListener(chart, 'select', () => {
        // Check if the time since the last click is less than 300 milliseconds (double-click)
        if (Date.now() - lastClickTime < 300) {
          this.showModal();

          // $('#actionModal').modal('show'); // Show the modal dialog on double-click
        } else {
          const selectedItem = this.orgsDataService.orgsData[chart.getSelection()[0].row];
          this.updateNodeDetails(selectedItem);
          this.isNodeDetailsVisible = true;
          this.showPopup(); // 
          chart.collapse(data.getValue(chart.getSelection()[0].row, 0)); // Collapse on single-click
          // console.log(selectedItem);
        }
        lastClickTime = Date.now(); // Update the last click time
        
      });

      
       // Hide the popover when the mouse leaves the chart area
       chart.getContainer().addEventListener('mouseleave', () => {
        if (!this.isNodeDetailsVisible) {
          this.hideNodePopover();
        }
      });
      
      // Add a click event listener to the chart container
      chart.getContainer().addEventListener('click', () => {
        if (this.isNodeDetailsVisible) {
          this.isNodeDetailsVisible = false;
          // this.closePopover(); // Close the popover when clicking the chart container
        }
      });

      chart.draw(data, options);
      
     
  }



  fetchAssocCompany() {
    return new Promise<void>((resolve, reject) => {
      this.get.getManagingCompany((mngComp) => {
        // if (mngComp) {
          try {
            // Assuming getManagingCompany returns an array
            
            this.orgsDataService.orgsData = mngComp.map(item => [
              item.aff_com_account_name, 
              item.manager, 
              item.aff_com_cis_number, 
              item.managing_company]);
    
            // Update the orgsData in the orgsDataService
            google.charts.load('current', { packages: ['orgchart'] });
            google.charts.setOnLoadCallback(() => this.drawChart( this.orgsDataService.orgsData));
            // console.log(this.orgsDataService.orgsData);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        // }else {
          
        // }
        
      });
    });
  }

  

  updateNodeDetails(selectedItem) {
    const transformedData = {
      aff_com_comp_name: selectedItem[0],
      manager: selectedItem[1],
      aff_com_cis_number: selectedItem[2],
      managing_company: selectedItem[3] 
  };
    
    this.selectedData = transformedData;
    if (event instanceof MouseEvent) {
      const nodeName = selectedItem[0];
      const nodeManager = selectedItem[1];
      const nodeDetails = `Name: ${nodeName}<br>Manager: ${nodeManager}`;
      this.nodeDetails.nativeElement.innerHTML = nodeDetails;
      
      // Position the #nodePopover element at the mouse pointer's position
      const nodePopover = this.nodePopover.nativeElement;
      this.renderer.setStyle(nodePopover, 'display', 'block');

      // Get the width of the popover element
      const popoverWidth = nodePopover.offsetWidth;

      // Calculate the left position based on the mouse pointer or clicked element
      let leftPosition = event.clientX;
      if (window.innerWidth - event.clientX < popoverWidth) {
        // If the mouse pointer is on the right side of the screen, position the popover on the left
        leftPosition -= popoverWidth;
      }

      this.renderer.setStyle(nodePopover, 'left', `${leftPosition}px`);
      this.renderer.setStyle(nodePopover, 'top', `${event.clientY}px`);
    }
  }



  

  onButtonClick(module: any) {
    this.dataService.setmoduleV(module);
  }

  showModal(): void {
    const modal = this.actionModal.nativeElement;
  
    // Use Renderer2 to add or remove CSS classes
    this.renderer.addClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'block');
  }

  showPopup(): void {
    const modal = this.nodePopover.nativeElement;
  
    // Use Renderer2 to add or remove CSS classes
    this.renderer.addClass(modal, 'show');
    this.renderer.setStyle(modal, 'display', 'block');

  }

  // Function to hide the #nodePopover element
  hideNodePopover() {
    const nodePopover = this.nodePopover.nativeElement;
    this.renderer.setStyle(nodePopover, 'display', 'none');
}


  closeModal() {
    // Get the modal element
    const modal = this.actionModal.nativeElement;

    // Remove the 'show' class to hide the modal
    this.renderer.removeClass(modal, 'show');

    // Set 'display' to 'none' to hide it
    this.renderer.setStyle(modal, 'display', 'none');
  }



  // Show Modal Form
openAddEditEmpForm() {
  const dialogRef = this._dialog.open(AffiliatesRPModalComponent);
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.ngOnInit();
      }
    },
  });
}

openEditForm(event: any) {
  const data = this.selectedData;
  event.stopPropagation();
  // console.log(data);
  const dialogRef = this._dialog.open(UpdateManagingCompanyModalComponent, {
    data,    
  });

  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.ngOnInit();
      }
    },
  });
}







  // Start of Functions for Audit Trail
  logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
    const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
    this.logAuditTrail(auditTrailEntry);
  }
  
  
  
  private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
    return {
      userId: 'current_user_id',
      userName: 'Current_user',
      timestamp: new Date(),
      actionType,
      details,
      success,
      page, // Include the page information
      errorMessage: errorMessage || '', // Optional: Include error message if available
    };
  }
  
  
  private logAuditTrail(auditTrailEntry: AuditTrail) {
    this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
      // console.log('Audit trail entry logged successfully.');
    });
    // console.log('Audit trail entry logged successfully.');
  }
}
