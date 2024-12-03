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
 * 901 - getAuditLogs                    => fetch Audit Logs Data
 * 112 - getStckHolders                  => fetch Stockholders
 * 902 - getUserList                     => fetch Users List
 * 113 - getPNData                       => fetch PN Data
 * 114 - getSBL                          => fetch PN Data
 * 117 - getUnimpairedCapital            => fetch the Unimpaired Capital and Date as Of
 * 119 - getBonds                        => fetch the Bonds and Investments
 * 120 - getLease                        => fetch the Lease and Contracts
 * 904 - getAuditTrail                   => fetch the Audit Trail Logs
 * 905 - getORPT                         => fetch the Other RP Transactions
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

  userID = localStorage.getItem('userID')?.replaceAll("\"", "");
  
  // Constructor to inject the HttpClient dependency
  constructor(private httpClient: HttpClient) { }

  // Private method to make HTTP requests based on a command
  private makeRequest(cmd: number): Observable<any> {

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

  getData(cmd: number, callback: (data: any) => void): Subscription {
    return this.makeRequest(cmd).subscribe({
      next: (response) => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          const data = response.result[0].Data;
          if (callback) {
            callback(data);
          }
        } else {
          if (callback) {
            callback([]);
          }
        }
      },
      error: (error) => {
        if (callback) {
          callback([]);
        }
      },
    });
  }


  private makeLogRequest(cmd: number, userid: any): Observable<any> {

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


  getDataLogs(cmd: number, userid:any, callback: (data: any) => void): Subscription {
    return this.makeLogRequest(cmd, userid).subscribe({
      next: (response) => {
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          const data = response.result[0].Data;
          if (callback) {
            callback(data);
          }
        } else {
          if (callback) {
            callback([]);
          }
        }
      },
      error: (error) => {
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
          return [];
        }
      }),
      catchError(error => {
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
          return [];
        }
      }),
      catchError(error => {
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
          return [];
        }
      }),
      catchError(error => {
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
          return [];
        }
      }),
      catchError(error => {
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
          return [];
        }
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  getAuditLogs(callback: (data: any) => void): void {
    const settings = {
      url: 'http://10.232.236.15:8092/api/dataTables',
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      data: {
        cmd: 904,
        // Uncomment and set userid if needed
        // userid: this.userID,
      },
    };

    this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
      next: (response: any) => {
        // Check if the response contains the expected structure
        const auditLogs = response?.result?.[0]?.audit_logs || null;

        // Call the callback with auditLogs or null
        callback(auditLogs);
      },
      error: (error) => {
        console.error('Error fetching audit logs:', error);
        // Call the callback with null in case of an error
        callback(null);
      },
    });
  }


  getORPT(callback: (data: any) => void): void {
    const settings = {
      url: 'http://10.232.236.15:8092/api/dataTables',
      method: 'POST',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      data: {
        cmd: 905,
        // Uncomment and set userid if needed
        // userid: this.userID,
      },
    };

    this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
      next: (response: any) => {
        // Check if the response contains the expected structure
        const auditLogs = response?.result?.[0]?.audit_logs || null;

        // Call the callback with auditLogs or null
        callback(auditLogs);
      },
      error: (error) => {
        console.error('Error fetching audit logs:', error);
        // Call the callback with null in case of an error
        callback(null);
      },
    });
  }



//   getAuditLogs(callback: (data: any) => void): void {
//     const userid = this.userID
//   const settings = {
//     url: 'http://10.232.236.15:8092/api/dataTables',
//     method: 'POST',
//     timeout: 0,
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//     }),
//     data: {
//       cmd: 904,
//       // userid: userid,
//     },
//   };

//   this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
//     next: (response: any) => {

//       if (response && response.result && response.result.length > 0 && response.result[0].audit_logs) {
//         const auditLogs = response.result[0].audit_logs;
      
//         if (callback) {
//           callback(auditLogs);
//         }
//       } else {
      
//         if (callback) {
//           callback(null);
//         }
//       }
//     },
//     error: (error) => {

//       if (callback) {
//         callback(null);
//       }
//     },
//   });
// }


getStckHolders(callback: (data: any) => void): void {
const settings = {
  url: 'http://10.232.236.15:8092/api/dataTables',
  method: 'POST',
  timeout: 0,
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  data: {
    cmd: 112,
    // userid: userid,
  },
};

this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
  next: (response: any) => {

    if (response && response.result && response.result.length > 0 && response.result[0].Data) {
      const stckHldrs = response.result[0].Data;
    
      if (callback) {
        callback(stckHldrs);
      }
    } else {
    
      if (callback) {
        callback(null);
      }
    }
  },
  error: (error) => {

    if (callback) {
      callback(null);
    }
  },
});
}



