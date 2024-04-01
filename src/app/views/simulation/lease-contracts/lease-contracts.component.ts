import { Component } from '@angular/core';


import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';

// MAT-TABLE
import { MatTableDataSource } from '@angular/material/table';

// For Exporting to CSV and PDF
import { CsvExportService } from './../../../services/data_extraction/csvexport/csvexport.service';
import { PdfExportService } from './../../../services/data_extraction/pdfexport/pdfexport.service';


@Component({
  selector: 'app-lease-contracts',
  templateUrl: './lease-contracts.component.html',
  styleUrls: ['./lease-contracts.component.scss']
})
export class LeaseContractsComponent {

//   lease = [
//     {
//         "id": 17,
//         "branch": "AllBank (A Thrift Bank), Inc - ATM Villar Sipag",
//         "lessor": "Villar Sipag at Tiyaga Foundation Inc.",
//         "address": "C5 Extension Pulang Lupa uno, Las Pinas City",
//         "payee": "Villar Sipag at Tiyaga Foundation Inc.",
//         "floor_area": 2.00,
//         "rent_vat": 12078.82,
//         "cusa_vat": 27056.56,
//         "mktg_support": 1680.00,
//         "monthly": 560.00,
//         "annual": 29296.56
//     },
//     {
//         "id": 16,
//         "branch": "AllBank (A Thrift Bank), Inc - SJDM",
//         "lessor": "VistaReit",
//         "address": "Starmall - Brgy Kaypian San Jose Del Monte Bulacan",
//         "payee": "VISTAREIT",
//         "floor_area": 102.00,
//         "rent_vat": 670.05,
//         "cusa_vat": 76546.51,
//         "mktg_support": 11424.00,
//         "monthly": 571.20,
//         "annual": 88541.71
//     },
//     {
//         "id": 15,
//         "branch": "AllBank (A Thrift Bank), Inc - Bacoor Nomo",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall North Molino, Molino Blvd. Niog Bacoor, Cavite",
//         "payee": "MAPI",
//         "floor_area": 64.00,
//         "rent_vat": 729.31,
//         "cusa_vat": 52276.94,
//         "mktg_support": 10752.00,
//         "annual": 63028.94
//     },
//     {
//         "id": 14,
//         "branch": "AllBank (A Thrift Bank), Inc - Molino",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Molino Jefferson, Daang Hari Road cor. Molino Road, Bacoor City, Cavite",
//         "payee": "VISTAREIT",
//         "floor_area": 57.35,
//         "rent_vat": 770.40,
//         "cusa_vat": 49484.33,
//         "mktg_support": 9634.80,
//         "monthly": 642.32,
//         "annual": 59761.45
//     },
//     {
//         "id": 13,
//         "branch": "AllBank (A Thrift Bank), Inc - Kawit",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Kawit, Centennial Road, Brgy. Magdalo, Kawit Cavite",
//         "payee": "MAPI",
//         "floor_area": 62.13,
//         "rent_vat": 765.78,
//         "cusa_vat": 53287.26,
//         "mktg_support": 8350.27,
//         "monthly": 695.86,
//         "annual": 62333.39
//     },
//     {
//         "id": 12,
//         "branch": "AllBank (A Thrift Bank), Inc - Dasmarinas",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Dasmarinas, E. Aguinaldo Highway Brgy. San Agustin 2, Cavite",
//         "payee": "MAPI",
//         "floor_area": 44.25,
//         "rent_vat": 1464.10,
//         "cusa_vat": 72560.80,
//         "mktg_support": 6442.80,
//         "monthly": 495.60,
//         "annual": 79499.20
//     },
//     {
//         "id": 11,
//         "branch": "AllBank (A Thrift Bank), Inc - Tanza",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Tanza, Punta II, Tanza, Cavite",
//         "payee": "VISTAREIT",
//         "floor_area": 60.55,
//         "rent_vat": 932.18,
//         "cusa_vat": 63216.72,
//         "mktg_support": 8816.08,
//         "monthly": 678.16,
//         "annual": 72710.96
//     },
//     {
//         "id": 10,
//         "branch": "AllBank (A Thrift Bank), Inc - Taguig",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Taguig, Phase 1, Levi Mariano Ave., Brgy. Ususan, Taguig City",
//         "payee": "MAPI",
//         "floor_area": 47.00,
//         "rent_vat": 924.48,
//         "cusa_vat": 48664.63,
//         "mktg_support": 7896.00,
//         "monthly": 526.40,
//         "annual": 57087.03
//     },
//     {
//         "id": 9,
//         "branch": "AllBank (A Thrift Bank), Inc - Sta Rosa",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Sta Rosa, Phase 1, Sta Rosa-Tagaytay Road, Sta Rosa City",
//         "payee": "MAPI",
//         "floor_area": 45.00,
//         "rent_vat": 1074.23,
//         "cusa_vat": 54141.19,
//         "mktg_support": 6048.00,
//         "monthly": 504.00,
//         "annual": 60693.19
//     },
//     {
//         "id": 8,
//         "branch": "AllBank (A Thrift Bank), Inc - Polar Shaw",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "G/F Polar Center Bldg., EDSA Cor., Mandaluyong City.",
//         "payee": "MAPI",
//         "floor_area": 126.10,
//         "rent_vat": 1021.03,
//         "cusa_vat": 144202.11,
//         "mktg_support": 20436.27,
//         "monthly": 0.00,
//         "annual": 164638.38
//     },
//     {
//         "id": 7,
//         "branch": "AllBank (A Thrift Bank), Inc - Pampanga",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Pampanga, McArthur Highway, San Fernando City",
//         "payee": "VISTAREIT",
//         "floor_area": 43.47,
//         "rent_vat": 1074.23,
//         "cusa_vat": 52300.39,
//         "mktg_support": 6329.23,
//         "monthly": 486.86,
//         "annual": 59116.49
//     },
//     {
//         "id": 6,
//         "branch": "AllBank (A Thrift Bank), Inc - Malolos",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vistamall Malolos, McArthur Highway, Brgy. Longos, Bulacan",
//         "payee": "MAPI",
//         "floor_area": 50.84,
//         "rent_vat": 729.30,
//         "cusa_vat": 41526.93,
//         "mktg_support": 7402.30,
//         "monthly": 569.41,
//         "annual": 49498.64
//     },
//     {
//         "id": 5,
//         "branch": "AllBank (A Thrift Bank), Inc - Las Pinas",
//         "lessor": "Manuela Corporation",
//         "address": "Starmall, CV Starr Avenue, Philamlife Village, Pamplona  Las Pinas City",
//         "payee": "MANUELA CORP",
//         "floor_area": 88.55,
//         "rent_vat": 914.60,
//         "cusa_vat": 90706.37,
//         "mktg_support": 12892.88,
//         "monthly": 991.76,
//         "annual": 104591.01
//     },
//     {
//         "id": 4,
//         "branch": "AllBank (A Thrift Bank), Inc - Imus",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Emilio Aguinaldo Highway, Brgy. Palico, Imus, Cavite City",
//         "payee": "VISTAREIT",
//         "floor_area": 164.56,
//         "rent_vat": 974.36,
//         "cusa_vat": 179581.56,
//         "mktg_support": 18430.72,
//         "monthly": 1843.07,
//         "annual": 199855.36
//     },
//     {
//         "id": 3,
//         "branch": "AllBank (A Thrift Bank), Inc - Head Office",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Polar Center Bldg., EDSA Cor., Mandaluyong City.",
//         "payee": "MAPI",
//         "floor_area": 444.05,
//         "rent_vat": 773.91,
//         "cusa_vat": 384893.30,
//         "mktg_support": 75565.23,
//         "monthly": 0.00,
//         "annual": 460458.54
//     },
//     {
//         "id": 2,
//         "branch": "AllBank (A Thrift Bank), Inc - General Trias",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vista General Trias, Arnold Highway, Brgy. San Francisco, General Trias, Cavite",
//         "payee": "VISTAREIT",
//         "floor_area": 60.00,
//         "rent_vat": 1023.08,
//         "cusa_vat": 68750.98,
//         "mktg_support": 8736.00,
//         "monthly": 672.00,
//         "annual": 78158.98
//     },
//     {
//         "id": 1,
//         "branch": "AllBank (A Thrift Bank), Inc - Bataan",
//         "lessor": "Masterpiece Asia Properties, Inc.",
//         "address": "Vista Bataan, Brgy. Cupang, Balanga, Bataan",
//         "payee": "MAPI",
//         "floor_area": 40.14,
//         "rent_vat": 1074.23,
//         "cusa_vat": 48293.94,
//         "mktg_support": 5844.38,
//         "monthly": 449.57,
//         "annual": 54587.90
//     }
// ]


