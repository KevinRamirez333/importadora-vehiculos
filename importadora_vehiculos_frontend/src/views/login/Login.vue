<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    console.log(import.meta.env.VITE_API_URL)
    const response = await api.post(
      '/usuarios/login',
      {
        email: email.value,
        password: password.value
      }
    )

    localStorage.setItem('token', response.data.token)

    router.push('/dashboard/inicio')

  } catch (error) {
    alert('Credenciales incorrectas')
  }
}
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/importadora_vehiculos.jpeg"
      width="200"
      height="200"
    />

    <div class="wrapper">
      <h1 >Importadora de Vehículos</h1>

 
    </div>
  </header>
  <div>
    <h2>Login</h2>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Ingresar</button>
  </div>
</template>

<style scoped>
/* Contenedor del login */
div {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 420px;        /* Más ancho */
  margin: 40px auto;
}

/* Inputs más grandes */
input {
  padding: 15px 18px;  /* Más altos */
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  font-size: 16px;     /* Texto más grande */
  width: 100%;         /* Que ocupen todo el contenedor */
  transition: all 0.3s ease;
  outline: none;
}

/* Efecto focus */
input:focus {
  border-color: #42b983;
  box-shadow: 0 0 8px rgba(66, 185, 131, 0.3);
}

/* Botón más grande */
button {
  padding: 15px;
  border-radius: 10px;
  border: none;
  background-color: #42b983;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background-color: #369f6e;
}

button:active {
  transform: scale(0.98);
}
.logo {
  display: block;
  margin: 0 auto 20px auto;
}
h1{
  text-align: center;
}
</style>