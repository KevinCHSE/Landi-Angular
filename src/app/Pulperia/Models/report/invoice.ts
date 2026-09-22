import { invoiceItems } from "./invoiceItems";


export interface invoice{
  date:string;
  items:invoiceItems[];
  payment:string;
  total:number
}
