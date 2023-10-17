import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


import { Injectable } from '@angular/core';

// Services
import { DataTransferService } from '../../../services/data-transfer.service';
import { SharedService } from '../dataintegration/shared.service';

// Imports for Functions
import {createDirectors} from '../../../functions-files/addDirectors';
import {createRelatedInterest} from '../../../functions-files/addRelatedInterest';
import {getCompany, getDirectors} from '../../../functions-files/getFunctions'
import {deleteDosri, deleteDirector, deleteRelationship} from '../../../functions-files/delFunctions'

export interface Child {
  name: string;
}

// export interface Data {
//   com_related: string;
//   dir_cisnumber: string;
//   fname: string;
//   company: string,
//   position: String,
//   mothersname: String,
//   fathersname: String,
//   spouse: String,
//   children?: Child[];
//   motherinlaw: String,
//   fatherinlaw: String,
// }

// Interface for the related interest item
interface RelatedInterest {
  id: number;
  cis_number: string;
  fname: string;
  mname: string;
  lname: string;
  dir_related: string;
  relation: number;
  date_inserted: Date;
  status: number;
}

// Interface for the director item
interface Director {
  id: number;
  com_related: string;
  dir_cisnumber: string;
  fname: string;
  mname: string;
  lname: string;
  position: string;
  related_interest: RelatedInterest[];
}


// export interface Data {
//   bn: string;
//   Nodirectors: string,
//   LDUpdated: String,
//   children?: Child[];
// }


@Component({
  selector: 'app-directorsrelated',
  templateUrl: './directorsrelated.component.html',
  styleUrls: ['./directorsrelated.component.scss']
})

@Injectable({
  providedIn: 'root',
})
export class DirectorsrelatedComponent implements AfterViewInit {
  companyDetails: any; //a variable to hold the fetched company details:\
  sharedData: string | any;
  // relationShipModal: any;
  drctrForm: FormGroup;
  riForm: FormGroup;
  buttonId: number = 0;
  directorsData: Director[] = []; // This should be populated with your director data
  filteredDirectors: Director[] = [];

  // dataSource = new MatTableDataSource<Data>(ELEMENT_DATA);
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['FullName', 'Company', 'Position', "MothersName", "FathersName", 'Spouse', 'Children', 'MotherinLaw', 'FatherinLaw'];

  // displayedColumns: string[] = ['fname', 'company', 'position', 'mothersname', 'fathersname', 'spouse',
  // 'children', 'motherinlaw', 'fatherinlaw'];
   // Your data from the getDirectors callback
   directorData: Director[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private router: Router,
              private formBuilder: FormBuilder, 
              private http: HttpClient,
              private sharedService: SharedService,
              private dataTransferService: DataTransferService,
              private route: ActivatedRoute)
  {
    this.drctrForm = this.formBuilder.group({
      cisNumber: [''],
      dFirstName: [''],
      dMiddleName: [''],
      dLastName: [''],
      dPosition: [''],
    });
    this.riForm = this.formBuilder.group({
      riCisNumber: [''],
      riFirstName: [''],
      riMiddleName: [''],
      riLastName: [''],
    });

    this.route.params.subscribe(params => {
      const companyId = params['id'];
      // Fetch director data and related interests based on companyId
      // Display this data in your component's data tables
    });
  }


