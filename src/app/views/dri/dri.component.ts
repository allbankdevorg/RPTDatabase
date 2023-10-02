import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  
  

  // constructor(private sharedService: DataService) {
  //   this.sharedService.sharedData$.subscribe(data => {
  //     this.sharedData = data;
  //   });
  // }

  
  

  //All functions are below
  
  viewData(element: Data) {
    // Implement the logic to display the data for the clicked element
    console.log(`View data for BCH`);
    console.log(`BCH: ${element.bn}`);
    console.log(`Account No: ${element.Nodirectors}`);
    console.log(`Terminal Name: ${element.LDUpdated}`);

    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json))

      this.fetchData();
  }  

  async fetchData() {
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: 'https://realtor.p.rapidapi.com/locations/v2/auto-complete',
      params: {
        input: 'new york',
        limit: '10'
      },
      headers: {
        'X-RapidAPI-Key': '37dfb4d13amsh8aefdd321cce94ep1ff755jsnc672babb9a6c',
        'X-RapidAPI-Host': 'realtor.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
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