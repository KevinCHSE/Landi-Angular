import { Routes } from '@angular/router';
import { inicioComponent } from './Pulperia/pages/inicio/inicio.component';
import { clientesComponent } from './Pulperia/pages/clientes/clientes.component';
import { productosComponent } from './Pulperia/pages/productos/productos.component';
import { reporteComprasComponent } from './Pulperia/pages/reporte-compras/reporte-compras.component';
import { carritoComponent } from './Pulperia/pages/carrito/carrito.component';
import { AgregarCliente } from './Pulperia/pages/clientes/agregar-cliente/agregar-cliente';
import { AgregarProducto } from './Pulperia/pages/productos/agregar-producto/agregar-producto';
import { EditarProducto } from './Pulperia/pages/productos/editar-producto/editar-producto';
import { EditarCliente } from './Pulperia/pages/clientes/editar-cliente/editar-cliente';

import { Pulperia } from './Pulperia/Pulperia.routes';
import { LoginComponent } from './Login/login-component';


export const routes: Routes = [
  {
    path:"",
    component:LoginComponent
  },
  {
    path:"Pulperia",
    loadChildren:()=>import('./Pulperia/Pulperia.routes'),
  },
  {
    path: "**" ,
    component:LoginComponent
  },

];
