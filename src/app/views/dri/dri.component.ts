import { AfterViewInit, Component, ViewChild } from '@angular/core';


import {animate, state, style, transition, trigger} from '@angular/animations'
import {NgFor, NgIf} from '@angular/common';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';


// Functions Imports
import {callJSFun} from '../../functions-files/javascriptfun.js';
import {createDosri} from '../../functions-files/addDosri.js'

export interface Child {
  name: string;
}


export interface Data {
  bn: string;
  Nodirectors: string,
  LDUpdated: String,
  action: string,
  view: string,
  children?: Child[];
}

export interface DData {
  Cis: string;
  Dname: string,
  position: String,
  action: string,
  view: string,
}

@Component({
  selector: 'app-dri',
  templateUrl: './dri.component.html',
  styleUrls: ['./dri.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

@Injectable({
  providedIn: 'root',
})

export class DRIComponent implements AfterViewInit {
  sharedData: string | any;


  //  displayedColumns: string[] = ['bn', 'Nodirectors', 'LDUpdated', 'view'];
  
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);
  ToDisplay: string[] = [];
  columnsToDisplay: string[] = ['expand', 'bn', 'Nodirectors', 'LDUpdated', 'view'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,];
  expandedElement: Data | null = null;

  DdisplayedColumns: string[] = ['Cis', 'Dname', 'position'];
  DdataSource = new MatTableDataSource<DData>(Directors_DATA);


  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  
  

  constructor(private router: Router) {}
  

  ngOnInit(): void {
    callJSFun()
    
  }

  
  

  //All functions are below
  //All Function below
  addData() {
    // callJSFun(); // Call your JS function
    createDosri() // Call your createDosri function
  }

  onButtonClick() {
    console.log('Show Modal');
    
  }

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
    bn: "Business001",
    Nodirectors: '3',
    LDUpdated: '2023-10-02 00:00:00',
    action: '',
    view: '',
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
    bn: "Business002",
    Nodirectors: '4',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business003",
    Nodirectors: '5',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business004",
    Nodirectors: '2',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business005",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business006",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business007",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business008",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business009",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
  {
    bn: "Business010",
    Nodirectors: '3',
    LDUpdated: '2021-11-01 00:00:00',
    action: '',
    view: '',
  },
];


const Directors_DATA: DData[] = [
  {
    Cis: "1480001",
    Dname: 'John',
    position: 'Director',
    action: '',
    view: '',
  },
]


