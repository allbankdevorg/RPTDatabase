import { Component, NgZone, ViewChild, ViewChildren, QueryList, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthSessionService } from 'src/app/services/authentication/auth-session.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';



// Functions imports
import {Loginuser} from '../../../functions-files/add/postAPI';

import { v4 as uuidv4 } from 'uuid';

// import {AddServicesService} from '../../../services/add/add-services.service';

import { SESSION_STORAGE, SessionStorageService } from 'ngx-webstorage';
import { SessionTimeoutService } from 'src/app/services/useridle/session-timeout.service';

// Audit Trail
import { AuditTrailService } from '../../../services/auditTrail/audit-trail.service';
import {AuditTrail} from '../../../model/audit-trail.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;

  localStorageAvailable = false;

  loginForm!: FormGroup;
  otpForm!: FormGroup;
  otp: any = '';
  showOtpComponent = true;
  timer: any;
  canResend = false;

  username = '';
  password = '';

  uD: any = [];
  sID: any = [];
  uA: any = [];
  uT: any = [];
  // otp = '';


  @ViewChild('otpModal') otpModal!: ElementRef;
  @ViewChild('otpInput') otpInput: ElementRef | undefined;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    inputStyles: {
      'width': '13%',
      'height': '50px'

    }
  };


  constructor(public router: Router, 
    public fb: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    public authService: AuthSessionService,
    public zone: NgZone,
    private storageService: SessionStorageService,
    // private addAPI: AddServicesService,
    private idle: SessionTimeoutService,
    private auditTrailService: AuditTrailService ) {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        this.localStorageAvailable = true; 
      } catch(e) { }
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // this.otpForm = this.fb.group({
    //   otp: [''],
    //   // Add more form controls as needed
    // });

    // this.otpForm.valueChanges.subscribe(() => {
    //   this.updateOtpValue();
    // });
  }

  
  onOtpChange(otp) {
    this.otp = otp;
    // console.log(this.otp)
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  
 

  startResendTimer() {
    const resendLink = document.getElementById('resend-link') as HTMLElement;
    if (resendLink) {
      this.canResend = false;
      resendLink.style.pointerEvents = 'none';
      let seconds = 60;
      this.timer = setInterval(() => {
        resendLink.textContent = `Resend OTP in ${seconds} seconds`;
        seconds--;
        if (seconds < 0) {
          clearInterval(this.timer);
          resendLink.textContent = 'Resend OTP';
          resendLink.style.pointerEvents = 'auto';
          this.canResend = true;
        }
      }, 1000);
    }
  }
  
// login(): void {
//   // Simulate login with username and password
//   if (this.loginForm.valid) {
//     const username = this.loginForm.get('username')?.value;
//     const password = this.loginForm.get('password')?.value;

//     const sessionId = uuidv4()

//     Loginuser(username, password, sessionId)
//     .then((response) => {
//       this.uD = response.result[0].user_details;
//       this.sID = sessionId;
//       this.uA = response.result[0].user_access
        
//         this.authService.setAuthToken('yourAuthToken'); // Replace with an actual token
  
//            console.log(response.result[0]);

//             const modal = this.otpModal.nativeElement;
//                 // console.log(modal);

//         if (response.result[0].message == 'success') {
//           const generatedOtp = this.authService.generateAndSaveOtp();
//           console.log(`Simulated OTP: ${generatedOtp}`);

//           if (modal) {
//             this.renderer.addClass(modal, 'show');
//             this.renderer.setStyle(modal, 'display', 'block');
//           }
//         } else {
//           Swal.fire({
//             icon: 'error',
//             title: 'Login Failed',
//             // text: 'Invalid username or password',
//           });
//         }
//     })
//     .catch((error) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Login Failed',
//         text: 'Invalid username or password',
//       });
//     });
//   }
// }

async login() {
  // Simulate login with username and password
  if (this.loginForm.valid) {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    const sessionId = uuidv4();

    try {
      const response = await Loginuser(username, password, sessionId);
      this.uD = response.result[0].user_details;
      this.sID = sessionId;
      this.uA = response.result[0].user_access;

      this.authService.setAuthToken('yourAuthToken'); // Replace with an actual token

      console.log(response.result[0]);

      const modal = this.otpModal.nativeElement;

      if (response.result[0].message === 'success') {
        const generatedOtp = this.authService.generateAndSaveOtp();
        console.log(`Simulated OTP: ${generatedOtp}`);

        if (modal) {
          this.renderer.addClass(modal, 'show');
          this.renderer.setStyle(modal, 'display', 'block');
        }
        // Log successful login
        this.logAction('login', 'Login success', true, 'Login');
      } else {
        // Log unsuccessful login
        this.logAction('login', 'Invalid username or password', false, 'Login');

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          // text: 'Invalid username or password',
        });
      }
    } catch (error: any) {
      // Log unsuccessful login with error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logAction('login', 'Invalid username or password', false, 'Login', errorMessage);
    
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password',
      });
    }
  }
}



async verifyOtp() {
  if (this.otp !== '') {
    // Verify OTP 
    const isVerified = await this.authService.verifyOtp(this.otp);

    if (isVerified) {
      // Log successful OTP verification
      this.logAction('otpVerification', 'Entered valid OTP', true, 'Login');

      // Continue with the rest of your logic
      sessionStorage.setItem('user', JSON.stringify(this.uD));
      sessionStorage.setItem('sessionID', JSON.stringify(this.sID));
      sessionStorage.setItem('userAcces', JSON.stringify(this.uA));

      // Show loading modal 
      Swal.fire({
        title: 'Verifying...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading() 
        }
      });

      // Navigate dashboard
      await this.router.navigate(['/dashboard']);

      // Hide loading modal  
      Swal.close();
    } else {
      // Log unsuccessful OTP verification
      this.logAction('otpVerification', 'Entered invalid OTP', false, 'Login');

      // Invalid OTP, show error 
      Swal.fire({        
        icon: 'error',
        title: 'Invalid OTP'
      });
    }
  } else {
    // Log OTP verification with empty OTP
    this.logAction('otpVerification', 'OTP is Empty', false, 'Login');

    Swal.fire({
      icon: 'error',
      title: 'OTP is Empty!',
      text: 'OTP is required',
    });
  }
}



  resendOTP() {
    this.authService.generateAndSaveOtp 
      // Implement OTP resend logic here
      alert('OTP Resent');
      // Simulate OTP generation and saving
      const generatedOtp = this.authService.generateAndSaveOtp();
      console.log(generatedOtp);
  
      this.startResendTimer();
    
  }

  onSubmit(){

  }

  Proceed(){

  }


// Start of Functions for Audit Trail
logAction(actionType: string, details: string, success: boolean, page: string, errorMessage?: string) {
  const auditTrailEntry = this.createAuditTrailEntry(actionType, details, success, page, errorMessage);
  this.logAuditTrail(auditTrailEntry);
}



private createAuditTrailEntry(actionType: string, details: string, success: boolean, page: string, errorMessage?: string): AuditTrail {
  return {
    userId: 'current_user_id',
    userName: 'Current_user',
    timestamp: new Date(),
    actionType,
    details,
    success,
    page, // Include the page information
    errorMessage: errorMessage || '', // Optional: Include error message if available
  };
}


private logAuditTrail(auditTrailEntry: AuditTrail) {
  this.auditTrailService.logAuditTrail(auditTrailEntry).subscribe(() => {
    console.log('Audit trail entry logged successfully.');
  });
  // console.log('Audit trail entry logged successfully.');
}


  
}