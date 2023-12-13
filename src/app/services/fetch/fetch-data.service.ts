/**
 * 100 - getCompany                      => fetch Companies
 * 101 - getDirectors                    => fetch Directors
 * 103 - getOfficers                     => fetch Officers
 * 104 - getOfficersRI                   => fetch Officers Related Interest
 * 105 - getAffiliatesCompany            => fetch Affiliates Company
 * 106 - getAffiliatesDirectors          => fetch Affiliates Directors
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
import { Observable } from 'rxjs';


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
  getData(cmd: number, callback: (data: any) => void): void {
    this.makeRequest(cmd).subscribe(
      response => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          const data = response.result[0].Data;
          if (callback) {
            callback(data);
          }
        } else {
          console.log(`No Data for cmd ${cmd}`);
          if (callback) {
            callback(null);
          }
        }
      },
      error => {
        console.error(`Error fetching data for cmd ${cmd}:`, error);
        if (callback) {
          callback(null);
        }
      }
    );
  }


  // Public methods to fetch specific types of data using predefined commands

  // 100
  getCompany(callback: (compData: any) => void): void {
    this.getData(100, callback);      
  }

  // 101
  getDirectors(callback: (dirData: any) => void): void {
    this.getData(101, callback);
  }

  // 103
  getOfficers(callback: (officers: any) => void): void {
    this.getData(103, callback);
  }

  // 104
  getOfficersRI(callback: (officersRI: any) => void): void {
    this.getData(104, callback);
  }

  // 105
  getAffiliatesCompany(callback: (affilComp: any) => void): void {
    this.getData(105, callback);
  }

  // 106
  getAffiliatesDirectors(callback: (affilDirData: any) => void): void {
    this.getData(106, callback);
  }

  // 107
  getAffiliatesOfficers(callback: (affilOffData: any) => void): void {
    this.getData(107, callback);
  }

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