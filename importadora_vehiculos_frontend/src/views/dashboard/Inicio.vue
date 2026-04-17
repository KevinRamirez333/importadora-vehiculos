<script setup lang="ts">
import api from '@/services/api'

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'


const totalVehiculos = ref(0)

onMounted(async () => {
  try {
    const res = await api.get('/vehiculos') // ajusta URL
    const data = await res.data

    totalVehiculos.value = data.length
  } catch (error) {
    console.error('Error cargando vehículos:', error)
  }
})
</script>

<template>
  <div>

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
