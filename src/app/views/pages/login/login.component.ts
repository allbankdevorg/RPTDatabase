import { Component, NgZone, ViewChild, ViewChildren, QueryList, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthSessionService } from 'src/app/services/authentication/auth-session.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';


// Functions imports
import {Loginuser, sendOTP, checkOTP} from '../../../functions-files/add/postAPI';
import { HttpClient } from '@angular/common/http';

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

  user_details: any;
  userName: any;

  username = '';
  password = '';
  mobileNum: any;
  otpGene: any;



  uD: any = [];
  sID: any = [];
  uA: any = [];
  uT: any = [];
  urole: any;


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
    private IdleLib: Idle,
    private auditTrailService: AuditTrailService,
    private http: HttpClient ) {
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
  }

  
  onOtpChange(otp) {
    this.otp = otp;
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
  


async login() {
  // Simulate login with username and password
  if (this.loginForm.valid) {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    const userID = this.uD;
    const sessionId = uuidv4();
    const otpGen = this.authService.generateAndSaveOtp()

    // console.log(otpGen);
    // this.otpGene = otpGen;

    


    try {
      const response = await Loginuser(username, password, sessionId, otpGen, userID);
      this.uD = response.result[0].user_details[0].id;
      this.userName = response.result[0].user_details[0].username;
      this.sID = sessionId;
      this.uA = response.result[0].user_access;
      this.urole = response.result[0].user_details[0].role;
      this.userName = username;
      this.password = password;

      // this.authService.setAuthToken('yourAuthToken'); // Replace with an actual token

      const modal = this.otpModal.nativeElement;

      if (response.result[0].message === 'success') {
        const mobile = response.result[0].user_details[0].mobile_no;
        this.mobileNum = mobile;
        this.userName = response.result[0].user_details[0].username;
        const userID = this.uD;
        const session = this.sID;

        if (modal) {
          
          this.renderer.addClass(modal, 'show');
          this.renderer.setStyle(modal, 'display', 'block');  

          try {
            const sendotp = await sendOTP(mobile, otpGen, userID, session);
          } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          }          
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to the server. Please try again later';
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage
        });
    }
  }
}


async verifyOtp() {
  if (this.otp !== '') {
    const enteredOTP = this.otp;
    const user = this.userName;
    const userID = this.uD;
    const session = this.sID;
    const role = this.urole;
    // const loadingModal = Swal.fire({
    //   title: 'Verifying...',
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    try {
      // Perform OTP verification asynchronously
      const verificationPromise = await checkOTP(user, enteredOTP, userID, session);
      const sessionExpireTime = Date.now() + 300000;

      if (verificationPromise.result[0].message === 'success') {
        // OTP verification completed successfully

         // Navigate to the dashboard

        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(this.uD));
        localStorage.setItem('sessionID', JSON.stringify(this.sID));
        localStorage.setItem('userAcces', JSON.stringify(this.uA));
        localStorage.setItem('userID', JSON.stringify(this.userName));
        localStorage.setItem('role', JSON.stringify(this.urole));


        // Initialize ng2-idle

        // Start watching for user activity
        this.IdleLib.watch();

        await this.router.navigate(['/dashboard']);
       

        // Close the loading modal
        Swal.close();
      } else if (verificationPromise.result[0].status === 'failed') {
        // Log unsuccessful OTP verification
        this.logAction('otpVerification', 'Entered invalid OTP', false, 'Login');

        console.log("Invalid Otp")
        // Invalid OTP, show error 
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid OTP verification. Please try again.',
          });
      }
    } catch (error) {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: 'Invalid OTP verification. Please try again.',
      // });
      // Handle OTP verification errors
      this.logAction('otpVerification', 'Error during OTP verification', false, 'Login');
      console.error('Error during OTP verification:', error);
      
    } finally {
      // Close the loading modal
      Swal.close();
    }
  } else {
    // Handle the case where the OTP is empty
    this.logAction('otpVerification', 'OTP is Empty', false, 'Login');
    Swal.fire({
      icon: 'error',
      title: 'OTP is Empty!',
      text: 'OTP is required',
    });
  }
}



  async resendOTP() {
     
    const userID = this.uD;
    const session = this.sID;
    const mobile = this.mobileNum;
    const otpGen = this.authService.generateAndSaveOtp();
    this.startResendTimer();
      // Implement OTP resend logic here
      // alert('OTP Resent');

      try {

        const username = this.userName;
        const password = this.password;
        const sessionId = this.sID
        const response = await Loginuser(username, password, sessionId, otpGen, userID);
        this.uD = response.result[0].user_details[0].id;
        this.userName = response.result[0].user_details[0].username;
        this.sID = sessionId;
        this.uA = response.result[0].user_access;
  
        this.authService.setAuthToken('yourAuthToken'); // Replace with an actual token
  
        const modal = this.otpModal.nativeElement;
  
        if (response.result[0].message === 'success') {
          const mobile = response.result[0].user_details[0].mobile_no;
          this.mobileNum = mobile;
          this.userName = response.result[0].user_details[0].username;
          const userID = this.uD;
          const session = this.sID;
  
          if (modal) {
            
            this.renderer.addClass(modal, 'show');
            this.renderer.setStyle(modal, 'display', 'block');  
  
            try {
              const sendotp = await sendOTP(mobile, otpGen, userID, session);
            } catch (error: any) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            }          
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
    
  });
  
}


  
}