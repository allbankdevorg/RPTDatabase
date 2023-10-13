import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  sendDataToJavaScript(post: any) {
    // Here, you can perform any necessary logic to pass data to your external JavaScript.
    // For example, you can assign the data to a global variable, call a function, or use any other method that suits your needs.
    // For this example, we'll simply log the data to the console.
    console.log('Data sent to JavaScript:', post);
  }

  constructor() { }
}
