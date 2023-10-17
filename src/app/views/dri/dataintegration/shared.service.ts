import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private directorIdToDisplay: number = 0;
  private companytoDisplay: string = '';

  setDirectorId(id: number) {
    this.directorIdToDisplay = id;
  }

  setCompName(name: string) {
    this.companytoDisplay = name;
  }

  getDirectorId(): number {
    return this.directorIdToDisplay;
  }

  getCompName(): string {
    return this.companytoDisplay;
  }
}
