import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedservicesService {
  private directorIdToDisplay: number = 0;
  private companytoDisplay: string = '';
  private comCisNumber: number = 0;
  
  
  // For Orgs Data
  

  setDirectorId(id: number) {
    this.directorIdToDisplay = id;
  }

  setCompName(name: string):  void {
    this.companytoDisplay = name;
  }

  setCompanyCis(cis: number) {
    this.comCisNumber = cis;
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


  constructor() { }
}
