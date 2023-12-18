import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private directorIdToDisplay: number = 0;
  private directorCISToDisplay: number = 0;
  private companytoDisplay: string = '';
  private comCisNumber: number = 0;

  setDirectorId(id: number) {
    this.directorIdToDisplay = id;
  }

  setCompName(name: string):  void {
    this.companytoDisplay = name;
  }

  setCompanyCis(cis: number) {
    this.comCisNumber = cis;
  }

  setDirectorCIS(id: number) {
    this.directorCISToDisplay = id;
  }

  getDirectorId(): number {
    return this.directorIdToDisplay;
  }

  getCompName(): string {
    return this.companytoDisplay;
  }

  getCompCIS(): number {
    return this.comCisNumber;
  }

  getDirectorCIS(): number {
    return this.directorCISToDisplay;
  }
}
