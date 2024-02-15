import { Injectable } from '@angular/core';
import jsPDF from 'jspdf'; // Import jsPDF with its default export
import 'jspdf-autotable';
import html2canvas from 'html2canvas'; // Import html2canvas

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  constructor() {}


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



openPDF(elementId: string): void {
  let DATA: any = document.getElementById(elementId);
  html2canvas(DATA).then((canvas) => {
    let contentHeight = DATA.scrollHeight;

    let fileWidth = 208;
    let fileHeight = (contentHeight * fileWidth) / canvas.width;

    // Add padding values
    let paddingX = 10; // Adjust as needed
    let paddingY = 10; // Adjust as needed

    const FILEURI = canvas.toDataURL('image/png');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let positionX = paddingX;
    let positionY = paddingY;

    // Define function to add content to PDF
    const addContentToPDF = (contentY: number) => {
      PDF.addImage(FILEURI, 'PNG', positionX, positionY, fileWidth - 2 * paddingX, fileHeight - 2 * paddingY);
      positionY += fileHeight - 2 * paddingY;

      // Check if remaining space on the page is not enough for another image
      if (positionY + fileHeight - 2 * paddingY > PDF.internal.pageSize.getHeight()) {
        PDF.addPage(); // Add new page
        positionY = paddingY; // Reset Y position
      }
    };

    // Add content to PDF, possibly spanning multiple pages
    addContentToPDF(positionY);

    PDF.save('SBL.pdf');
  });
}






}




