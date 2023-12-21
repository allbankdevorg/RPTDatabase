import { Component, OnInit } from '@angular/core';


interface account {
  name: string;
  list: any[];
}

interface sblList {
  pn_No: string;
  br_name: string;
  L_type: string;
  collateral: string;
  amt_granted: string;
  date_booked: string;
  O_blnc: string;
  hold_out: string;
  net_holdout: number;
  payment_status: string;
}


@Component({
  selector: 'app-sbl-list',
  templateUrl: './sbl-list.component.html',
  styleUrls: ['./sbl-list.component.scss']
})
export class SBLListComponent implements OnInit{

  // Add a property for the search input
  public searchName: string = '';

  public users: account[] = [
    {
     name: 'Fine',
     list: [
      { pn_No: '2021-01-002331',
        br_name: 'Cmstar Management Inc.',
        L_type: 'Term Loan',
        collateral: 'CLEAN',
        amt_granted: '30,000,000.00',
        date_booked: '01/13/2021',
        O_blnc: '2,698,633.09',
        hold_out: '',
        net_holdout:  2698633.09,
        payment_status: 'current',
      },
      { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
     ]
    },
    {
      name: 'All Value',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    },
    {
      name: 'All Day',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    },
    {
      name: 'All Home',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    },
    {
      name: 'All Holdings',
      list: [ 
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
        { pn_No: '2021-01-002331',
          br_name: 'Cmstar Management Inc.',
          L_type: 'Term Loan',
          collateral: 'CLEAN',
          amt_granted: '30,000,000.00',
          date_booked: '01/13/2021',
          O_blnc: '2,698,633.09',
          hold_out: '',
          net_holdout:  2698633.09,
          payment_status: 'current',
        },
      ]
    }

  ]


  ngOnInit() {
    // Additional initialization logic if needed
  }

  // Function to scroll to the card with the specified name
  scrollToUser(name: string) {
    const element = document.getElementById(name);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center'});
    }
  }

}
