import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';

export interface Child {
  name: string;
}

export interface Data {
  bn: string;
  Nodirectors: string,
  LDUpdated: String,
  children?: Child[];
}

@Component({
  selector: 'app-dri',
  templateUrl: './dri.component.html',
  styleUrls: ['./dri.component.scss']
})

@Injectable({
  providedIn: 'root',
})

export class DRIComponent implements AfterViewInit {
  sharedData: string | any;

  displayedColumns: string[] = ['bn', 'Nodirectors', 'LDUpdated'];
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  
  

  constructor(private router: Router) {}
  

  
  

  //All functions are below
  onRowClick(row: any) {
    // Capture the selected data and navigate to another component with it
    // this.router.navigate(['/details', row.id]);
    console.log('row has been clicked');
    console.log('Clicked row data:', row);
    this.router.navigate(['/dri/directorsrelated', row.bn]);
  }
}


// Data Sets
const ELEMENT_DATA: Data[] = [
  {
    bn: "001",
    Nodirectors: '3',
    LDUpdated: '2023-10-02 00:00:00',
    // children: [
    //   { name: 'CAMACHO, JAVIER FAUSTO' },
    //   { name: 'CAMACHO, GERARDO FAUSTO' },
    //   {name: 'CAMACHO, ELIRITA FAUSTO'},
    //   {name: 'CAMACHO, REGINA FAUSTO'},
    //   {name: 'CAMACHO, ISABEL FAUSTO'},
    //   {name: 'CAMACHO, RAFAEL FAUSTO'},
    //   {name: 'CAMACHO, MIGUEL FAUSTO'},
    // ]
    // LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "002",
    Nodirectors: '4',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "003",
    Nodirectors: '5',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "004",
    Nodirectors: '2',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "005",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "006",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "007",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "008",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "009",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
  },
  {
    bn: "010",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
  },
];