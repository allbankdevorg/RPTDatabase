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

  logAuditTrail(auditTrailEntry: AuditTrail): Observable<AuditTrail> {
    // Log specific messages regardless of the success or error status

    // Simulate the asynchronous behavior of an HTTP request
    return of(auditTrailEntry).pipe(
      catchError((error: any): Observable<AuditTrail> => {
        return of(null as any); // Return an Observable with null as an AuditTrail
      })
    );
  }

  getAuditTrail(): Observable<AuditTrail[]> {
    return this.http.get<AuditTrail[]>(this.apiUrl);
  }



  



}

  

  