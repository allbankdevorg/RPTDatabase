import { Component } from '@angular/core';

// MAT-TABLE
import { MatTableDataSource } from '@angular/material/table';

import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';


// For Exporting to CSV and PDF
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';

@Component({
  selector: 'app-bonds-investment',
  templateUrl: './bonds-investment.component.html',
  styleUrls: ['./bonds-investment.component.scss']
})
export class BondsInvestmentComponent {


  displayedColumns: string[] = ['type', 'listing_date', 'amount_placed',
  'maturity', 'coupon'];
  dataSource = new MatTableDataSource<any>([]);
  ToDisplay: string[] = [];

  constructor(
    private pdfExportService: PdfExportService,
    private get: FetchDataService,
  ) {

  }
  ngOnInit() {
    this.updateDataTables();
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  
     }

  
     updateDataTables() {
      this.get.getBonds((bondsInvestment) => {
        
        if (bondsInvestment) {
        
          
          // Update the dataSource with the combined data
          this.dataSource.data = bondsInvestment;
  
          // console.log(LeaseData);
        }
      });
    }




// Export Functions

downloadCSV(): void {
  const currentDate = new Date();
  let selectedDateFormatted: string = '';
  
  
  const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const filename = `RPT_List_${formattedDate}.csv`;
 
  const data = this.dataSource.data.map(item => ({
    'CIS NUMBER': item.cis_no,
    'PN/LOAN NUMBER': item.loan_no,
    'BORROWER/GROUP': item.name,
    'ORIGINAL LOAN': item.principal,
    'OUTSTANDING BALANCE': item.principal_bal,
    'DEPOSIT HOLDOUT': item.holdoutdata,
    'NET BALANCE': item.netBal || '', // If netBal is undefined, make it blank
    'LOAN SECURITY': item.loan_security,
    'INTEREST RATE': item.int_rate,
    'TRANSACTION DATE': item.date_granted ? new Date(item.date_granted).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '', // Format date as MM/dd/yyyy if not blank
  }));

  // Specify the columns to include in the CSV
  const columnsToInclude = ['CIS NUMBER', 'PN/LOAN NUMBER', 'BORROWER/GROUP', 'ORIGINAL LOAN', 'OUTSTANDING BALANCE', 'DEPOSIT HOLDOUT', 'NET BALANCE', 'LOAN SECURITY', 'INTEREST RATE', 'TRANSACTION DATE'];

  // this.csvExportService.exportToCSV(data, filename, columnsToInclude);
}


// generatePDF(): void {
//   const elementId = 'htmlData'; // Replace 'htmlData' with the ID of the element you want to convert to PDF
//   const fileName = 'your-file-name.pdf'; // Replace 'your-file-name' with the desired file name

//   this.pdfExportService.generatePDF(elementId, fileName);
// }

generatePDF(): void {
  const currentDate = new Date();
  let selectedDateFormatted: string = '';
  
  
  const formattedDate = selectedDateFormatted || currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const filename = `BondsAndInvestment.pdf`;
  const headerText = formattedDate;

  const data = this.dataSource.data.map(item => ({
    'CORPORATE BONDS': item.name,
    'LISTING DATE': item.listingDate,
    'AMOUNT PLACED': item.amountPlaced,
    'MATURITY DATE': item.maturityDate,
    'COUPON RATE': item.couponRate
   }));

  const columnsToInclude = ['CORPORATE BONDS', 'LISTING DATE', 'AMOUNT PLACED', 'MATURITY DATE', 'COUPON RATE'];
  this.pdfExportService.generateBondsPDF(data, filename, columnsToInclude, headerText);
}

}
