<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await api.post('/usuarios/login', {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.token)

    router.push('/panel/inicio')
  } catch (err) {
    error.value = 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">

      <!-- Lado izquierdo (branding suave) -->
      <div class="col-md-6 d-none d-md-flex bg-dark-subtle text-dark justify-content-center align-items-center flex-column">

        <img
          src="@/assets/importadora_vehiculos.jpeg"
          alt="Logo"
          class="rounded mb-3 shadow-sm"
          width="140"
        />

        <h2 class="fw-bold">Importadora de Vehículos</h2>

        <p class="text-center px-4 text-muted">
          Sistema de gestión de inventario, ventas e importaciones
        </p>

      </div>

      <!-- Lado derecho -->
      <div class="col-md-6 d-flex justify-content-center align-items-center bg-light">

        <div class="card shadow border-0 p-4 w-100 bg-white" style="max-width: 380px;">

          <h4 class="mb-1 text-dark">Iniciar sesión</h4>
          <p class="text-muted mb-4">Accede al sistema</p>

          <div v-if="error" class="alert alert-danger py-2">
            {{ error }}
          </div>

          <div class="mb-3">
            <input
              v-model="email"
              type="email"
              class="form-control"
              placeholder="Correo electrónico"
            />
          </div>

          <div class="mb-3">
            <input
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Contraseña"
            />
          </div>

          <button
            class="btn btn-dark w-100"
            @click="login"
            :disabled="loading"
          >
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>

        </div>

      </div>

    </div>
  </div>
</template>