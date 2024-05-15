import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'; // Import jsPDF with its default export
import 'jspdf-autotable';
import html2canvas from 'html2canvas'; // Import html2canvas

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  constructor() {}



  //RPT List PDF Report generation
  exportToPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`RPT LIST AS OF ${headerText}`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`RPT LIST AS OF ${formattedDate}`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
}

private formatPDFBody(data: any[], columnsToInclude: string[]): any[] {
  return data.map(item => columnsToInclude.map(column => {
      let value = item[column];
      if (value !== null && value !== undefined && !isNaN(value)) {
          if (column === 'ORIGINAL LOAN' || column === 'OUTSTANDING BALANCE' || column === 'DEPOSIT HOLDOUT'
          || column === 'NET BALANCE') {
              // Format the value as currency with PHP currency symbol
              value = (value);
          } else if (column === 'INTEREST RATE') {
              // Add percentage symbol for 'INTEREST RATE' column
              value = `${value}%`;
          }
      }
      return value;
  }));
}



private formatCurrency(value: any): string {
  const numericValue = Number(value);
  // Convert value to number
  
  // Check if numericValue is a valid number
  if (!isNaN(numericValue)) {
    // Format the value as currency using Intl.NumberFormat
    const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP' // Set currency to PHP for Philippine Peso
    });
    return formatter.format(numericValue);
  } else {
    // Return the original value if it cannot be converted to a valid number
    return String(value);
  }
}

  private formatHeaderRow(columnsToInclude: string[]): string {
    return (columnsToInclude.map(column => `${column.toUpperCase()}`) as string[]).join('\t');
}







//TEst sbl pdf generation
openPDF(): void {
  let DATA: any = document.getElementById('orgChartContainer');
  
  // Ensure all child elements are visible before capturing
  DATA.style.visibility = 'visible';
  
  html2canvas(DATA, { scale: 2 }).then((canvas) => {
    const FILEURI = canvas.toDataURL('image/png');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let paddingX = 10; // Adjust as needed
    let paddingY = 10; // Adjust as needed
    let pageWidth = PDF.internal.pageSize.getWidth() - 2 * paddingX;
    let pageHeight = PDF.internal.pageSize.getHeight() - 2 * paddingY;
    
    let scaleFactor = Math.min(1, pageHeight / canvas.height);
    let scaledWidth = canvas.width * scaleFactor;
    let scaledHeight = canvas.height * scaleFactor;

    let currentY = paddingY;
    let remainingHeight = scaledHeight;

    while (remainingHeight > 0) {
      if (remainingHeight > pageHeight) {
        PDF.addPage();
        currentY = paddingY;
        remainingHeight -= pageHeight;
      } else {
        PDF.addImage(FILEURI, 'PNG', paddingX, currentY, scaledWidth, remainingHeight);
        remainingHeight = 0;
      }
    }

    PDF.save('Org_Chart.pdf');
  });
}









// SBL PDF Report Generation
generateSBLPDF(data: any[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    format: 'legal' // Set orientation to landscape
});

const currentDate = new Date();

// Step 2: Format the date as needed
const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

// Step 3: Add the header text with the formatted date
// Step 3: Define header text
const headerText = `SBL Report as of ${formattedDate}`;
// Step 4: Add the header text with the formatted date
const headerTextWidth = doc.getTextWidth(headerText); // Get the width of the header text
const headerTextX = (doc.internal.pageSize.width - headerTextWidth) / 2; // Calculate the x-coordinate to center the text
const headerTextY = 15; // Set the y-coordinate for the header text
doc.text(headerText, headerTextX, headerTextY); // Center the header text vertically at y-coordinate 20

let y = headerTextY + 15; // Adjust the starting y-coordinate for the first table to add a margin below the header

const columns = [
  'PN/Loan Number', 
  "Borrower's Name", 
  'Collateral', 
  'Amount Granted', 
  'Date Booked ', 
  'Outstanding Balance', 
  'Hold-Out', 
  'Net of Hold-Out', 
  'Payment Status'
];

data.forEach(entry => {
      doc.text(`${entry.account_name}`, 10, y, );
      y += 3;

      // Generate the table for each entry's loan list
      (doc as any).autoTable({
          startY: y,
          head: [columns],
          body: entry.loan_list.map(loan => [loan.loan_no, loan.name, loan.loan_security, loan.principal,
            new Date(loan.date_granted).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }), loan.principal_bal, loan.deposit_holdout, loan.principal_bal - loan.deposit_holdout]),
      });

      // Increase y position for the next entry
      y += entry.loan_list.length * 10 + 10; // Adjust spacing as needed
  });

  

  // Step 4: Append the current date to the filename
  const filename = `SBL_Report_${formattedDate}.pdf`;

  // Step 5: Save the PDF with the updated filename
  doc.save(filename);
}




generateBondsPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`BONDS AND INVESTMENTS`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`BONDS AND INVESTMENTS`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }


  generateLeasePDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`LEASE AND CONTRACTS`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`LEASE AND CONTRACTS`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }



  generateBankOffPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`${headerText}`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`${headerText}`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }

  
  generateBankStockholderPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`Bank Stockholders`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`Bank Stockholders`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }

  

  exportRPOfficerToPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`Related Party Officers`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`Related Party Officers`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }



  exportDOSRIandOfficerToPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`DOSRI And Directors`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`DOSRI And Directors`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }


  exportAffiliateandOfficerToPDF(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`Affiliates And Directors`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`Affiliates And Directors`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }


  generateAffDirRI(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`${headerText} Directors and Related Interest`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`${headerText} Directors and Related Interest`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }


  exportORPCompany(data: any[], filename: string, columnsToInclude: string[], headerText: string): void {
    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'legal'
    });

    // Calculate the width of the header text
    const textWidth = doc.getTextWidth(`${headerText}`);

    // Calculate the x-coordinate to center the text
    const centerX = (doc.internal.pageSize.width - textWidth) / 2;

    // Format the date in "MMMM d, yyyy" format
    const formattedDate = new Date(headerText).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Add the header text with the formatted date
    doc.text(`${headerText}`, centerX, 20);

    // Modify data to include PHP currency symbol
    const modifiedData = this.formatPDFBody(data, columnsToInclude);

    // Generate the table
    (doc as any).autoTable({
      startY: 25, // Adjust startY value to leave space for the header text
      head: [columnsToInclude],
      body: modifiedData,
    });

    doc.save(filename);
  }
}




















