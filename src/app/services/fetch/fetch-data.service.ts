import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {


  private apiUrl = 'http://10.232.236.15:8092/api/dataTables';

  constructor(private httpClient: HttpClient) { }

  private makeRequest(cmd: number): Observable<any> {
    console.log(cmd);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestData = {
      cmd: cmd
    };

    return this.httpClient.post<any>(this.apiUrl, requestData, { headers });
  }

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

  getCompany(callback: (compData: any) => void): void {
    this.getData(100, callback);
  }

  getDirectors(callback: (dirData: any) => void): void {
    this.getData(101, callback);
  }

  getOfficers(callback: (officers: any) => void): void {
    this.getData(103, callback);
  }

  getOfficersRI(callback: (officersRI: any) => void): void {
    this.getData(104, callback);
  }

  getAffiliatesCompany(callback: (affilComp: any) => void): void {
    this.getData(105, callback);
  }

  getAffiliatesDirectors(callback: (affilDirData: any) => void): void {
    this.getData(106, callback);
  }

  getAffiliatesOfficers(callback: (affilOffData: any) => void): void {
    this.getData(107, callback);
  }

  getAffiliatesCompanyOfficers(callback: (affilCompOff: any) => void): void {
    this.getData(108, callback);
  }

  getManagingCompany(callback: (mngComp: any) => void): void {
    this.getData(109, callback);
  }

  getOtherCompany(callback: (OtherComp: any) => void): void {
    this.getData(110, callback);
  }

  getNavi(callback: (navItems: any) => void): void {
    this.getData(111, callback);
  }

  
}
