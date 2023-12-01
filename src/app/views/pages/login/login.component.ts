
import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthSessionService } from 'src/app/services/authentication/auth-session.service';
import { Router } from '@angular/router';

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
    public authService: AuthSessionService) {
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
    
      
      const modal = this.otpModal.nativeElement;
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
   
      // Perform login logic
      this.authService.simulateLogin(username, password).subscribe((success) => {
        if (success) {

          // Simulate OTP generation and saving
          const generatedOtp = this.authService.generateAndSaveOtp();
          // Show OTP input in your UI or navigate to OTP verification page
          console.log(`Simulated OTP: ${generatedOtp}`);
  
          // this.showOtpComponent = true;
          if (modal) {
              this.renderer.addClass(modal, 'show');
              this.renderer.setStyle(modal, 'display', 'block');
            }
        } else {
          window.alert('Invalid Credentials')// Handle unsuccessful login, show an error message, etc.
          console.log(success);
        }
      });
      
      console.log(username, password)
    }
    
  }


  verifyOtp(): void {
    // Simulate OTP verification
    if (this.authService.verifyOtp(this.otp)) {
      // Navigate to the dashboard or another secured page upon successful OTP verification
      console.log('OTP successfully verified');
      this.authService.clearOtp(); // Clear the OTP after successful verification
      this.router.navigate(['/dashboard']);
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
