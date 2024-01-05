import { Component, OnInit } from '@angular/core';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SBLSimulationModalComponent } from 'src/app/modal-dialog/sbl-simulation-modal/sbl-simulation-modal.component';
import {HoldoutAllocationModalComponent} from '../../../modal-dialog/holdout-allocation-modal/holdout-allocation-modal.component'

//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

interface account {
  name: string;
  list: any[];
}

interface sblAccount {
  aff_com_account_name: string;
  loan_list: any[];
}

interface sblList {
  pn_No: string;
  br_name: string;
  L_type: string;
  collateral: string;
  amt_granted: string;
  date_booked: string;
  O_blnc: string;
  hold_out: string;
  net_holdout: number;
  payment_status: string;
}


@Component({
  selector: 'app-sbl-list',
  templateUrl: './sbl-list.component.html',
  styleUrls: ['./sbl-list.component.scss']
})
export class SBLListComponent implements OnInit{



  rptBal: any;      // => RPT Balance (Net of Hold-out)
  rptRatio: any;    // => RPT Ratio
  subtlOL: any;     // => SUB-TOTAL Original Loan
  subtlOB: any;     // => SUB-TOTAL Outstanding Balance
  ttlRPTOL: any;    // => TOTAL RPT Original Loan
  ttlRPTOB: any;    // => TOTAL RPT Outstanding Loan
  availBal: any;    // => Remaining Balance of Possible Loan Amount
  unimpairedCap: number = 1214764186.16;   //Unimpaired Capital
  definedRptRatio: number = 50;     //Pre defined Percentage
  availRptRatio: any;
  approvedCapital: any;        // => the Loan approved Limit
  // Add a property for the search input
  public searchName: string = '';

  public SBL: sblAccount[] = [];

  public users: account[] = [
    {
     name: 'Fine',
     list: [
      { pn_No: '2021-01-002331',
        br_name: 'Cmstar Management Inc.',
        L_type: 'Term Loan',
        collateral: 'CLEAN',
        amt_granted: '30,000,000.00',
        date_booked: '01/13/2021',
        O_blnc: '2,698,633.09',
        hold_out: '',
        net_holdout:  2698633.09,
        payment_status: 'current',
      },
      { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
     ]
    },
    {
      name: 'All Value',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    },
    {
      name: 'All Day',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    },
    {
      name: 'All Home',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    },
    {
      name: 'All Holdings',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    }

  ]


  constructor(
    private get: FetchDataService,
    public _dialog: MatDialog,) {

    }

  ngOnInit() {
    // Additional initialization logic if needed
    this.updateTableData();
  }

  updateTableData(): void {
    this.get.getSBL((sblData) => {
      console.log(sblData)
      if (sblData) {
        this.SBL = sblData;
        // if (Array.isArray(sblData)) {
        //   sblData.forEach((item) => {

        //     console.log(item);
            
        //   });
        // }
        // else{

        // }
        // Use reduce to calculate the sum of "principal" values
        // const sumPrincipal = sblData.reduce((acc, obj) => {
        //   acc.principal += parseFloat(obj.principal) || 0;
        //   acc.principal_bal += parseFloat(obj.principal_bal) || 0;
        //   return acc;
        // }, { principal: 0, principal_bal: 0 });

        // this.rptBal = sumPrincipal.principal_bal;
        // const percentage = `${((this.rptBal / 1214764186.16) * 100).toFixed(2)}%`;
        // this.rptRatio = percentage;
        // // this.subtlOL = sumPrincipal.principal;
        // // this.subtlOB = this.rptBal;
        // this.ttlRPTOL = sumPrincipal.principal;
        // this.ttlRPTOB = this.rptBal;
        // this.SBL = sblData;
        // console.log(this.SBL);
        // this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
        // this.approvedCapital = this.unimpairedCap * 0.5;
        
        // this.availBal = this.approvedCapital - this.rptBal;
      } else {

      }
    });
  }

  // Function to scroll to the card with the specified name
  scrollToUser(name: string) {
    const element = document.getElementById(name);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center'});
    }
  }


  // Function to Show the simulation Modal
  openSimulation() {
    const dialogRef = this._dialog.open(SBLSimulationModalComponent, {
      width: '50%', // Set the width as per your requirement
      // Other MatDialog options can be specified here
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.updateTableData();
        }
      },
    });
  }


  allocateHoldOut() {
    const dialogRef = this._dialog.open(HoldoutAllocationModalComponent, {
      width: '30%', // Set the width as per your requirement
      // Other MatDialog options can be specified here
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // this.updateTableData();
        }
      },
    });
  }
  
  

}
