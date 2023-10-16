import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getDirectors } from '../functions-files/getFunctions'; // Import your JavaScript functions


@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  getDirectors(): Observable<any> {
    return new Observable((observer) => {
      getDirectors((dirData) => {
        observer.next(dirData);
        observer.complete();
      });
    });
  }
}
