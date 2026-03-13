<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const nombre = ref('')
const email = ref('')
const password = ref('')
const rol = ref('USER')

const router = useRouter()

const crearUsuario = async () => {
  try {
    await axios.post('http://localhost:3000/usuarios', {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: rol.value
    })

    alert('Usuario creado correctamente')
    // limpiar campos
    nombre.value = ''
    email.value = ''
    password.value = ''
    rol.value = 'VENDEDOR'

  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al crear usuario')
  }
}
</script>

<template>
  <div class="page">

    <!-- Navbar superior -->
    <nav class="navbar">
      <button class="btn-volver" @click="router.push('/usuarios')">
        ← Volver
      </button>
    </nav>

    <!-- Contenido -->
    <div class="form-container">
      <h2>Crear Usuario</h2>

      <input v-model="nombre" placeholder="Nombre" />
      <input v-model="email" placeholder="Correo" />
      <input v-model="password" type="password" placeholder="Contraseña" />

      <select v-model="rol" placeholder="Rol">
        <option value="ADMIN">ADMIN</option>
        <option value="VENDEDOR">VENDEDOR</option>
        <option value="SUPERVISOR">SUPERVISOR</option>
      </select>

      <button @click="crearUsuario">
        Crear Usuario
      </button>
    </div>

  </div>
</template>

<style scoped>

/* Estructura general */
.page {
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  width: 100%;
  padding: 15px 30px;
  background-color: #2c3e50;
  display: flex;
  align-items: center;
}

/* Botón volver */
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

.btn-volver:hover {
  background-color: #369f6e;
}

/* Contenedor del formulario */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 420px;
  margin: 40px auto;
}

/* Inputs y select */
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

/* Botón guardar */
button {
  padding: 14px;
  border-radius: 8px;
  border: none;
  background-color: #42b983;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background-color: #369f6e;
}

</style>