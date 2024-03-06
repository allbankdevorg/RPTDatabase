import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RPTSimulationModalComponent } from '../../modal-dialog/rpt-simulation-modal/rpt-simulation-modal.component';


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

  private functionCallSource = new Subject<any>();
  functionCall$ = this.functionCallSource.asObservable();

  
  private dataSource = new Subject<any>();
  data$ = this.dataSource.asObservable();



  constructor(private router: Router, private _dialog: MatDialog) {
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


  openSimulation(onInitFn: () => void, calculateFn: (data: any) => void, dataSource: any, availBal: any) {
    
    const dialogRef = this._dialog.open(RPTSimulationModalComponent, {
      width: '50%',
      // Other MatDialog options can be specified here
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          onInitFn(); // Call the onInit function passed as a parameter
          calculateFn(dataSource); // Call the calculate function passed as a parameter
        }
      },
    });
  }


  triggerFunction(data?: any) {
    this.functionCallSource.next(data);
  }


  sendData(data: any) {
    this.dataSource.next(data);
  }
}
