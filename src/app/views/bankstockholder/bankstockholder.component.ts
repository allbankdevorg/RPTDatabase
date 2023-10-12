import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';



// Functions Import
import {updateShares} from '../../functions-files/updateFunctions'
// export interface Child {
//   name: string;
// }

export interface Data {
  fullname: string;
  company: string,
  position: String,
  shares: String,
  action: string,
  // mothersname: String,
  // fathersname: String,
  // spouse: String,
  // children?: Child[];
  // motherinlaw: String,
  // fatherinlaw: String,
}

@Component({
  selector: 'app-bankstockholder',
  templateUrl: './bankstockholder.component.html',
  styleUrls: ['./bankstockholder.component.scss']
})
export class BankstockholderComponent implements AfterViewInit {
  sharedData: string | any;

  displayedColumns: string[] = ['fullname', 'position', 'shares', 'action'];
  displayedColumns1: string[] = ['company'];
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Functions
  onRowClick(row: any) {
    // Capture the selected data and navigate to another component with it
    // this.router.navigate(['/details', row.id]);
    console.log('Show Update Modal Form');
    // this.router.navigate(['/dri/directorsrelated', row.bn]);
  }

  updateShares() {
    updateShares()
  }

}


// Data Sets
const ELEMENT_DATA: Data[] = [
  {
    fullname: "John Doe",
    position: 'Director',
    shares: '1.2',
    action: '',
    company: 'All Bank',
    // mothersname: 'sample',
    // fathersname: 'sample',
    // spouse: 'sample',
    // children: [
    //   { name: 'CAMACHO, JAVIER FAUSTO' },
    //   { name: 'CAMACHO, GERARDO FAUSTO' },
    //   {name: 'CAMACHO, ELIRITA FAUSTO'},
    //   {name: 'CAMACHO, REGINA FAUSTO'},
    // ],
    // motherinlaw: 'sample',
    // fatherinlaw: 'sample',
  },
];
