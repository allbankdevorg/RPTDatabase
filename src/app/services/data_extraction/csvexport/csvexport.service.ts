import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {
  constructor() {}

  exportToCSV(data: any[], filename: string, columnsToInclude: string[]): void {
    const csvData = this.convertToCSV(data, columnsToInclude);
    const csvContent = new Blob(['\uFEFF', csvData], { type: 'text/csv;charset=utf-8' }); // Add BOM for UTF-8
    saveAs(csvContent, filename);
  }
  
  
  private convertToCSV(data: any[], columnsToInclude: string[]): string {
    const headers = this.formatHeaderRow(columnsToInclude);
    const csvContent = [
      headers,
      ...data.map(item => columnsToInclude.map(column => {
        // Check if the column needs currency formatting
        if (['ORIGINAL LOAN', 'OUTSTANDING BALANCE', 'DEPOSIT HOLDOUT', 'NET BALANCE'].includes(column)) {
          return this.formatCurrencyValue(item[column]);
        } else {
          return this.formatCSVValue(item[column]);
        }
      }).join(','))
    ];
    return csvContent.join('\n');
  }
  
  private formatCurrencyValue(value: any): string {
    // Convert value to number and format as currency
    const formattedCurrency = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP' // Set currency to PHP for Philippine Peso
    }).format(Number(value) || 0); // Convert value to number or default to 0 if not a valid number
    return `"${formattedCurrency}"`;
  }
  

  private formatHeaderRow(columnsToInclude: string[]): string {
    return columnsToInclude.map(column => `"${column.toUpperCase()}"`).join(',');
  }

  private formatCSVValue(value: any): string {
    // Handle blank values
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Format date columns in MM/dd/yyyy
    if (this.isDate(value)) {
      const date = new Date(value);
      return `"${this.formatDate(date)}"`;
    }

    // Escape double quotes and wrap the value in double quotes if it contains commas or double quotes
    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
      return `"${value.replace(/"/g, '""').trim()}"`; // Trim to remove leading and trailing spaces
    }

    return String(value).trim(); // Trim to remove leading and trailing spaces
  }

  private formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  private isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime());
  }
}