  displayedColumns: string[] = [
    'id', 'branch', 'lessor', 
    'address', 'payee', 'floor_area', 'rent_vat',
    'rent_vat', 'cusa_vat', 'mktg_support', 'monthly', 'annual'];
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
    this.get.getLease((LeaseData) => {
      
      if (LeaseData) {
      
        
        // Update the dataSource with the combined data
        this.dataSource.data = LeaseData;

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
    'SEQ': item.id,
    'BRANCH': item.branch,
    'LESSOR': item.lessor,
    'ADDRESS': item.address,
    'PAYEE': item.payee,
    'FLOOR AREA': item.floor_area,
    'RENT (VAT inclusive)': item.rent_vat, // If netBal is undefined, make it blank
    'CUSA (VAT inclusive)': item.cusa_vat,
    'Mktg Support Fee (VAT Inclusive)': item.mktg_support,
    'Monthly Amount': item.monthly, // Format date as MM/dd/yyyy if not blank
    'Annual Amount': item.annual
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
  const filename = `LeaseAndContracts.pdf`;
  const headerText = formattedDate;

  const data = this.dataSource.data.map(item => ({
    'SEQ': item.id,
    'BRANCH': item.branch,
    'LESSOR': item.lessor,
    'ADDRESS': item.address,
    'PAYEE': item.payee,
    'FLOOR AREA': item.floor_area,
    'RENT (VAT inclusive)': item.rent_vat, // If netBal is undefined, make it blank
    'CUSA (VAT inclusive)': item.cusa_vat,
    'Mktg Support Fee (VAT Inclusive)': item.mktg_support,
    'Monthly Amount': item.monthly, // Format date as MM/dd/yyyy if not blank
    'Annual Amount': item.annual
   }));

  const columnsToInclude = [
    'SEQ', 'BRANCH', 'LESSOR', 'ADDRESS', 'PAYEE', 'FLOOR AREA',
    'RENT (VAT inclusive)', 'CUSA (VAT inclusive)', 'Mktg Support Fee (VAT Inclusive)',
    'Monthly Amount', 'Annual Amount'];
  this.pdfExportService.generateLeasePDF(data, filename, columnsToInclude, headerText);
}
}
