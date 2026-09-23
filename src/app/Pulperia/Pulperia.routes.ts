import { Routes } from '@angular/router';
import { routes } from '../app.routes';
import { inicioComponent } from './pages/inicio/inicio.component';
import { clientesComponent } from './pages/clientes/clientes.component';
import { productosComponent } from './pages/productos/productos.component';
import { carritoComponent } from './pages/carrito/carrito.component';
import { AgregarProducto } from './pages/productos/agregar-producto/agregar-producto';
import { EditarProducto } from './pages/productos/editar-producto/editar-producto';
import { AgregarCliente } from './pages/clientes/agregar-cliente/agregar-cliente';
import { EditarCliente } from './pages/clientes/editar-cliente/editar-cliente';
import { LayoutComponent } from './Layout/layout-component/layout-component';
import { Pago } from './pages/inicio/pago/pago';


export const Pulperia:Routes=[
  {
    path:"",
    component:LayoutComponent,
    children:[
      {
          path:"PayAccount",
          component:Pago
        },
        {
          path:"Clients",
          component:clientesComponent
        },

        {
          path:"Products",
          component:productosComponent
        },
        {
          path:"shoppingCar",
          component:carritoComponent
        },
        {
          path:"Products/agregarProducto",
          component:AgregarProducto
        },
        {
          path:"Products/editarProducto/:id",
          component:EditarProducto
        },
        {
          path:"Clients/AgregarCliente",
          component:AgregarCliente
        },{
          path:"Clients/editarClient/:id",
          component:EditarCliente
        },
        {
          path:"**",
          component:inicioComponent
        },
    ]
  },

];

export default Pulperia;
