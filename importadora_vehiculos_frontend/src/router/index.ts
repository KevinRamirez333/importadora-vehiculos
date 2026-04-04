import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/Login.vue'
import Dashboard from '@/components/Dashboard.vue'
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
      component: Dashboard,
    },
         {
    path: '/usuarios',
    component: UsuariosSistema,
  },
      {
    path: '/usuarios/crear',
    component: CreateUser,
  },
       {
    path: '/usuarios/editar/:id',
    component: EditarUsuario,
  },
        {
    path: '/usuarios/cambiar/password',
    component: CambiarPassword,
  },
    {
    path: '/vehiculos',
    component: ListaVehiculos,
  },
      {
    path: '/vehiculos/editar/:vin',
    component: EditarVehiculo,
  },

        {
    path: '/vehiculos/crear',
    component: CreateVehiculo,
  },
  {
  path: '/marcas',
  component: ListarMarcas
},
{
  path: '/marcas/crear',
  component: CrearMarca
},
{
  path: '/modelos/crear',
  component: CrearModelo
},
{
  path: '/modelos',
  component: ListaModelo
},
{
  path: '/ingresosVehiculos/crear',
  component: crearIngresoVehiculo
},
{
  path: '/ingresosVehiculos',
  component: ListaIngresoVehiculo
},
{
  path: '/ingresosVehiculos/editar/:id',
  component: EditarIngresoVehiculo
},
{
  path: '/importaciones/crear/:id',
  component: CrearImportacion
},
{
  path: '/importaciones/',
  component: ListaImportaciones
},
{
  path: '/importaciones/editar/:id',
  component: EditarImportacion
},
{
  path: '/vehiculo-costos',
  component: ListaVehiculoCostos
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
    next('/dashboard') // lo manda al dashboard
  } 
  else {
    next() // deja pasar normalmente
  }
})

export default router
