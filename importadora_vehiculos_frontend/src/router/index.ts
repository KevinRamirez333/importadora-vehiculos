import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/login/Login.vue'

import CreateUser from '@/views/usuarios/CreateUser.vue'
import UsuariosSistema from '@/views/usuarios/UsuariosSistema.vue'
import EditarUsuario from '@/views/usuarios/EditarUsuario.vue'
import CambiarPassword from '@/views/usuarios/CambiarPassword.vue'
import CreateVehiculo from '@/views/vehiculos/CreateVehiculo.vue'
import EditarVehiculo from '@/views/vehiculos/EditarVehiculo.vue'
import ListaVehiculos from '@/views/vehiculos/ListaVehiculos.vue'
import ListarMarcas from '@/views/marcas/ListarMarcas.vue'
import CrearMarca from '@/views/marcas/CrearMarca.vue'
import CrearModelo from '@/views/modelos/CrearModelo.vue'
import ListaModelo from '@/views/modelos/ListaModelo.vue'
import crearIngresoVehiculo from '@/views/ingresoVehiculos/crearIngresoVehiculo.vue'
import ListaIngresoVehiculo from '@/views/ingresoVehiculos/ListaIngresoVehiculo.vue'
import EditarIngresoVehiculo from '@/views/ingresoVehiculos/EditarIngresoVehiculo.vue'
import CrearImportacion from '@/views/importaciones/crearImportacion.vue'
import ListaImportaciones from '@/views/importaciones/ListaImportaciones.vue'
import EditarImportacion from '@/views/importaciones/EditarImportacion.vue'
import ListaVehiculoCostos from '@/views/costoVehiculos/ListaVehiculoCostos.vue'
import CrearVehiculoCosto from '@/views/costoVehiculos/CrearVehiculoCosto.vue'
import EditarVehiculoCosto from '@/views/costoVehiculos/EditarVehiculoCosto.vue'
import DefinirPrecioVenta from '@/views/vehiculos/DefinirPrecioVenta.vue'
import ListaClientes from '@/views/clientes/ListaClientes.vue'
import CrearCliente from '@/views/clientes/CrearCliente.vue'
import DashboardLayout from '@/views/dashboard/DashboardLayout.vue'
import Inicio from '@/views/dashboard/Inicio.vue'
import EditarCliente from '@/views/clientes/EditarCliente.vue'
import CrearVenta from '@/views/ventas/CrearVenta.vue'
import ComprasCliente from '@/views/ventas/ComprasCliente.vue'
import ListaVentas from '@/views/ventas/ListaVentas.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '',
          redirect: { name: 'inicio' }, 
        },
        {
          path: 'inicio',
          name: 'inicio',
          component: Inicio,
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: UsuariosSistema,
        },
        {
          path: 'usuarios/crear',
          name: 'crear-usuario',
          component: CreateUser,
        },
        {
          path: 'usuarios/editar/:id',
          name: 'editar-usuario',
          component: EditarUsuario,
        },
        {
          path: 'cambiar-password',
          name: 'cambiar-password',
          component: CambiarPassword,
        },
        {
          path: 'vehiculos',
          name: 'vehiculos',
          component: ListaVehiculos,
        },
        {
          path: 'vehiculos/editar/:vin',
          name: 'editar-vehiculo',
          component: EditarVehiculo,
        },

        {
          path: 'vehiculos/crear',
          name: 'crear-vehiculo',
          component: CreateVehiculo,
        },
        {
          path: 'vehiculos/precio-venta/:vin',
          name: 'precio-venta',
          component: DefinirPrecioVenta,
        },
        {
          path: 'marcas',
          name: 'marcas',
          component: ListarMarcas,
        },
        {
          path: 'marcas/crear',
          name: 'crear-marca',
          component: CrearMarca,
        },
        {
          path: 'modelos/crear',
          name: 'crear-modelo',
          component: CrearModelo,
        },
        {
          path: 'modelos',
          name: 'modelos',
          component: ListaModelo,
        },
        {
          path: 'ingresos-vehiculos/crear',
          name: 'crear-ingreso-vehiculo',
          component: crearIngresoVehiculo,
        },
        {
          path: 'ingresos-vehiculos',
          name: 'ingresos-vehiculos',
          component: ListaIngresoVehiculo,
        },
        {
          path: 'ingresos-vehiculos/editar/:id',
          name: 'editar-ingreso-vehiculo',
          component: EditarIngresoVehiculo,
        },
        {
          path: 'importaciones/crear/:id',
          name: 'crear-importacion',
          component: CrearImportacion,
        },
        {
          path: 'importaciones',
          name: 'importaciones',
          component: ListaImportaciones,
        },
        {
          path: 'importaciones/editar/:id',
          name: 'editar-importacion',
          component: EditarImportacion,
        },
        {
          path: 'vehiculo-costos',
          name: 'vehiculo-costos',
          component: ListaVehiculoCostos,
        },
        {
          path: 'vehiculo-costos/crear',
          name: 'crear-vehiculo-costo',
          component: CrearVehiculoCosto,
        },
        {
          path: 'vehiculo-costos/editar/:id',
          name: 'editar-vehiculo-costo',
          component: EditarVehiculoCosto,
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: ListaClientes,
        },
        {
          path: 'clientes/crear',
          name: 'crear-cliente',
          component: CrearCliente,
        },
        {
          path: 'clientes/editar/:id',
          name: 'editar-cliente',
          component: EditarCliente
        },
        {
          path:'ventas',
          name:'ventas',
          component: ListaVentas
        },
        {
          path: 'ventas/crear',
          name:'crear-venta',
          component: CrearVenta
        },
        {
          path: 'ventas/cliente/:id',
          name: 'compras-cliente',
          component: ComprasCliente
        },
      ],
    },
  ],
})
/*  PROTECCIÓN DE RUTAS */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Si NO hay token y NO está intentando ir al login
  if (!token && to.path !== '/') {
    next('/') // lo manda al login
  }
  // Si ya tiene token y quiere ir al login
  else if (token && to.path === '/') {
    next({ name: 'inicio' }) // lo manda al dashboard
  } else {
    next() // deja pasar normalmente
  }
})

export default router
