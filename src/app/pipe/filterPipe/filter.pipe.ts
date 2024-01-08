import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Modify this condition based on your data structure
      return (
        item.loan_no.toLowerCase().includes(searchText) ||
        item.name.toLowerCase().includes(searchText) ||
        // Add more conditions for other properties
        // ...
        true // placeholder condition; modify or remove as needed
      );
    });
  }
}
