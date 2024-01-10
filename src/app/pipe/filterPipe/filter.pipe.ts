import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterLoanList'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: any, columns: string[]): any {
    if (!items || !filter || !columns || columns.length === 0) {
      return items;
    }

    return items.filter(item =>
      columns.some(
        key => item[key] && item[key].toLowerCase().includes(filter[key].toLowerCase())
      )
    );
  }
}
