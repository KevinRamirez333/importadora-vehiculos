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
  localStorage.removeItem('token') // elimina el token
  router.push('/') // redirige al login
}

const menuOptions = computed(() => {
  const baseOptions = [
    { name: 'Vehículos', route: '/vehiculos' },
    { name: 'Clientes', route: '/clientes' },
    { name: 'Ventas', route: '/ventas' }
  ]

  if (rol === 'ADMIN') {
    return [
      { name: 'Crear Usuario', route: '/usuarios/crear' },
      { name: 'Importaciones', route: '/importaciones' },
      ...baseOptions
    ]
  }

  if (rol === 'SUPERVISOR') {
    return [
      { name: 'Importaciones', route: '/importaciones' },
      ...baseOptions
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
        <li v-for="item in menuOptions" :key="item.route">
          <router-link :to="item.route">
            {{ item.name }}
          </router-link>
        </li>
          <!-- Botón cerrar sesión -->
  <li>
    <a href="#" @click.prevent="logout">
      Cerrar sesión
    </a>
  </li>
      </ul>
    </nav>

    <router-view />

  </div>
  
</template>

<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #2c3e50;
  padding: 1rem;
  color: white;
  z-index: 1000;
}

.navbar ul {
  display: flex;
  list-style: none;
  gap: 1rem;
}

.navbar a {
  color: white;
  text-decoration: none;
}

</style>
