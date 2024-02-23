import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';


//Import for API Function
import { FetchDataService } from 'src/app/services/fetch/fetch-data.service';
import { HoldOutValue } from '../../../functions-files/add/postAPI';
import { SimulatedDataService } from '../../../services/simulatedDataService/simulated-data-service.service';


@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {


  rptBal: any;      // => RPT Balance (Net of Hold-out)
  rptRatio: any;    // => RPT Ratio
  subtlOL: any;     // => SUB-TOTAL Original Loan
  subtlOB: any;     // => SUB-TOTAL Outstanding Balance
  ttlRPTOL: any;    // => TOTAL RPT Original Loan
  ttlRPTOB: any;    // => TOTAL RPT Outstanding Loan
  availBal: any;    // => Remaining Balance of Possible Loan Amount
  unimpairedCap: number = 0;   //Unimpaired Capital
  definedRptRatio: number = 50;     //Pre defined Percentage
  availRptRatio: any;
  approvedCapital: any;  // => the Loan approved Limit
  totalHoldOut: number = 0;
  selectedPN: any;
  UnimpairedDate: any;
  //Variable to hold the selected date
  selectedDate: Date | null = null;
  numberLoans: number = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private get: FetchDataService,
  ) {}

  data: any[] = [];
  options: any[] = [];
  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April'
  ];
  datasets = [
    [{
      label: 'My First dataset',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [65, 59, 84, 84, 51, 55, 40]
    }], [{
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-info'),
      pointHoverBorderColor: getStyle('--cui-info'),
      data: [1, 18, 9, 17, 34, 22, 11]
    }], [{
      label: 'My Third dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-warning'),
      pointHoverBorderColor: getStyle('--cui-warning'),
      data: [78, 81, 80, 45, 34, 12, 40],
      fill: true
    }], [{
      label: 'My Fourth dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
      barPercentage: 0.7
    }]
  ];
  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  ngOnInit(): void {
    this.setData();
    this.updateTableData();
    this.getUnimpairedCap();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();

  }

  setData() {
    for (let idx = 0; idx < 4; idx++) {
      this.data[idx] = {
        labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
        datasets: this.datasets[idx]
      };
    }
    this.setOptions();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }


  updateTableData(): void {
    let dateString: string;
    const currentDate = new Date();
    let date = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    
    if (this.selectedDate !== null) {
      date = this.selectedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } else {
      date = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }
     
    this.get.getPNData(date, (PNData) => {
      
      if (PNData) {
        const uniqueCisNumbers = [...new Set(PNData.map((entry) => entry.cis_no))];
        console.log(PNData);
        uniqueCisNumbers.forEach((cisNumber) => {
          HoldOutValue(cisNumber)
            .then((response) => {
              this.calculateactualData(PNData);
            })
            .catch((error) => {
              // Handle error
            });
        });
  
        // Push temporary loan data only once outside the forEach loop
        this.numberLoans = PNData.length;
        console.log(this.unimpairedCap);
        
         // Create a shallow copy of PNData
        
      }
    });
  }


  getUnimpairedCap(): void {
    this.get.getUnimpairedCapital((unimpairedCap) => {
        
        this.UnimpairedDate = unimpairedCap[0].date;
        this.unimpairedCap = unimpairedCap[0].impared_capital;

    })
  }


  calculateactualData(actualData: any[]): void {
    const sumPrincipal = actualData.reduce((acc, obj) => {
      acc.principal += parseFloat(obj.principal) || 0;
      acc.principal_bal += parseFloat(obj.principal_bal) || 0;
      acc.holdoutdata += parseFloat(obj.holdoutdata) || 0;
      return acc;
    }, { principal: 0, principal_bal: 0, holdoutdata: 0 });
    
    this.rptBal = sumPrincipal.principal_bal - sumPrincipal.holdoutdata;
  
    // Calculate rptRatio only if unimpairedCap is not zero
    if (this.unimpairedCap !== 0) {
      const percentage = `${((this.rptBal / this.unimpairedCap) * 100).toFixed(2)}%`;
      this.rptRatio = percentage;
      this.availRptRatio = `${(this.definedRptRatio - parseFloat(percentage.replace('%', ''))).toFixed(2)}%`;
    } else {
      this.rptRatio = 'N/A';
      this.availRptRatio = 'N/A';
    }
  
    this.ttlRPTOL = sumPrincipal.principal;
    this.ttlRPTOB = sumPrincipal.principal_bal;
    this.approvedCapital = this.unimpairedCap * 0.5;
    
    // Recalculate available balance only if approvedCapital is not zero
    if (this.approvedCapital !== 0) {
      this.availBal = this.approvedCapital - this.rptBal;
    } else {
      this.availBal = 0;
    }
  }
}



@Component({
  selector: 'app-chart-sample',
  template: '<c-chart type="line" [data]="data" [options]="options" width="300" #chart></c-chart>'
})
export class ChartSample implements AfterViewInit {

  constructor() {}

  @ViewChild('chart') chartComponent!: ChartjsComponent;

  colors = {
    label: 'My dataset',
    backgroundColor: 'rgba(77,189,116,.2)',
    borderColor: '#4dbd74',
    pointHoverBackgroundColor: '#fff'
  };

  labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  data = {
    labels: this.labels,
    datasets: [{
      data: [65, 59, 84, 84, 51, 55, 40],
      ...this.colors,
      fill: { value: 65 }
    }]
  };

  options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      const data = () => {
        return {
          ...this.data,
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            ...this.data.datasets[0],
            data: [42, 88, 42, 66, 77],
            fill: { value: 55 }
          }, { ...this.data.datasets[0], borderColor: '#ffbd47', data: [88, 42, 66, 77, 42] }]
        };
      };
      const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const newData = [42, 88, 42, 66, 77];
      let { datasets, labels } = { ...this.data };
      // @ts-ignore
      const before = this.chartComponent?.chart?.data.datasets.length;
      // @ts-ignore
      // this.data = data()
      this.data = {
        ...this.data,
        datasets: [{ ...this.data.datasets[0], data: newData }, {
          ...this.data.datasets[0],
          borderColor: '#ffbd47',
          data: [88, 42, 66, 77, 42]
        }],
        labels: newLabels
      };
      // @ts-ignore
      setTimeout(() => {
        const after = this.chartComponent?.chart?.data.datasets.length;
      });
    }, 5000);
  }
}
