import { Component, AfterViewInit, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';

// For Modal Dialog
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { OtherRPModalComponent } from 'src/app/modal-dialog/other-rpmodal/other-rpmodal.component';
import {UpdateJMNComponent} from '../../../modal-dialog/update-jmn/update-jmn.component'
import {AffiliatesRpmodalDetailsComponent} from '../../../modal-dialog/affiliates-rpmodal-details/affiliates-rpmodal-details.component';
import {AddChildModalComponent} from '../../../modal-dialog/add-child-modal/add-child-modal.component';


import {checkHoldOutValue} from '../../../functions-files/add/postAPI';

// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';


// Service
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import {AffiliatesService} from '../../../services/affiliates/affiliates.service'; //Service to set the value of the DirCIS and buttonID in adding RI of Directors


declare var $: any; // Declare $ to use jQuery

interface CompData {
  id: string;
  comCisNum: string;
  name: string;
  parent_cis: string,
  parent: string;
  manager: string;
  date_inserted: string;
  status: number;
  module: string;
  hold_out: number;
}

interface Company {
  name: string;
  manager: string;
  name_cis: string;
  managerCIS: string;
  hold_out: number;
  managers: string[];
  children: Company[];
}

@Component({
  selector: 'app-affiliates-related-companies',
  templateUrl: './affiliates-related-companies.component.html',
  styleUrls: ['./affiliates-related-companies.component.scss']
})
export class AffiliatesRelatedCompaniesComponent implements OnInit{

  // Dataorig: CompData[] = [];
  dataLoaded: boolean = true;
  selectedData: any
  totalHoldOut: any;
  com_cis: any;
  orgsData: Company[] = [];
  datas: any;

  constructor(
    public _dialog: MatDialog,
    private fetchDataService: FetchDataService,
    private dataService: AffiliatesService,
    private el: ElementRef, 
    private renderer: Renderer2) {}


  @ViewChild('actionModal') actionModal!: ElementRef;
  @ViewChild('nodePopover') nodePopover!: ElementRef;
  @ViewChild('nodeDetails', { static: true }) nodeDetails!: ElementRef;


  ngOnInit(): void {
    this.fetchAssocCompany();
  }

  
  drawOrgChart(dataArr) {
    // var OrgData = this.Dataorig;

    const testData = dataArr.map(originalJson => ({
      id: originalJson.id,
      comCisNum: originalJson.comCisNum,
      name: originalJson.name,
      parent_cis: originalJson.parent_cis,
      parent: originalJson.parent,
      manager: originalJson.manager,
      date_inserted: originalJson.date_inserted,
      status: originalJson.status,
      module: originalJson.module,
      hold_out: originalJson.hold_out
    }));

    $('#orgChart').orgChart({
      data: testData,
      showControls: true,
      allowEdit: false,
      onAddNode: function (node: any) {
        // log('Created new node on node ' + node.data.id);
        // $('#orgChart').orgChart('newNode', node.data.id);
      },
      onDeleteNode: function (node: any) {
        // log('Deleted node ' + node.data.id);
        // $('#orgChart').orgChart('deleteNode', node.data.id);
      },
      onClickNode: (node: any) => {
        const selectedNode = node.data;
        const selectedItem = this.orgsData[node.data];
        this.updateNodeDetails(selectedNode);
        
        this.com_cis = node.data.id;
        this.showModal(); // now `this` refers to the component instance
        this.fetchTotalHoldOut();
      }
    });

    // Example log function
    function log(text: string) {
      $('#consoleOutput').append('<p>' + text + '</p>');
    }

   
  }

  updateNodeDetails(selectedItem) {
    
    const transformedData = {
      aff_com_comp_name: selectedItem.name,
      manager: selectedItem.manager,
      aff_com_cis_number: selectedItem.comCisNum,
      managing_company: selectedItem.parent_cis,  
      hold_out: selectedItem.hold_out
  };
    
    this.selectedData = transformedData;
    
    if (event instanceof MouseEvent) {
      const nodeName = selectedItem.name;
      const nodeManager = selectedItem.manager;
      const nodeDetails = `Name: ${nodeName}<br>Manager: ${nodeManager}`;
      this.nodeDetails.nativeElement.innerHTML = nodeDetails;
      

    }
  }



  fetchTotalHoldOut() {
    // const com_cis = this.selectedData.aff_com_cis_number;
    const com_cis = this.com_cis;
    checkHoldOutValue(com_cis)
      .then((response) => {
        this.ngOnInit();
        // this.logAction('Add', 'Added Affiliates', true, 'Affiliates');
        
        const holdOutData = response;
        if (response && response.result && response.result[0] && response.result[0].Data) {
          const dataArray = response.result[0].Data;
          this.totalHoldOut = dataArray.reduce((acc, item) => acc + (item.deposit_holdout || 0), 0);
        } else {
          this.totalHoldOut = 0;
        }
      })
      .catch((error) => {
        // Handle errors when the promise is rejected
      });

  }

  fetchAssocCompany() {
    this.fetchDataService.getManagingCompany((mngComp) => {
      if (mngComp) {
        
        const dataArr: CompData[] = [];
        const cisToIdMap: { [key: string]: number } = {};
        
        mngComp.forEach((item) => {
          
          cisToIdMap[item.aff_com_cis_number] = item.id.toString();

          const company: CompData = {
            id: item.id,
            comCisNum: item.aff_com_cis_number,
            name: item.aff_com_account_name,
            parent_cis: item.managing_company,
            // Update parent field to use the corresponding ID from the map
            parent: cisToIdMap[item.managing_company]?.toString() || "",
            manager: item.manager || "",
            date_inserted: item.date_inserted,
            status: item.status,
            module: item.module,
            hold_out: item.hold_out || 0.00
          };
          dataArr.push(company);
          
        });
        // this.Dataorig = dataArr;
        
        this.dataLoaded = true;
        this.drawOrgChart(dataArr);
        
      }
    });
  }




  onButtonClick(module: any) {
    this.dataService.setmoduleV(module);
  }

  showModal(): void {
    this.datas = this.selectedData.aff_com_comp_name;
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






  //Show Modal Dialog
  AddChildComp(event: any) {
    const data = this.selectedData;
    const dialogRef = this._dialog.open(AddChildModalComponent, {
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

  viewData(event: any) {
    const data = this.selectedData;
    const holdOUT = this.totalHoldOut;
    event.stopPropagation();
    const dialogRef = this._dialog.open(AffiliatesRpmodalDetailsComponent, {
      data: {
        totalHoldOut: this.totalHoldOut,
        selectedData: data,
      },
    });
  
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.ngOnInit();
        }
      },
    });
  }


      // Show Modal Form
openAddEditEmpForm() {
  const dialogRef = this._dialog.open(OtherRPModalComponent);
  dialogRef.afterClosed().subscribe({
    next: (val) => {
      if (val) {
        this.ngOnInit();
      }
    },
  });
}

openEditForm(event: any) {
  const data = this.selectedData
  event.stopPropagation();
  const dialogRef = this._dialog.open(UpdateJMNComponent, {
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
}

