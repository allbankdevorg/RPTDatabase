import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {

  constructor() { }

  exportToCsv(data: any[], fileName: string): void {
    const csvContent = this.convertArrayToCsv(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertArrayToCsv(arr: any[]): string {
    const excludedFields = ['dir_CisNumber', 'comp_CIS', 'dirRelated', 'cisNumber'];
    const headers = this.getHeaders(arr[0], excludedFields);
    const headerRow = headers.join(',');
  
    const dataRows = arr.map(row => this.formatCsvRow(row, headers)).join('\n');
  
    return `${headerRow}\n${dataRows}`;
  }
  
  private getHeaders(obj: any, excludedFields: string[]): string[] {
    return Object.keys(obj).filter(header => {
      if (excludedFields.includes(header)) {
        return false;
      }
      // Check if the field is an object (nested field)
      if (typeof obj[header] === 'object' && obj[header] !== null) {
        // Recursively get headers for nested object, excluding nested fields
        const nestedHeaders = this.getHeaders(obj[header], excludedFields);
        return nestedHeaders.length > 0;
      }
      return true;
    });
  }
  
  
private formatCsvRow(row: any, headers: string[]): string {
  return headers.map(header => this.formatCsvCell(row[header])).join(',');
}

  
  private formatCsvCell(cell: any): string {
    if (cell === null || cell === undefined) {
      return '';
    } else if (Array.isArray(cell)) {
      return cell.map(item => this.formatCsvCell(item)).join(', ');
    } else if (typeof cell === 'object') {
      return Object.values(cell).map(value => this.formatCsvCell(value)).join(', ');
    } else {
      return cell.toString();
    }
  }
}
