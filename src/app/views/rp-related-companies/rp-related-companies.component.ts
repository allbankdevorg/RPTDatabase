import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Renderer2,Directive,HostListener
} from '@angular/core';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgFor, NgIf } from '@angular/common';


// Functions Import
import {getManagingCompany} from '../../functions-files/getFunctions'

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
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
  selector: 'app-rp-related-companies',
  templateUrl: './rp-related-companies.component.html',
  styleUrls: ['./rp-related-companies.component.scss'],
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

export class RpRelatedCompaniesComponent implements OnInit {
  sharedData: string | any;
  private chart: any;
  private lastClickTime = 0;
  orgsData: any = [];
  private isNodeDetailsVisible: boolean = false
  // private orgData:any;
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.fetchAssocCompany();
  }


  @ViewChild('actionModal') actionModal!: ElementRef;
  @ViewChild('nodePopover') nodePopover!: ElementRef;
  @ViewChild('nodeDetails', { static: true }) nodeDetails!: ElementRef;

  ngOnInit() {
    google.charts.load('current', { packages: ['orgchart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
    this.fetchAssocCompany()
    // console.log(this.orgData);
  }
  
  drawChart(): void {
      // let orgData = this.orgsData;
    // const orgData = [
    //   ['FINE PROPERTIES, INC.', undefined],
    //   ['ALLVALUE HOLDINGS CORP.', 'FINE PROPERTIES, INC.'],
    //   ['GOLDEN MV  HOLDINGS INC.', 'FINE PROPERTIES, INC.'],
    //   ['GETS.PH HOLDINGS INC.', 'FINE PROPERTIES, INC.'],
    //   ['VISTA LAND & LIFESCAPES, INC.', 'FINE PROPERTIES, INC.'],
    //   ['ALLDAY MARTS, INC.', 'ALLVALUE HOLDINGS CORP.'],
    //   ['ALLHOME CORP.', 'ALLVALUE HOLDINGS CORP.'],
    //   ['THE VILLAGE SERVER INC.', 'ALLVALUE HOLDINGS CORP.'],
    //   ['FAMILY SHOPPERS UNLIMITED, INC.', 'ALLVALUE HOLDINGS CORP.'],
    //   ['BRIA HOMES, INC.', 'GOLDEN MV  HOLDINGS INC.'],
    //   ['GOLDEN HAVEN', 'GOLDEN MV  HOLDINGS INC.'],
    //   ['GLOBALLAND PROPERTY MANAGEMENT, INC.', 'GETS.PH HOLDINGS INC.'],
    //   ['BRITTANY CORPORATION', 'VISTA LAND & LIFESCAPES, INC.'],
    //   ['CROWN ASIA PROPERTIES INC,', 'VISTA LAND & LIFESCAPES, INC.'],
    //   ['CAMELLA HOMES, INC.', 'VISTA LAND & LIFESCAPES, INC.'],
    //   ['VISTA RESIDENCES INC.', 'VISTA LAND & LIFESCAPES, INC.'],
    //   ['COMMUNITIES PHILIPPINES, INC.', 'VISTA LAND & LIFESCAPES, INC.'],
    //   ['VISTAMALLS. INC.\t \t \t \t \t', 'VISTA LAND & LIFESCAPES, INC.'],
    //   ['PRIMA CASA LAND & HOUSES INC.', 'BRITTANY CORPORATION'],
    //   ['PRIMA CASA LAND & HOUSES INC.', 'CROWN ASIA PROPERTIES INC,'],
    //   ['PRIMA CASA LAND & HOUSES INC.', 'CAMELLA HOMES, INC.'],
    //   ['HOUSEHOLD DEVELOPMENT CORPORATION', 'CAMELLA HOMES, INC.'],
    //   ['MANDALAY RESOURCES CORP.', 'CAMELLA HOMES, INC.'],
    //   ['PRIMA CASA LAND & HOUSES INC.', 'VISTA RESIDENCES INC.'],
    //   ['VISTA LEISURE CLUB CORP.', 'VISTA RESIDENCES INC.'],
    //   ['VISTA VENTURES TAFT, INC.', 'VISTA RESIDENCES INC.'],
    //   ['PRIMA CASA LAND & HOUSES INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES BATANGAS, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES BOHOL, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES BULACAN, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES CEBU, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES DAVAO, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES GENERAL SANTOS, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES ILOCOS, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES ILOILO, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES ISABELA, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES LEYTE, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES NAGA, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES PAMPANGA INC.,', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES PANAY, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES PANGASINAN, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES TARLAC INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['COMMUNITIES ZAMBOANGA, INC.', 'COMMUNITIES PHILIPPINES, INC.'],
    //   ['MASTERPIECE ASIA PROPERTIES ', 'VISTAMALLS. INC.\t \t \t \t \t'],
    //   ['MANUELA CORPORATION', 'VISTAMALLS. INC.\t \t \t \t \t'],
    //   ['VISTAREIT, INC.', 'MASTERPIECE ASIA PROPERTIES '],
      
    // ]
    
    console.log(this.orgsData);
    var chart;
    
    var data = new google.visualization.DataTable();
      data.addColumn('string', 'Name');
      data.addColumn('string', 'Manager');

      data.addRows(this.orgsData);
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
          const selectedItem = this.orgsData[chart.getSelection()[0].row];
          this.updateNodeDetails(selectedItem);
          this.isNodeDetailsVisible = true;
          this.showPopup(); // 
          chart.collapse(data.getValue(chart.getSelection()[0].row, 0)); // Collapse on single-click
          console.log(selectedItem);
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
    getManagingCompany((mngComp) => {
        const dataArr: any[] = [];
        mngComp.forEach((item) => {
        // Create a new object with the desired structure and add it to dataArr
        dataArr.push([ item.aff_com_account_name,
          item.manager,]
        );
      this.orgsData = dataArr;
      return dataArr;
      });
    }) 
    console.log(this.orgsData);
    // console.log(orgsData);
  }

  

  updateNodeDetails(selectedItem) {
    if (event instanceof MouseEvent) {
      const nodeName = selectedItem[0];
      const nodeManager = selectedItem[1];
      const nodeDetails = `Name: ${nodeName}<br>Manager: ${nodeManager}`;
      this.nodeDetails.nativeElement.innerHTML = nodeDetails;
      
      // Position the #nodePopover element at the mouse pointer's position
      const nodePopover = this.nodePopover.nativeElement;
      this.renderer.setStyle(nodePopover, 'display', 'block');
      this.renderer.setStyle(nodePopover, 'left', `${event.clientX}px`);
      this.renderer.setStyle(nodePopover, 'top', `${event.clientY}px`);
    }
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
  
}
