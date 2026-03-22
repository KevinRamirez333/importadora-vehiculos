<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const nombre = ref('')
const rol = ref('')

const id = Number(route.params.id)

const cargarUsuario = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/usuarios/${id}`)

    nombre.value = res.data.nombre
    rol.value = res.data.rol
  } catch (error) {
    alert('No se pudo cargar el usuario')
  }
}

const actualizarUsuario = async () => {
  await axios.put(`http://localhost:3000/usuarios/${id}`, {
    nombre: nombre.value,
    rol: rol.value,
  })

  alert('Usuario actualizado')
  
}

onMounted(cargarUsuario)
</script>

<template>
  <div class="form-container">
    <!-- Navbar superior -->
    <nav class="navbar">
      <button class="btn-volver" @click="router.push('/usuarios')">← Volver</button>
    </nav>

    <h2>Editar Usuario</h2>

    <input v-model="nombre" placeholder="Nombre" />

    <select v-model="rol">
      <option value="1">ADMIN</option>
      <option value="2">SUPERVISOR</option>
      <option value="3">VENDEDOR</option>
    </select>

    <button class="btn-guardar" @click="actualizarUsuario">Guardar Cambios</button>
  </div>
</template>

<style>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 420px;
  margin: 40px auto;
}
input,
select {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  font-size: 15px;
  width: 100%;
  outline: none;
  transition: 0.3s ease;
}

input:focus,
select:focus {
  border-color: #42b983;
  box-shadow: 0 0 6px rgba(66, 185, 131, 0.3);
}
.btn-volver {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s ease;
}
.btn-guardar {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s ease;
}
</style>
