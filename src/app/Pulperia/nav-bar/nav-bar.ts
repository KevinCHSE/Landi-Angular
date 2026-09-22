import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Security/auth-service';


interface pages{
  name:string,
  url:string,
  roles:string[]
}
@Component({
  selector: 'nav-bar',
  imports: [RouterLink,],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  service=inject(AuthService)
  router=inject(Router)
  roles=this.service.roles

  paginas:pages[]=[
    {name:"Inicio",url:"/Pulperia",roles:["ROLE_ADMIN"]},
    {name:"Productos",url:"/Pulperia/Products",roles:["ROLE_ADMIN","ROLE_USER"]},
    {name:"Clientes",url:"/Pulperia/Clients",roles:["ROLE_ADMIN","ROLE_USER"]},
    {name:"Carrito",url:"/Pulperia/shoppingCar",roles:["ROLE_ADMIN","ROLE_USER"]},
  ]

  logOut(){
    this.service.logout()
    this.router.navigate(["/"])
  }

}
