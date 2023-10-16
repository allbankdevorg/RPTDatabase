import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataIntegrationService {
  constructor(private http: HttpClient) {}

  // Fetch company data from your API
  // getCompanyData(): Observable<any> {
  //   return this.http.get('your-api-url-for-companies');
  // }

  // Fetch director data from your API
  getDirectors(): Observable<any> {
    return this.http.get('your-api-url-for-directors');
  }
}
