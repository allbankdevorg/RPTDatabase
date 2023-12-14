/**
 *  - createDosri
 *  - createDirectors
 *  - createRelatedInterest
 *  - createBankOfficer
 *  - createBankOfficerRelationship
 *  - createAffil
 *  - createAffilDir
 *  - createAffilOff
 *  - createAffilOffRI
 *  - createRPDirectorsRelatedInterest
 */



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Service for handling various add operations related to affiliates, directors, officers, etc.
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class AddServicesService {
  private apiUrl = 'http://10.232.236.15:8092/api/';

  

  /**
   * Constructor for AddServicesService.
   * @constructor
   * @param {HttpClient} http - The Angular HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Creates a DOSRI (Directors, Officers, Stockholders, and their Related Interests).
   * @param {any} formData - The form data containing cisNumber, accountName, and companyName.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createDosri(formData: any): Observable<any> {
    const requestPayload = {
      cmd: 1,
      request: {
        cis_number: formData.cisNumber,
        account_name: formData.accountName,
        company_name: formData.companyName
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  /**
   * Creates DOSRI directors.
   * @param {any} directData - The data for the DOSRI director.
   * @param {any} selectedCompCISNumber - The selected company's CIS number.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createDirectors(directData: any, selectedCompCISNumber: any): Observable<any> {
    const requestPayload = {
      cmd: 2,
      request: {
        cis_number: directData.cisNumber,
        fname: directData.dFirstName,
        mname: directData.dMiddleName,
        lname: directData.dLastName,
        position: directData.dPosition,
        com_cisnumber: selectedCompCISNumber
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  /**
   * Creates Directors related interest.
   * @param {any} riData - The data for the related interest.
   * @param {any} buttonId - The button ID.
   * @param {any} selectedDirCisNumber - The selected director's CIS number.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createRelatedInterest(riData: any, buttonId: any, selectedDirCisNumber: any): Observable<any> {
    const requestPayload = {
      cmd: 3,
      request: {
        cis_number: riData.riCisNumber,
        fname: riData.riFirstName,
        mname: riData.riMiddleName,
        lname: riData.riLastName,
        dir_related: selectedDirCisNumber,
        relation: buttonId
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }


  /**
   * Creates a bank officer.
   * @param {any} boData - The data for the bank officer.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createBankOfficer(boData: any): Observable<any> {
    const requestPayload = {
      cmd: 4,
      request: {
        cis_number: boData.boCisNumber,
        fname: boData.boFirstName,
        mname: boData.boMiddleName,
        lname: boData.boLastName,
        position: boData.boPosition,
        com_cisnumber: "1111111"
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  /**
   * Creates a bank officer related interest.
   * @param {any} boRIData - The data for the bank officer related interest.
   * @param {any} buttonId - The button ID.
   * @param {any} selectedcomCisNumber - The selected company's CIS number.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createBankOfficerRelationship(boRIData: any, buttonId: any, selectedcomCisNumber: any): Observable<any> {
    const requestPayload = {
      cmd: 5,
      request: {
        cis_number: boRIData.boRICisNumber,
        fname: boRIData.boRIFirstName,
        mname: boRIData.boRIMiddleName,
        lname: boRIData.boRILastName,
        off_related: selectedcomCisNumber,
        relation: buttonId
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  
  /**
   * Creates an affiliate.
   * @param {any} formData - The form data containing affiliate information.
   * @param {any} moduleV - The module information.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createAffil(formData: any, moduleV: any): Observable<any> {
    const requestPayload = {
      cmd: 6,
      request: {
        cis_number: formData.affilCisNumberM,
        account_name: formData.accountName,
        company_name: formData.companyName,
        manager: formData.commandControl,
        module: moduleV,
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  /**
   * Creates an affiliate director.
   * @param {any} dirData - The data for the affiliate director.
   * @param {any} compId - The company ID.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createAffilDir(dirData: any, compId: any): Observable<any> {
    const requestPayload = {
      cmd: 7,
      request: {
        cis_number: dirData.affildcisNumber,
        fname: dirData.affildFirstName,
        mname: dirData.affildMiddleName,
        lname: dirData.affildLastName,
        position: dirData.affildPosition,
        com_cisnumber: compId
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  /**
   * Creates an affiliate officer.
   * @param {any} offData - The data for the affiliate officer.
   * @param {any} compId - The company ID.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createAffilOff(offData: any, compId: any): Observable<any> {
    const requestPayload = {
      cmd: 8,
      request: {
        cis_number: offData.affilOffCisNumber,
        fname: offData.affilOffFirstName,
        mname: offData.affilOffMiddleName,
        lname: offData.affilOffLastName,
        position: offData.affilOffPosition,
        com_cisnumber: compId
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }

  /**
   * Creates an affiliate officer related interest.
   * @param {any} OffriData - The data for the affiliate officer related interest.
   * @param {any} buttonId - The button ID.
   * @param {any} selectedOffCisNumber - The selected officer's CIS number.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createAffilOffRI(OffriData: any, buttonId: any, selectedOffCisNumber: any): Observable<any> {
    const requestPayload = {
      cmd: 9,
      request: {
        cis_number: OffriData.riCisNumber,
        fname: OffriData.riFirstName,
        mname: OffriData.riMiddleName,
        lname: OffriData.riLastName,
        off_related: selectedOffCisNumber,
        relation: buttonId
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }  

  /**
   * Creates RP directors related interest.
   * @param {any} riData - The data for the DOSRI director related interest.
   * @param {any} buttonId - The button ID.
   * @param {any} selectedDirCisNumber - The selected director's CIS number.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  createRPDIrectorsRelatedInterest(riData: any, buttonId: any, selectedDirCisNumber: any): Observable<any> {
    const requestPayload = {
      cmd: 10,
      request: {
        cis_number: riData.riCisNumber,
        fname: riData.riFirstName,
        mname: riData.riMiddleName,
        lname: riData.riLastName,
        dir_related: selectedDirCisNumber,
        relation: buttonId
      },
    };

    return this.http.post(`${this.apiUrl}addData`, requestPayload);
  }



  /**
   * Login.
   * @param {any} username - The username of the user.
   * @param {any} password - The password of the user.
   * @param {any} sessionID - The session ID of the user when the login process is successful.
   * @returns {Observable<any>} - The observable to handle the HTTP request.
   */
  Login(username: any, password: any, sessionId: any): Observable<any> {
    const requestPayload = {
      cmd: 2,
      request: {
        username: username,
        password: password,
        role: 1,
        session: sessionId
      },
    };

    return this.http.post(`${this.apiUrl}userManagement`, requestPayload);
  }






// Update
updateEmployee(id: number, data: any): Observable<any> {
  return this.http.put(`http://localhost:3000/employees/${id}`, data);
}

}
