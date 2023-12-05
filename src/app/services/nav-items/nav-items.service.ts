// nav-items.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Replace with the correct path


export interface INavItem {
  name: string;
  url: string;
  children?: INavItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavItemsService {
  private apiUrl = 'http://10.232.236.15:8092/api/dataTables';

  constructor(private http: HttpClient) {}
  
 

  getData(): Observable<INavItem[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      cmd: 111,
    };

    return this.http.post<INavItem[]>(this.apiUrl, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return new Observable<never>();
  }
}
