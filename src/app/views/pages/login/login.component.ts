import { Component, NgZone, ViewChild, ViewChildren, QueryList, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthSessionService } from 'src/app/services/authentication/auth-session.service';
import { Router } from '@angular/router';

// Functions imports
import {Loginuser} from '../../../functions-files/login';

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  otpForm!: FormGroup;
  otp: any = '';
  showOtpComponent = true;
  timer: any;
  canResend = false;

  username = '';
  password = '';

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
    public zone: NgZone) {
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
    console.log(this.otp)
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

  login(): void {
   
    // Simulate login with username and password

    if (this.loginForm.valid) {
    
      
      
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      const sessionId = uuidv4()
      
      Loginuser(username, password, sessionId)
      .then((response) => {
        // Handle the response
        this.UserLogin();
        console.log('Login successful!');
        sessionStorage.setItem('sessionID', JSON.stringify(sessionId));
        sessionStorage.setItem('userAcces', JSON.stringify(response.result[0]));
        console.log(response.result[0]);
        // this.UserLogin();
        // Perform login logic
        
      })
      .catch((error) => {
        console.log(error);
        console.error(error.result[0].message);
        
      });

    }
    
  }


  UserLogin(): void {
    const modal = this.otpModal.nativeElement;
    console.log(modal);
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
  
    this.authService.simulateLogin(username, password).subscribe((success) => {
      if (success) {
        const generatedOtp = this.authService.generateAndSaveOtp();
        console.log(`Simulated OTP: ${generatedOtp}`);
  
        if (modal) {
          this.renderer.addClass(modal, 'show');
          this.renderer.setStyle(modal, 'display', 'block');
        }
      } else {
        window.alert('Invalid Credentials');
        console.log(success);
      }
    });
  
    console.log(username, password);
}
  


  verifyOtp(): void {
    // Simulate OTP verification
    if (this.authService.verifyOtp(this.otp)) {
      // Navigate to the dashboard or another secured page upon successful OTP verification
      console.log('OTP successfully verified');
      this.authService.clearOtp(); // Clear the OTP after successful verification
      this.router.navigate(['/dashboard']);
      console.log(this.router.navigate(['/dashboard']));
    } else {
      console.log('OTP verification failed');
      // Handle unsuccessful OTP verification, show an error message, etc.
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
}