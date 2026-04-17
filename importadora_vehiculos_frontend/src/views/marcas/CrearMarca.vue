<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const nombre = ref('')

const crearMarca = async () => {
  try {
    await api.post('/marcas', {
      nombre: nombre.value,
    })

    alert('Marca creada')
    nombre.value = ''
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error')
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Crear Marca</h2>

    <div class="card p-4 shadow-sm">
      <div class="mb-3">
        <label class="form-label">Nombre de la Marca</label>
        <input v-model="nombre" class="form-control" placeholder="Ej: Toyota" />
      </div>

      <button class="btn btn-success" @click="crearMarca">Guardar</button>

      <button class="btn btn-secondary mt-2" @click="router.push({name: 'marcas'})">Volver</button>
    </div>
  </div>
</template>
