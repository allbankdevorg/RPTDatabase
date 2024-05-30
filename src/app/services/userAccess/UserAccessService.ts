import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class UserAccessService {
  private apiUrl = 'http://10.232.236.15:8092/api/dataTables';

  constructor(private http: HttpClient) {}

  getUserAccess(userId: string): Observable<any> {
    const payload = {
      cmd: 903,
      userid: userId
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
        // tap(response => console.log('API Response:', response))
      );
  }
}
