import { Component } from '@angular/core';


// Import for Simulation Modal
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { RPTSimulationModalComponent } from 'src/app/modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';


export interface RPTlist_model {
  loantype: string;
  cis_no: number;
  pn_no: number;
  borrower: string;
  orig_loan: number;
  O_blnc: number;
}


@Component({
  selector: 'app-rpt-list',
  templateUrl: './rpt-list.component.html',
  styleUrls: ['./rpt-list.component.scss']
})
export class RptListComponent {
  displayedColumns: string[] = ['loantype', 'cis_no', 'pn_no', 'borrower', 'orig_loan', 'O_blnc'];
  dataSource = ELEMENT_DATA;


  constructor(
    public _dialog: MatDialog,) {

    }

  // Dummy
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;



    // Function to Show the simulation Modal
    openSimulation() {
      const dialogRef = this._dialog.open(RPTSimulationModalComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            // this.updateTableData();
          }
        },
      });
    }
}


const ELEMENT_DATA: RPTlist_model[] = [
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
  {loantype: 'Long Term', cis_no: 123123, pn_no: 89767, borrower: 'test', orig_loan: 1000000, O_blnc: 2344234},
];
