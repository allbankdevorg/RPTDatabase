import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface Loan {
  loan_no: number,
  cis_no: number,
  name: string,
  principal: number,
  principal_bal: number,
  loan_security: string,
  holdoutdata: number,
  date_granted: any,
  netBal: number
}

@Injectable({
  providedIn: 'root'
})
export class SimulatedDataService {
  private temporaryLoans: Loan[] = [];
  private simulationPerformed: boolean = false;

  constructor(private router: Router) {
    // Subscribe to router events to reset the state on navigation start
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.resetSimulationPerformed();
    });
  }

  setSimulationPerformed() {
    this.simulationPerformed = true;
  }

  isSimulationPerformed(): boolean {
    return this.simulationPerformed;
  }

  resetSimulationPerformed() {
    this.simulationPerformed = false;
    this.clearTemporaryLoans();
  }

  addTemporaryLoan(loan: Loan) {
    this.temporaryLoans.push(loan);
    console.log(this.temporaryLoans);
  }

  removeTemporaryLoan(index: number) {
    this.temporaryLoans.splice(index, 1);
  }

  clearTemporaryLoans(): void {
    this.temporaryLoans = [];
  }

  getTemporaryLoans(): Loan[] {
    return this.temporaryLoans;
  }
}
