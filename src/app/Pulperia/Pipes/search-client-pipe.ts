import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../Models/Client';

@Pipe({
  name: 'searchClient',
})
export class SearchClientPipe implements PipeTransform {
  transform(clients:Client[]|undefined|null , searchTerm:string): Client[] {
    if(!clients){
      return []
    }
    if(!searchTerm){
      return clients
    }

    const search=searchTerm.toLowerCase();
    return clients.filter(client=>client.name.toLocaleLowerCase().includes(search));
  }
}
