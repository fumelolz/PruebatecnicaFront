import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name',
})
export class NamePipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return '';
    }
    return `${value.name} ${value.firstSurname}`;
  }
}
