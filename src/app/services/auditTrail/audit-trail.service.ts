// audit-trail.service.ts

// audit-trail.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuditTrail } from '../../model/audit-trail.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuditTrailService {
  private apiUrl = 'your_audit_trail_api_url';

  constructor(private http: HttpClient) {}

  // logAuditTrail(auditTrail: AuditTrail): Observable<AuditTrail> {
  //   return this.http.post<AuditTrail>(this.apiUrl, auditTrail);
  // }

  // logAuditTrail(auditTrailEntry: AuditTrail): Observable<AuditTrail> {
  //   // Simulate logging the result in the console
  //   console.log('Audit trail entry logged:', auditTrailEntry);

  //   // Return a mock Observable to simulate the API response
  //   return this.http.post<AuditTrail>(this.apiUrl, auditTrailEntry).pipe(
  //     map(response => {
  //       console.log('API response:', response);
  //       return response;
  //     }),
  //     catchError((error: any) => {
  //       console.error('Error logging audit trail:', error);
  //       return throwError('Failed to log audit trail');
  //     })
  //   );
  // }

  logAuditTrail(auditTrailEntry: AuditTrail): Observable<AuditTrail> {
    // Log specific messages regardless of the success or error status
    console.log('Audit trail entry logged:', auditTrailEntry);

    // Simulate the asynchronous behavior of an HTTP request
    return of(auditTrailEntry).pipe(
      catchError((error: any): Observable<AuditTrail> => {
        console.error('Error logging audit trail:', error);
        return of(null as any); // Return an Observable with null as an AuditTrail
      })
    );
  }

  getAuditTrail(): Observable<AuditTrail[]> {
    return this.http.get<AuditTrail[]>(this.apiUrl);
  }
}

  

  