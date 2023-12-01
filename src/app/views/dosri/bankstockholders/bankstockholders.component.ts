import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

// Functions Import
import {updateShares} from '../../../functions-files/updateFunctions'

export interface Data {
  fullname: string;
  company: string,
  position: String,
  shares: String,
  action: string,
}


@Component({
  selector: 'app-bankstockholders',
  templateUrl: './bankstockholders.component.html',
  styleUrls: ['./bankstockholders.component.scss']
})
export class BankstockholdersComponent {

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
  },
];