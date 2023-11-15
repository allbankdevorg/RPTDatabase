import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  otpForm!: FormGroup;
  // Otp
  nums: string[] = new Array(6); // Assuming a 6-digit OTP
 // Assuming a 6-digit OTP
  otpValue = '';
  timer: any;
  canResend = false;

  @ViewChild('otpModal') otpModal!: ElementRef;
  @ViewChild('otpInput') otpInput: ElementRef | undefined;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  


  constructor(private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef) {
  }

  // ngAfterViewInit() {
  //   this.otpForm = this.formBuilder.group({
  //     otp1: [''], // Replace 'otp1' with your actual form control names
  //     otp2: [''],
  //     otp3: [''],
  //     // Add more form controls as needed
  //   });
  // }

  ngOnInit() {
    // this.otpForm = this.formBuilder.group({
    //   otp1: [''],
    //   otp2: [''],
    //   otp3: [''],
    //   otp4: [''],
    //   otp5: [''],
    //   otp6: [''],
    //   otp7: ['']
    //   // Add more form controls as needed
    // });

    // this.otpForm.valueChanges.subscribe(() => {
    //   this.updateOtpValue();
    // });
  }

  onNumInput(event: any, index: number) {
    const value = event.target.value;
    let currentIndex = this.getInputField(index + 1);
  
    if (value.length === 1) {
      this.focusNextInput(index);
    } 
    
    if (event.inputType === 'deleteContentBackward') {
      const prevInputIndex = index - 1;
      this.focusInput(prevInputIndex);
    }
  
    this.updateOtpValue();
  }

  
  
  focusNextInput(index: number) {
    const nextInputIndex = index + 1;
    this.focusInput(nextInputIndex);
  }
  
  clearAndFocus(index: number) {
    const input = this.getInputField(index);
    if (input) {
      input.value = '';
      this.focusInput(index);
    }
  }
  
  focusInput(index: number) {
    const input = this.getInputField(index);
  
    if (input) {
      input.focus();
    }
  }
  
  updateOtpValue() {
    this.otpValue = '';
    for (let i = 1; i <= 7; i++) {
      const controlValue = this.otpForm.get(`otp${i}`)?.value;
      this.otpValue += controlValue;
    }
  
    console.log('Final OTP Value:', this.otpValue);
  }
  
  private getInputField(index: number): HTMLInputElement | null {
    const inputField = document.getElementById(`otp-input-${index}`) as HTMLInputElement;
    return inputField;
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

  checkOTP() {
    // Implement OTP verification logic here
    alert(`Your OTP is: ${this.otpValue}`);
    // Additional logic as needed
  }

  verifyOTP() {
    // Implement OTP verification logic here
    alert('OTP Verified');
    // Additional logic as needed
  }

  resendOTP() {
    if (this.canResend) {
      // Implement OTP resend logic here
      alert('OTP Resent');
      this.startResendTimer();
    }
  }


  login() {
    console.log("success: Login Successfully");
    const modal = this.otpModal.nativeElement;

    if (modal) {
      this.renderer.addClass(modal, 'show');
      this.renderer.setStyle(modal, 'display', 'block');
    }
  }

  onSubmit(){

  }

  Proceed(){

  }
}
