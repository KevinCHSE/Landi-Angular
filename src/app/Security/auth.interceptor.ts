import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth-service";


export const authInterceptor:HttpInterceptorFn=(req,next)=>{
  const serviceAuth=inject(AuthService)
  const API_KEY= serviceAuth.token()


  const authReq=req.clone({
    setHeaders:{
      Authorization:`Bearer ${API_KEY}`
    }
  });

  return next(authReq);
}
