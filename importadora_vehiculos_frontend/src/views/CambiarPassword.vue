<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import {jwtDecode} from "jwt-decode"


const router = useRouter()

const passwordActual = ref('')
const nuevaPassword = ref('')
const confirmarPassword = ref('')

//Obtener el ID del usuario desde el token para usarlo en la ruta de cambio de contraseña
const token = localStorage.getItem("token")

let userId = null

if (token) {
  const decoded: any = jwtDecode(token)
  userId = decoded.id_usuario
}

const cambiarPassword = async () => {
  if (!passwordActual.value || !nuevaPassword.value || !confirmarPassword.value) {
    alert('Todos los campos son obligatorios')
    return
  }

  if (nuevaPassword.value !== confirmarPassword.value) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    await axios.patch(`http://localhost:3000/usuarios/cambiar/password/${userId}`, {
      currentPassword: passwordActual.value,
      newPassword: nuevaPassword.value,
    })

    alert('Contraseña actualizada correctamente')

    passwordActual.value = ''
    nuevaPassword.value = ''
    confirmarPassword.value = ''

    router.push('/dashboard')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error cambiando contraseña')
  }
}
</script>

<template>
  <div class="page">
    <nav class="navbar">
      <button class="btn-volver" @click="router.push('/dashboard')">← Volver al dashboard</button>
    </nav>
    <br>
    <div class="form-container">
      <h2>Cambiar contraseña</h2>

      <input type="password" v-model="passwordActual" placeholder="Contraseña actual" />

      <input type="password" v-model="nuevaPassword" placeholder="Nueva contraseña" />

      <input type="password" v-model="confirmarPassword" placeholder="Confirmar nueva contraseña" />

      <button @click="cambiarPassword">Cambiar contraseña</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.navbar {
  width: 100%;
  padding: 15px 30px;
  background: #2c3e50;
}

.btn-volver {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 420px;
  margin: 40px auto;
}

input {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  font-size: 15px;
}

button {
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #369f6e;
}
</style>
