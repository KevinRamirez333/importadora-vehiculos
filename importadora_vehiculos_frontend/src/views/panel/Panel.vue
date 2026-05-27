<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

import { computed } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const token = localStorage.getItem('token')

let rol = ''

if (token) {
  const decoded: any = jwtDecode(token)

  rol = decoded.rol
}

const logout = () => {
  localStorage.removeItem('token') //elimina el token

  router.push('/')
}

const menuOptions = computed(() => {
  const modules = {
    vehiculos: {
      name: 'Vehículos',

      items: [
        { name: 'Ingresos de vehículos', route: { name: 'ingresos-vehiculos' } },

        { name: 'Vehículos', route: { name: 'vehiculos' } },

        { name: 'Importaciones', route: { name: 'importaciones' } },

        { name: 'Costos por vehículo', route: { name: 'vehiculo-costos' } },

        { name: 'Marcas', route: { name: 'marcas' } },

        { name: 'Modelos', route: { name: 'modelos' } },
      ],
    },
    ventas: {
      name: 'Ventas',
      items: [
        { name: 'Gestión de ventas', route: { name: 'ventas' } },
        { name: 'Registrar venta', route: { name: 'crear-venta' } },
      ],
    },
    clientes: {
      name: 'Clientes',

      items: [
        { name: 'Gestión de clientes', route: { name: 'clientes' } },
        { name: 'Registrar cliente', route: { name: 'crear-cliente' } },
      ],
    },

    admin: {
      name: 'Administración',

      items: [
        { name: 'Gestión de usuarios', route: { name: 'usuarios' } },
        { name: 'Crear usuario', route: { name: 'crear-usuario' } },
      ],
    },
  }

  const base = [
    { name: 'Inicio', route: { name: 'inicio' } },

    { name: 'Cambiar contraseña', route: { name: 'cambiar-password' } },
  ]


  if (rol === 'ADMIN') {
    return [modules.vehiculos, modules.clientes, modules.ventas, modules.admin, ...base]
  }
  if(rol==='SUPERVISOR'){
    return [modules.clientes,modules.vehiculos,modules.ventas, ...base]
  }

  if (rol === 'VENDEDOR') {
    return [ modules.ventas, modules.clientes, { name: 'Vehículos', route: { name: 'vehiculos-vendedor' } },...base]
  }

  return base
})
</script>

<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-dark px-3">
      <div class="container-fluid">
        <span class="navbar-brand"> Sistema Vehículos </span>

        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-center">
            <li v-for="item in menuOptions" :key="item.name" class="nav-item dropdown">
              <template v-if="'items' in item">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ item.name }}
                </a>

                <ul class="dropdown-menu dropdown-menu-dark">
                  <li v-for="sub in item.items" :key="sub.name">
                    <router-link class="dropdown-item" :to="sub.route">
                      {{ sub.name }}
                    </router-link>
                  </li>
                </ul>
              </template>

              <router-link v-else class="nav-link" :to="item.route">
                {{ item.name }}
              </router-link>
            </li>

            <li class="nav-item">
              <a href="#" class="nav-link" @click.prevent="logout"> Cerrar sesión </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="mt-2 pt-4">
      <router-view />
    </div>
  </div>
</template>

<style>
label {
  text-align: center;
  display: block;
}
</style>
