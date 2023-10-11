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

  displayedColumns: string[] = ['company', 'fullname', 'position', 'mothersname', 'fathersname', 'siblings', 'spouse',
  'children', 'motherinlaw', 'fatherinlaw', 'stepChild', 'sonDaughterInLaw', 'grandParents', 'grandParentsInLaw', 'sistersInLaw', 'brothersInLaw', 'grandChildren', 'grandChildrenInLaw'];
  dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}


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