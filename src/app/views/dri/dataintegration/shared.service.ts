import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private directorIdToDisplay: number = 0;

  setDirectorId(id: number) {
    this.directorIdToDisplay = id;
  }

  getDirectorId(): number {
    return this.directorIdToDisplay;
  }
}
