import { invoiceDetailsRequest } from "./invoiceDetailsRequest";

export interface invoiceRequest{
    clientId:string;
    payment:string;
    items:invoiceDetailsRequest[];
}
