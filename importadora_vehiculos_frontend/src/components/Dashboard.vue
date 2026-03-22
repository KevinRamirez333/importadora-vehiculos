<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const totalVehiculos = ref(0)

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

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/vehiculos') // ajusta URL
    const data = await res.json()

    totalVehiculos.value = data.length
  } catch (error) {
    console.error('Error cargando vehículos:', error)
  }
})



const menuOptions = computed(() => {
  const baseOptions = [
    { name: 'Vehículos', route: '/vehiculos' },
    { name: 'Clientes', route: '/clientes' },
    { name: 'Ventas', route: '/ventas' },
    { name: 'Cambiar contraseña', route: 'usuarios/cambiar/password' },
  ]

  if (rol === 'ADMIN') {
    return [
      { name: 'Usuarios', route: '/usuarios' },
      { name: 'Importaciones', route: '/importaciones' },
      ...baseOptions,
    ]
  }

  if (rol === 'SUPERVISOR') {
    return [{ name: 'Importaciones', route: '/importaciones' }, ...baseOptions]
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
          <a href="#" @click.prevent="logout"> Cerrar sesión </a>
        </li>
      </ul>
    </nav>

    <!-- CONTENIDO DEL DASHBOARD -->
    <div class="dashboard">
      <h1>Bienvenido al Sistema de Gestión</h1>
      <p>
        Utiliza el menú superior para administrar las operaciones de la importadora de vehículos.
      </p>

      <div class="cards">
        <div class="card">
          <span>🚗</span>
          <h3>Vehículos registrados</h3>
          <p>{{ totalVehiculos }}</p>
        </div>

        <div class="card">
          <span>📦</span>
          <h3>Importaciones</h3>
          <p>0</p>
        </div>

        <div class="card">
          <span>👥</span>
          <h3>Clientes</h3>
          <p>0</p>
        </div>

        <div class="card">
          <span>💰</span>
          <h3>Ventas</h3>
          <p>0</p>
        </div>

        <div class="card">
          <span>👤</span>
          <h3>Usuarios</h3>
          <p>0</p>
        </div>
      </div>
    </div>

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

.dashboard {
  margin-top: 80px;
  padding: 40px;
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;
}

.cards {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card span {
  font-size: 35px;
}

.card h3 {
  margin-top: 10px;
  color: black;
}

.card p {
  font-size: 28px;
  font-weight: bold;
  color: black;
}
</style>
