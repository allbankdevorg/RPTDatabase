import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

export interface Child {
  name: string;
}

export interface Data {
  fullname: string;
  company: string,
  position: String,
  mothersname: String,
  fathersname: String,
  spouse: String,
  children?: Child[];
  motherinlaw: String,
  fatherinlaw: String,
}

@Component({
  selector: 'app-bankofficer',
  templateUrl: './bankofficer.component.html',
  styleUrls: ['./bankofficer.component.scss']
})
export class BankofficerComponent implements AfterViewInit {
  
  sharedData: string | any;

  displayedColumns: string[] = ['fullname', 'company', 'position', 'mothersname', 'fathersname', 'spouse',
  'children', 'motherinlaw', 'fatherinlaw'];
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}


// Data Sets
const ELEMENT_DATA: Data[] = [
  {
    fullname: "John Doe",
    company: 'All Bank',
    position: 'Director',
    mothersname: 'sample',
    fathersname: 'sample',
    spouse: 'sample',
    children: [
      { name: 'CAMACHO, JAVIER FAUSTO' },
      { name: 'CAMACHO, GERARDO FAUSTO' },
      {name: 'CAMACHO, ELIRITA FAUSTO'},
      {name: 'CAMACHO, REGINA FAUSTO'},
    ],
    motherinlaw: 'sample',
    fatherinlaw: 'sample',
  },
];
