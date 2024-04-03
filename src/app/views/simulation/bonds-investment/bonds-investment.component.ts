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
    private csvExportService: CsvExportService,
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
  const filename = `BondsAndInvestment.csv`;
 
  const data = this.dataSource.data.map(item => ({
    'CORPORATE BONDS': item.type,
    'LISTING DATE': item.listing_date,
    'AMOUNT PLACED': item.amount_placed,
    'MATURITY DATE': item.maturity,
    'COUPON RATE': item.coupon
   }));

  const columnsToInclude = ['CORPORATE BONDS', 'LISTING DATE', 'AMOUNT PLACED', 'MATURITY DATE', 'COUPON RATE'];
 this.csvExportService.exportToCSV(data, filename, columnsToInclude);
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
    'CORPORATE BONDS': item.type,
    'LISTING DATE': item.listing_date,
    'AMOUNT PLACED': item.amount_placed,
    'MATURITY DATE': item.maturity,
    'COUPON RATE': item.coupon
   }));

  const columnsToInclude = ['CORPORATE BONDS', 'LISTING DATE', 'AMOUNT PLACED', 'MATURITY DATE', 'COUPON RATE'];
  this.pdfExportService.generateBondsPDF(data, filename, columnsToInclude, headerText);
}

}