getUserList(callback: (data: any) => void): void {
  const settings = {
    url: 'http://10.232.236.15:8092/api/dataTables',
    method: 'POST',
    timeout: 0,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    data: {
      cmd: 902,
      // userid: userid,
    },
  };
  
  this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
    next: (response: any) => {
  
      if (response && response.result && response.result.length > 0 && response.result[0].user_list) {
        const usersList = response.result[0].user_list;
        
        if (callback) {
          callback(usersList);
        }
      } else {
      
        if (callback) {
          callback(null);
        }
      }
    },
    error: (error) => {
  
      if (callback) {
        callback(null);
      }
    },
  });
  }



  
  getPNData(date: any, callback: (data: any) => void): void {
    
    const settings = {
      url: 'http://10.232.236.15:8092/api/dataTables',
      method: 'POST',
      timeout: 0,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      data: {
        cmd: 113,
        date: date, // Pass the date string directly
      },
    };
    
    // Rest of your function code here
  
      
      this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
        next: (response: any) => {
      
          if (response && response.result && response.result.length > 0 && response.result[0].Data) {
            const PNData = response.result[0].Data;
            
            if (callback) {
              callback(PNData);
            }
          } else {
          
            if (callback) {
              callback(null);
            }
          }
        },
        error: (error) => {
      
          if (callback) {
            callback(null);
          }
        },
      });
      }


  
    getSBL(callback: (data: any) => void): void {
      const settings = {
        url: 'http://10.232.236.15:8092/api/dataTables',
        method: 'POST',
        timeout: 0,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        data: {
          cmd: 114
          // userid: userid,
        },
      };
      
      this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
        next: (response: any) => {
      
          if (response && response.result && response.result.length > 0 && response.result) {
            const sblData = response.result;
            
            if (callback) {
              callback(sblData);
            }
          } else {
          
            if (callback) {
              callback(null);
            }
          }
        },
        error: (error) => {
      
          if (callback) {
            callback(null);
          }
        },
      });
      }
  
      
    getUnimpairedCapital(callback: (data: any) => void): void {
        const settings = {
          url: 'http://10.232.236.15:8092/api/dataTables',
          method: 'POST',
          timeout: 0,
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          data: {
            cmd: 117,
          },
        };
        
        this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
          next: (response: any) => {
        
            if (response && response.result && response.result.length > 0 && response.result[0].Data) {
              const unimpairedCap = response.result[0].Data;
              
              if (callback) {
                callback(unimpairedCap);

              }
            } else {
            
              if (callback) {
                callback(null);
              }
            }
          },
          error: (error) => {
        
            if (callback) {
              callback(null);
            }
          },
        });
        }

  

  getBonds(callback: (data: any) => void): void {
    const settings = {
      url: 'http://10.232.236.15:8092/api/dataTables',
      method: 'POST',
      timeout: 0,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      data: {
        cmd: 119,
        // userid: userid,
      },
    };
    
    this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
      next: (response: any) => {
    
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          const bondsInvestment = response.result[0].Data;
        
          if (callback) {
            callback(bondsInvestment);
          }
        } else {
        
          if (callback) {
            callback(null);
          }
        }
      },
      error: (error) => {
    
        if (callback) {
          callback(null);
        }
      },
    });
    }


        
  getLease(callback: (data: any) => void): void {
    const settings = {
      url: 'http://10.232.236.15:8092/api/dataTables',
      method: 'POST',
      timeout: 0,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      data: {
        cmd: 120,
        // userid: userid,
      },
    };
    
    this.httpClient.post(settings.url, settings.data, { headers: settings.headers }).subscribe({
      next: (response: any) => {
    
        if (response && response.result && response.result.length > 0 && response.result[0].Data) {
          const LeaseData = response.result[0].Data;
        
          if (callback) {
            callback(LeaseData);
          }
        } else {
        
          if (callback) {
            callback(null);
          }
        }
      },
      error: (error) => {
    
        if (callback) {
          callback(null);
        }
      },
    });
    }
  // getAuditLogs(): Observable<any> {
  //   const userid = this.userID
  //   return this.makeLogRequest(901, "Admin").pipe(
  //     map(response => {
  //       if (response && response.result && response.result.length > 0 && response.result[0].Data) {
  //         return response.result[0].Data;
  //       } else {
  //         return [];
  //       }
  //     }),
  //     catchError(error => {
  //       // console.error(`Error fetching data for cmd 100:`, error);
  //       return of([]);
  //     })
  //   );
  // }

  


  // getOfficersRI(): Observable<any> {
  //   return this.makeRequest(104).pipe(
  //     map(response => {
  //       if (response && response.result && response.result.length > 0 && response.result[0].Data) {
  //         return response.result[0].Data;
  //       } else {
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

  // 110
  getPavi(callback: (PaviComp: any) => void): void {
    this.getData(118, callback);
  }

 

  
}
