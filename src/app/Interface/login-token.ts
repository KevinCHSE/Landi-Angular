export interface LoginToken {
  sub:string
  authorities:string[],
  expired:number
}
