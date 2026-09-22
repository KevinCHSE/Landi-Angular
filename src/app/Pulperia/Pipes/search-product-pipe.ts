import { Pipe, PipeTransform } from '@angular/core';
import { Products } from '../Models/Products';

@Pipe({
  name: 'searchProduct',
})
export class SearchProductPipe implements PipeTransform {

  transform(products: Products[] | undefined | null, searchTerm: string): Products[] {

    if (!products) {
      return [];
    }

    if (!searchTerm) {
      return products;
    }

    const termino = searchTerm.toLowerCase();

    return products.filter(product =>
      product.name.toLowerCase().includes(termino)
    );
  }
}
