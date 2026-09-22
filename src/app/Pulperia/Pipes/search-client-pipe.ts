import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchClient',
})
export class SearchClientPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
