import { Client } from "../Client";

export interface payment{
    id:number;
    client:Client;
    starDate:string;
    endDate:string;
    paymentDate:string;
    amount:number;
    priviuosBalance:number;
    newBalance:number;
}
