import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

export interface Child {
  name: string;
}

export interface Siblings {
  name: string;
}

export interface GrandChildren {
  name: string;
}

export interface Data {
  fullname: string;
  company: string,
  position: String,
  mothersname: String,
  fathersname: String,
  siblings?: Siblings[],
  spouse: String,
  children?: Child[];
  motherinlaw: String,
  fatherinlaw: String,
  stepChild: String,
  sonDaughterInLaw: String,
  grandParents: String,
  grandParentsInLaw: String,
  sistersInLaw: String,
  brothersInLaw: String,
  grandChildren?: GrandChildren[],
  grandChildrenInLaw: String,
}




export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



// export interface Data {
//   bn: string;
//   Nodirectors: string,
//   LDUpdated: String,
//   children?: Child[];
// }

@Component({
  selector: 'app-pac',
  templateUrl: './pac.component.html',
  styleUrls: ['./pac.component.scss']
})
export class PACComponent implements AfterViewInit {
  
  sharedData: string | any;

  displayedColumns1 = [
    'name',
    'position',
    'weight',
    'symbol',
    'position',
    'weight',
    'symbol',
    'star',
  ];
  dataSource1 = ELEMENTs_DATA;

  displayedColumns: string[] = ['company', 'fullname', 'position', 'mothersname', 'fathersname', 'siblings', 'spouse',
  'children', 'motherinlaw', 'fatherinlaw', 'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

const ELEMENTs_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


// Data Sets
const ELEMENT_DATA: Data[] = [
  {
    company: 'Prescription Holdings Limited, Inc.',
    fullname: "Avelina Caparros Pascua",
    position: "UBO",
    mothersname: 'Rosario I. Caparros (+)',
    fathersname: 'Gerardo O. Caparros (+)',
    siblings: [
      {name: 'Eugenio I. Caparros (+)'},
      {name: 'Carmelo I. Caparros (+)'},
      {name: 'Carmelo I. Caparros (+)'}
    ],
    spouse: 'Deogracias C. Pascua, Jr.',
    children: [
      { name: 'Zarah Angeline P. Dilig' },
    ],
    motherinlaw: 'Estelita Centeno Pascua (+)',
    fatherinlaw: 'Deogracias D. Pascua, Sr. (+)',
    stepChild: 'None',
    sonDaughterInLaw: 'Grego C. Dilig',
    grandParents: 'Deceased',
    grandParentsInLaw: 'Deceased',
    sistersInLaw: 'None',
    brothersInLaw: 'None',
    grandChildren: [
      {name: 'Jamie Sky P. Dilig'},
      {name: 'Lucas Zac P. Dilig'}
    ],
    grandChildrenInLaw: 'None',
  },
];