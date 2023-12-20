/**
 * 100 - getCompany                      => fetch Companies
 * 101 - getDirectors                    => fetch Directors
 * 103 - getOfficers                     => fetch Officers
 * 104 - getOfficersRI                   => fetch Officers Related Interest
 * 105 - getAffiliatesCompany            => fetch Affiliates Company
 * 106 - getAffiliatesDirectors          => fetch Affiliates Directors and Related Interest
 * 107 - getAffiliatesOfficers           => fetch Affiliates Officers
 * 108 - getAffiliatesCompanyOfficers    => fetch Affiliates Company Officer
 * 109 - getManagingCompany              => fetch Managing Company
 * 110 - getOtherCompany                 => fetch Other Affiliated Company
 * 111 - getNavi                         => fetch Navigation Menus
 * 
 */





// Import necessary Angular modules
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


// Injectable decorator to allow dependency injection
@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

   // Define the API URL as a private member variable
  private apiUrl = 'http://10.232.236.15:8092/api/dataTables';

  // Constructor to inject the HttpClient dependency
  constructor(private httpClient: HttpClient) { }

  // Private method to make HTTP requests based on a command
  private makeRequest(cmd: number): Observable<any> {
    console.log(cmd);

    // Set headers for the HTTP request
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Prepare request data
    const requestData = {
      cmd: cmd
    };

    // Make a POST request to the specified API URL
    return this.httpClient.post<any>(this.apiUrl, requestData, { headers });
  }

  // Public method to fetch data based on a command and invoke a callback
  // getData(cmd: number, callback: (data: any) => void): void {
  //   this.makeRequest(cmd).subscribe(
  //     response => {
  //       if (response && response.result && response.result.length > 0 && response.result[0].Data) {
  //         const data = response.result[0].Data;
  //         if (callback) {
  //           callback(data);
  //         }
  //       } else {
  //         console.log(`No Data for cmd ${cmd}`);
  //         if (callback) {
  //           callback([]);
  //         }
  //       }
  //     },
  //     error => {
  //       console.error(`Error fetching data for cmd ${cmd}:`, error);
  //       if (callback) {
  //         callback([]);
  //       }
  //     }
  //   );
  // }


  getData(cmd: number, callback: (data: any) => void): Subscription {
    return this.makeRequest(cmd).subscribe({
      next: (response) => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          const data = response.result[0].Data;
          if (callback) {
            callback(data);
          }
        } else {
          console.log(`No Data for cmd ${cmd}`);
          if (callback) {
            callback([]);
          }
        }
      },
      error: (error) => {
        console.error(`Error fetching data for cmd ${cmd}:`, error);
        if (callback) {
          callback([]);
        }
      },
    });
  }


  // Public methods to fetch specific types of data using predefined commands

  getCompany(): Observable<any> {
    return this.makeRequest(100).pipe(
      map(response => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          return response.result[0].Data;
        } else {
          console.log(`No Data for cmd 100`);
          return [];
        }
      }),
      catchError(error => {
        console.error(`Error fetching data for cmd 100:`, error);
        return of([]);
      })
    );
  }
  
  

  
  getDirectors(): Observable<any> {
    return this.makeRequest(101).pipe(
      map(response => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          return response.result[0].Data;
        } else {
          console.log(`No Data for cmd 101`);
          return [];
        }
      }),
      catchError(error => {
        console.error(`Error fetching data for cmd 101:`, error);
        return of([]);
      })
    );
  }

  
  getOfficers(): Observable<any> {
    return this.makeRequest(103).pipe(
      map(response => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          return response.result[0].Data;
        } else {
          console.log(`No Data for cmd 103`);
          return [];
        }
      }),
      catchError(error => {
        console.error(`Error fetching data for cmd 103:`, error);
        return of([]);
      })
    );
  }



  // 106
  getAffiliatesDirectors(): Observable<any> {
    return this.makeRequest(106).pipe(
      map(response => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          return response.result[0].Data;
        } else {
          console.log(`No Data for cmd 103`);
          return [];
        }
      }),
      catchError(error => {
        console.error(`Error fetching data for cmd 103:`, error);
        return of([]);
      })
    );
  }


  // 107
  getAffiliatesOfficers(): Observable<any> {
    return this.makeRequest(107).pipe(
      map(response => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          return response.result[0].Data;
        } else {
          console.log(`No Data for cmd 107`);
          return [];
        }
      }),
      catchError(error => {
        console.error(`Error fetching data for cmd 107:`, error);
        return of([]);
      })
    );
  }




  // getOfficersRI(): Observable<any> {
  //   return this.makeRequest(104).pipe(
  //     map(response => {
  //       if (response && response.result && response.result.length > 0 && response.result[0].Data) {
  //         return response.result[0].Data;
  //       } else {
  //         console.log(`No Data for cmd 104`);
  //         return [];
  //       }
  //     }),
  //     catchError(error => {
  //       console.error(`Error fetching data for cmd 104:`, error);
  //       return of(null);
  //     })
  //   );
  // }
 

  // 100
  // getCompany(callback: (CompData: any) => void): void {
  //   this.getData(100, callback);      
  // }

  // // 101
  // getDirectors(callback: (DData: any) => void): void {
  //   this.getData(101, callback);
  // }

  // 103
  // getOfficers(callback: (officers: any) => void): void {
  //   this.getData(103, callback);
  // }

  // 104
  getOfficersRI(callback: (officersRI: any) => void): void {
    this.getData(104, callback);
  }

  // 105
  getAffiliatesCompany(callback: (affilComp: any) => void): void {
    this.getData(105, callback);
  }

  // 106
  // getAffiliatesDirectors(callback: (affilDirData: any) => void): void {
  //   this.getData(106, callback);
  // }

  // 107
  // getAffiliatesOfficers(callback: (affilOffData: any) => void): void {
  //   this.getData(107, callback);
  // }

  // 108
  getAffiliatesCompanyOfficers(callback: (affilCompOff: any) => void): void {
    this.getData(108, callback);
  }

  // 109
  getManagingCompany(callback: (mngComp: any) => void): void {
    this.getData(109, callback);
  }

  // 110
  getOtherCompany(callback: (OtherComp: any) => void): void {
    this.getData(110, callback);
  }

  // 111
  getNavi(callback: (navItems: any) => void): void {
    this.getData(111, callback);
  }


  getLogs(callback: (auditLogs: any) => void): void {
    this.getData(112, callback);
  }

  
}
