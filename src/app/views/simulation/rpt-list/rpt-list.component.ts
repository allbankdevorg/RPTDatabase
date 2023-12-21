import { Component } from '@angular/core';


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


  // Dummy
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
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