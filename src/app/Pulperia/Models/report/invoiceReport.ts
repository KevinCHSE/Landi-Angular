import { invoice } from "./invoice"



export interface invoiceReport{
  cash:number
  onCredit:number
  total:number
  purchases:invoice[]
}
