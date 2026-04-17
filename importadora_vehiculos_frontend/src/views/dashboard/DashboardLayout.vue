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
  const baseOptions = [
    { id: 2, name: 'Vehiculos', route: { name: 'vehiculos' } },
    { id: 3, name: 'Clientes', route: { name: 'clientes' } },
    { id: 4, name: 'Ventas', route: '/dashboard/ventas' },
    { id: 5, name: 'Cambiar contraseña', route: { name: 'cambiar-password' } },
  ]

  if (rol === 'ADMIN') {
    return [
      { id: 1, name: 'Inicio', route: { name: 'inicio' } },
      { id: 6, name: 'Usuarios', route: { name: 'usuarios' } },
      { id: 7, name: 'Importaciones', route: { name: 'importaciones' } },
      { id: 8, name: 'Marcas', route: { name: 'marcas' } },
      { id: 9, name: 'Modelos', route: { name: 'modelos' } },
      { id: 10, name: 'Ingresos de vehículos', route: { name: 'ingresos-vehiculos' } },
      { id: 11, name: 'Costo Vehículos', route: { name: 'vehiculo-costos' } },
      ...baseOptions,
    ]
  }
  if (rol === 'VENDEDOR') {
    return [
      { id: 1, name: 'Inicio', route: { name: 'inicio' } },
      { id: 7, name: 'Importaciones', route: { name: 'importaciones' } },
      ...baseOptions,
    ]
  }
  return baseOptions
})
</script>

<template>
  <div>
    <nav class="navbar">
      <span class="logo">Sistema Vehículos</span>
      <ul>
        <li v-for="item in menuOptions" :key="item.id">
          <router-link :to="item.route">
            {{ item.name }}
          </router-link>
        </li>
        <li>
          <a href="#" @click.prevent="logout">Cerrar sesión</a>
        </li>
      </ul>
    </nav>
    <div class="mt-5 pt-4">
      <router-view />
    </div>
  </div>
</template>
