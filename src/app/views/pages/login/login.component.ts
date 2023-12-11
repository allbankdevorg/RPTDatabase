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
    private idle: SessionTimeoutService) {
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
  
login(): void {
  // Simulate login with username and password
  if (this.loginForm.valid) {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    const sessionId = uuidv4()

    Loginuser(username, password, sessionId)
    .then((response) => {
      // console.log(response);
      
      // console.log(response.result[0].message);
      // console.log(response.result[0].status);
      // console.log('Login successful!');

      this.uD = response.result[0].user_details;
      this.sID = sessionId;
      this.uA = response.result[0].user_access
      // sessionStorage.setItem('user', JSON.stringify(response.result[0].user_details));
        // localforage.setItem('user', userD);
        
        this.authService.setAuthToken('yourAuthToken'); // Replace with an actual token
  
           console.log(response.result[0]);
      
            // let uID = response.result[0].user_details[0].id;
            // let userName = response.result[0].user_details[0].username;
            // let  sessionID = response.result[0].user_details[0].login_session;

            // console.log(uID);
            // console.log(userName);
            // console.log(sessionID);

            const modal = this.otpModal.nativeElement;
                // console.log(modal);

        if (response.result[0].message == 'success') {
          const generatedOtp = this.authService.generateAndSaveOtp();
          console.log(`Simulated OTP: ${generatedOtp}`);

          if (modal) {
            this.renderer.addClass(modal, 'show');
            this.renderer.setStyle(modal, 'display', 'block');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            // text: 'Invalid username or password',
          });
        }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password',
      });
      // console.error('Error:', error);
      // console.log(error.result[0].message);
      // console.log(error.result[0].status);
    });
  }
}



//   login(): void {
   
//         // Simulate login with username and password
//         if (this.loginForm.valid) {
//           const username = this.loginForm.get('username')?.value;
//           const password = this.loginForm.get('password')?.value;

//           const sessionId = uuidv4()
          
//           Loginuser(username, password, sessionId)
//           .then((response) => {
//             // Handle the response
//             this.UserLogin();
//             console.log('Login successful!');
//             sessionStorage.setItem('sessionID', JSON.stringify(sessionId));
//             sessionStorage.setItem('userAcces', JSON.stringify(response.result[0].user_access));
//             console.log(response.result[0]);

//             var uID = response.result[0].user_details[0].id;
//             var userName = response.result[0].user_details[0].username;
//             var sessionID = response.result[0].user_details[0].login_session;

//             console.log(uID);
//             console.log(userName);
//             console.log(sessionID);
            
            
//             // this.localStorage.store('userName', userName);
//             // this.localStorage.store('sessionID', sessionID);
//             // this.localStorage.store('access', response.result[0].user_access[0]);
//             // console.log(this.localStorageService.retrieve('uID'));
//             // console.log(details);
//             // console.log(response.result[1].id);

//             // this.localStorage.store('uID', response.result.userdetails.id);
//             // console.log(this.localStorage);
//             // this.UserLogin();
//             // Perform login logic
            
//           })
//           .catch((error) => {
//             console.log(error);
//             console.error(error.result[0].message);
            
//           });

//         }
        
//   }


//   UserLogin(): void {
//     const modal = this.otpModal.nativeElement;
//     console.log(modal);
//     const username = this.loginForm.get('username')?.value;
//     const password = this.loginForm.get('password')?.value;
  
//     this.authService.simulateLogin(username, password).subscribe((success) => {
//       if (success) {
//         const generatedOtp = this.authService.generateAndSaveOtp();
//         console.log(`Simulated OTP: ${generatedOtp}`);
  
//         if (modal) {
//           this.renderer.addClass(modal, 'show');
//           this.renderer.setStyle(modal, 'display', 'block');
//         }
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Login Failed',
//           text: 'Invalid username or password',
//         });
//       }
//     });
  
//     console.log(username, password);
// }
  

async verifyOtp() {

  if(this.otp != '') {
    // show error modal for empty OTP
     // Verify OTP 
     const isVerified = await this.authService.verifyOtp(this.otp);
    
     if(isVerified) {

        
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
     
       // Invalid OTP, show error 
       Swal.fire({        
         icon: 'error',
         title: 'Invalid OTP'
       });
     
     }
  } else {
      Swal.fire({
        icon: 'error',
        title: 'OTP is Empty!',
        text: 'OTP is required',
      });
  }

}


//  async verifyOtp() {
//     // Simulate OTP verification
//     if (this.otp != '') {
//       Swal.fire({
//         title: 'Loading...',
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });
//       if (this.authService.verifyOtp(this.otp)) {
//         // Navigate to the dashboard or another secured page upon successful OTP verification
         
//         Swal.close();

//         // Make the asynchronous request
//         const response = await this.router.navigate(['/dashboard']);

//         // Close the loading spinner
      

        
//         this.authService.clearOtp(); // Clear the OTP after successful verification
        
//         this.idle.setIdleConfig();
//         // console.log(this.router.navigate(['/dashboard']));
//       } else {
//         Swal.close();
//         Swal.fire({
//           icon: 'error',
//           title: 'Invalid OTP',
//           text: 'OTP is Invalid',
//         });
//         // Handle unsuccessful OTP verification, show an error message, etc.
//       }
//     }
//     else {
//       Swal.close();
//       Swal.fire({
//         icon: 'error',
//         title: 'OTP is Empty!',
//         text: 'OTP is required',
//       });
//     }


    
//   }

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