  ngOnInit(): void {
    const directorId = this.sharedService.getDirectorId();
    
    getDirectors((Director) => {
      const directorIdToDisplay = directorId;
      const filteredDirectors = Director.filter((director) => director.com_related === directorIdToDisplay);
    
      const tableData = filteredDirectors.map(director => {
        const row = {
          'FullName': `${director.fname} ${director.lname}`,
          'Company': director.com_related,
          'Position': director.fname
        };

        row['MothersName'] = director.related_interest
        .filter(related => related.relation === 1) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['FathersName'] = director.related_interest
        .filter(related => related.relation === 2) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['Spouse'] = director.related_interest
        .filter(related => related.relation === 3) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['Children'] = director.related_interest
        .filter(related => related.relation === 4) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['MotherinLaw'] = director.related_interest
        .filter(related => related.relation === 5) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.lname}`)
        .filter(name => name.trim() !== '');

        row['FatherinLaw'] = director.related_interest
        .filter(related => related.relation === 6) // Assuming 1 is the relation for Mother's Name
        .map(related => `${related.fname} ${related.lname}`)
        .filter(name => name.trim() !== '');
    
        // const relationshipLabels = [
        //   "MothersName",
        //   "FathersName",
        //   "Spouse",
        //   "Children",
        //   "MotherinLaw",
        //   "FatherinLaw"
        // ];
    
        // // Create a dictionary to store related interests by relation
        // const relatedInterestsByRelation = {};
    
        // director.related_interest.forEach(related => {
        //   const relationLabel = relationshipLabels[related.relation - 1];
        //   if (!relatedInterestsByRelation[relationLabel]) {
        //     relatedInterestsByRelation[relationLabel] = [];
        //   }
    
        //   relatedInterestsByRelation[relationLabel].push(`${related.fname} ${related.lname}`);
        // });
    
        // relationshipLabels.forEach(label => {
        //   // Check if related interests exist for this relation label
        //   if (relatedInterestsByRelation[label]) {
        //     // If related interests exist, join and add them to the row
        //     row[label] = relatedInterestsByRelation[label].join(' ');
        //   } else {
        //     // If there's no related interest, set it to an empty string
        //     row[label] = '';
        //   }
        // });
        return row;
        
      });
    
      this.dataSource.data = tableData;
      console.log(filteredDirectors);
    });
    
    // getDirectors((Director) => {
    //   const directorIdToDisplay = directorId;
    //   const filteredDirectors = Director.filter((director) => director.com_related === directorIdToDisplay);
    
    //   const tableData = filteredDirectors.map(director => {
    //     const row = {
    //       'FullName': director.fname,
    //       'Company': director.com_related,
    //       'Position': director.position
    //     };
    
    //     const relationshipLabels = [
    //       "MothersName",
    //       "FathersName",
    //       "Spouse",
    //       "Children",
    //       "MotherinLaw",
    //       "FatherinLaw"
    //     ];
        
    //     // Create a dictionary to store related interests by relation
    // const relatedInterestsByRelation = {};
    // director.related_interest.forEach(related => {
    //   const relationLabel = relationshipLabels[related.relation - 1];
    //   if (!relatedInterestsByRelation[relationLabel]) {
    //     relatedInterestsByRelation[relationLabel] = [];
    //   }

    //   relatedInterestsByRelation[relationLabel].push(`${related.fname} ${related.lname}`);
    // });

    //     relationshipLabels.forEach(label => {
    //       // Check if there's a related interest with the specific relationship
    //       const related = director.related_interest.find(related => related.relation === (relationshipLabels.indexOf(label) + 1));
    
    //       if (related) {
    //         // If a related interest exists, add it to the row
    //         row[label] = `${related.fname} ${related.lname}`;
    //       } else {
    //         // If there's no related interest, set it to 'N/A'
    //         row[label] = '';
    //       }
    //     });
    
    //     return row;
    //   });
    
    //   this.dataSource.data = tableData;
    //   console.log(filteredDirectors);
    // });
    // getDirectors((Director) => {
    //   const directorIdToDisplay = directorId;
    //   const filteredDirectors = Director.filter((director) => director.com_related === directorIdToDisplay);
    
    //   const tableData = filteredDirectors.map(director => {
    //     const row = {
    //       'FullName': director.fname,
    //       'Company': director.com_related,
    //       'Position': director.position
    //     };
    
    //     const relationshipLabels = [
    //       "MothersName",
    //       "FathersName",
    //       "Spouse",
    //       "Children",
    //       "MotherinLaw",
    //       "FatherinLaw"
    //     ];
    
    //     relationshipLabels.forEach(label => {
    //       // Check if there's a related interest with the specific relationship
    //       const related = director.related_interest.find(related => related.relation === (relationshipLabels.indexOf(label) + 1));
    
    //       if (related) {
    //         // If a related interest exists, add it to the row
    //         row[label] = `${related.fname} ${related.lname}`;
    //       } else {
    //         // If there's no related interest, set it to 'N/A'
    //         row[label] = '';
    //       }
    //     });
    
    //     return row;
    //   });
    
    //   this.dataSource.data = tableData;
    //   console.log(filteredDirectors);
    // });
    
     
  }

  

  // extractTableData(directors: Director[]) {
  //   const formattedData = directors.flatMap(director => {
  //     // Extract the relevant data from each director
  //     const directorData = {
  //       'Full Name': `${director.fname} ${director.lname}`,
  //       'Company': director.com_related,
  //       'Position': director.fname
  //     };
  
  //     // Extract and format related interests
  //     const relatedInterestData = director.related_interest.map(entry => {
  //       return this.formatRelatedInterest(entry);
  //     });
  
  //     // Combine director data with related interest data
  //     return [directorData, ...relatedInterestData];
  //   });
  
  //   return formattedData;
  // }
  
  // formatRelatedInterest(entry: any) {
  //   const relationshipLabels = [
  //     "Mother's Name",
  //     "Father's Name",
  //     "Spouse",
  //     "Children",
  //     "Mother in Law",
  //     "Father in Law"
  //   ];
  
  //   const relationship = entry.relation;
  //   const relatedInterestData = {
  //     'Full Name': `${entry.fname} ${entry.lname}`,
  //     'Company': entry.cis_number, // Use the appropriate field for company data
  //     'Position': entry.fname,      // Use the appropriate field for position data
  //   };
  
  //   if (relationship >= 1 && relationship <= 6) {
  //     relatedInterestData[relationshipLabels[relationship - 1]] = `${entry.fname} ${entry.lname}`;
  //   }
  
  //   return relatedInterestData;
  // }
  

  // extractTableData(directors: Director[]) {
  //   const formattedData = directors.map(director => {
  //     const directorData = {
  //       'Full Name': `${director.fname} ${director.mname} ${director.lname}`,
  //       'Company': director.com_related,
  //       'Position': director.position,
  //       "Mother's Name": '',
  //       "Father's Name": '',
  //       "Spouse": '',
  //       "Children": '',
  //       "Mother in Law": '',
  //       "Father in Law": '',
  //     };
  
  //     const relationshipLabels = [
  //       "Mother's Name",
  //       "Father's Name",
  //       "Spouse",
  //       "Children",
  //       "Mother in Law",
  //       "Father in Law",
  //     ];
  
  //     if (director.related_interest) {
  //       director.related_interest.forEach(entry => {
  //         const relationship = entry.relation;
  //         const relationshipLabel = relationshipLabels[relationship - 1];
  //         if (directorData[relationshipLabel]) {
  //           directorData[relationshipLabel] += ', ';
  //         }
  //         directorData[relationshipLabel] += `${entry.fname} ${entry.mname} ${entry.lname}`;
  //       });
  //     }
  
  //     return directorData;
  //   });
  
  //   return formattedData;
  // }
  
  
  
  
  // formatRelatedInterest(entry: any) {
  //   const relationshipLabels = [
  //     "Mother's Name",
  //     "Father's Name",
  //     "Spouse",
  //     "Children",
  //     "Mother in Law",
  //     "Father in Law",
  //   ];
  
  //   const relationship = entry.relation;
  
  //   return `${relationshipLabels[relationship - 1]}: ${entry.fname} ${entry.lname}`;
  // }
  
  
  

  
  // extractTableData(directors: Director[]) {
  //   return directors.map(director => {
  //     const rowData = {
  //       'FullName': `${director.fname} ${director.lname}`,
  //       'Company': director.com_related,
  //       'Position': director.position,
  //     };

  //     // // Iterate through the related interests and add them as columns
  //     // director.related_interest.forEach((relatedInterest, index) => {
  //     //   rowData[`RelatedInterest${index + 1}`] = `${relatedInterest.fname} ${relatedInterest.lname}`;
  //     // });

  //     director.related_interest.forEach(relatedInterest => {
  //       const relationLabels = [
  //         'Mother\'s Name',
  //         'Father\'s Name',
  //         'Spouse',
  //         'Children',
  //         'Mother in Law',
  //         'Father in Law'
  //       ];
        
  //       const relationLabel = relationLabels[relatedInterest.relation - 1];
  //       const relatedName = `${relatedInterest.fname} ${relatedInterest.lname}`;

  //       rowData[relationLabel] = relatedName;
  //     });

  //     return rowData;
  //   });
  // }

  generateDisplayedColumns(data: any[]): string[] {
    const columns = new Set<string>();

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        columns.add(key);
      });
    });

    return Array.from(columns);
  }


    
    // const tableData = this.extractTableData(this.directorData);
    // this.dataSource.data = tableData;
    // const tableData = this.extractTableData(this.filteredDirectors);
    //     this.dataSource.data = tableData;
    //     console.log(tableData);
    
    // this.route.params.subscribe(params => {
    //   const companyId = params['companyId'];
    //   // Use the companyId to fetch related data
    //   // this.fetchDataForCompany(companyId);
    // });
    //   // this.dataTransferService.getCompanyData().subscribe((data) => {
    //   //   this.companyDetails = data;
    //   // });

    //   this.dataTransferService.getDirectors().subscribe((data) => {
    //     // this.directorsData = data;
    //     this.dataSource = data;
    //   });
      
    //   // Fetch data using your service
    // this.dataTransferService.getCompanyData().subscribe((data) => {
    //   this.dataSource = data;
    // });
  // }
  // extractTableData(directors: Director[]) {
  //   const formattedData = directors.flatMap(director => {
  //     // Extract the relevant data from each director
  //     const directorData = {
  //       'FullName': `${director.fname} ${director.lname}`,
  //       'Company': director.com_related,
  //       'Position': director.fname
  //     };

  //     // Count related interests for the director
  //     const relatedInterestCount = this.countRelatedInterests(director);

  //     // Combine director data with related interests and count
  //     return [directorData, ...director.related_interest.map(entry => this.formatRelatedInterest(entry, relatedInterestCount))];
  //   });

  //   return formattedData;
  // }

  // countRelatedInterests(director: Director) {
  //   return director.related_interest.filter(entry => entry.cis_number !== '').length;
  // }

  // formatRelatedInterest(entry: RelatedInterest, relatedInterestCount: number) {
  //   // Define the labels for related interests
  //   const relationshipLabels = [
  //     "MothersName",
  //     "FathersName",
  //     "Spouse",
  //     "Children",
  //     "MotherinLaw",
  //     "FatherinLaw"
  //   ];

  //   // Extract the relationship type
  //   const relationship = entry.relation;
  //   const relatedInterestData = {
  //     'FullName': `${entry.fname} ${entry.lname}`,
  //     'Company': entry.cis_number,
  //     'Position': entry.fname,
  //     'RelatedInterestCount': relatedInterestCount // Count of related interests
  //   };

  //   if (relationship >= 1 && relationship <= 6) {
  //     relatedInterestData[relationshipLabels[relationship - 1]] = `${entry.fname} ${entry.lname}`;
  //   }

  //   return relatedInterestData;
  // }


  // extractTableData(directors: Director[]) {
  //   const formattedData = directors.flatMap(director => {
  //     // Extract the relevant data from each director
  //     const directorData = {
  //       'Full Name': `${director.fname} ${director.lname}`,
  //       'Company': director.com_related,
  //       'Position': director.fname
  //     };

  //     // Extract and format related interests
  //     const relatedInterestData = director.related_interest.map(entry => {
  //       return this.formatRelatedInterest(entry);
  //     });

  //     // Combine director data with related interest data
  //     return [directorData, ...relatedInterestData];
  //   });

  //   return formattedData;
  // }

  // formatRelatedInterest(entry: any) {
  //   const relationshipLabels = [
  //     "Mother's Name",
  //     "Father's Name",
  //     "Spouse",
  //     "Children",
  //     "Mother in Law",
  //     "Father in Law"
  //   ];

  //   const relationship = entry.relation;
  //   const relatedInterestData = {
  //     'Full Name': `${entry.fname} ${entry.lname}`,
  //     'Company': entry.cis_number, // Use the appropriate field for company data
  //     'Position': entry.fname,      // Use the appropriate field for position data
  //   };

  //   if (relationship >= 1 && relationship <= 6) {
  //     relatedInterestData[relationshipLabels[relationship - 1]] = `${entry.fname} ${entry.lname}`;
  //   }

  //   return relatedInterestData;
  // }



  // extractTableData(comRelated: any) {
  //   // Check if related_interest is defined
  //   // if (comRelated.related_interest) {
  //   //   const relatedInterestData = comRelated.related_interest;
  //   console.log(comRelated)
  //   if (comRelated.related_interest && comRelated.related_interest.length > 0) {
  //     const relatedInterestData = comRelated.related_interest;
  //     console.log(relatedInterestData);
  
  //     // For each entry in related_interest, you will need to format it correctly
  //     const formattedData = relatedInterestData.map(entry => {
  //       const relationship = entry.relation;
  //       console.log(relationship);
  //       const relationshipLabels = [
  //         "MothersName",
  //         "FathersName",
  //         "Spouse",
  //         "Children",
  //         "MotherinLaw",
  //         "FatherinLaw"
  //       ];
  
  //       const tableRow: any = {
  //         'FullName': entry.fname + ' ' + entry.lname,
  //         'Company': comRelated.com_related,
  //         'Position': comRelated.fname
  //       };
  
  //       if (relationship >= 1 && relationship <= 6) {
  //         tableRow[relationshipLabels[relationship - 1]] = entry.fname + ' ' + entry.lname;
  //       }
  
  //       return tableRow;
  //     });
  
  //     return formattedData;
  //   } else {
  //     return {
  //             'FullName': comRelated.fname + ' ' + comRelated.lname,
  //             'Company': comRelated.com_related,
  //             'Position': comRelated.fname,
  //             // Set other related columns to placeholders or default values
  //             'MothersName': 'N/A',
  //             'FathersName': 'N/A',
  //             'Spouse': 'N/A',
  //             'Children': 'N/A',
  //             'MotherinLaw': 'N/A',
  //             'FatherinLaw': 'N/A',
  //            }
  //   }
  // }
  


  

  // Functions
  setButtonId(id: number) {
    this.buttonId = id;
  }

  onDSubmit() {
 
    if (this.drctrForm.valid) {
      const directData = this.drctrForm.value;
  
      // Call the JavaScript function with form data
      createDirectors(directData); // Pass the entire formData object
    }
  }

  onRISubmit() {
 
    if (this.riForm.valid) {
      const riData = this.riForm.value;
  
      // Call the JavaScript function with form data
      createRelatedInterest(riData, this.buttonId); // Pass the entire formData object
    }
  }

  // Start of Button Click
  onButtonClick() {
    console.log('Show Modal Form');
    
  }

  // addDirectors() {
  //   // createDirectors()
  // }

  // addRelatedInterest() {
  //   // createRelatedInterest()
  // }

  delDosri() {
    // deleteDosri()
  }

  delDirector() {
    // deleteDirector()
  }

  delRelationship() {
    // deleteRelationship()
  }

}

