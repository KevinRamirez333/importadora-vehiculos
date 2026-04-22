<script setup lang="ts">
import api from '@/services/api'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const id_ingreso = Number(route.params.id)

const pais_origen = ref('')
const costo_dolares = ref(0)
const tasa_cambio = ref(0)

const guardar = async () => {
  try {
    await api.post('/importaciones', {
      id_ingreso,
      pais_origen: pais_origen.value,
      costo_dolares: costo_dolares.value,
      tipo_cambio: tasa_cambio.value,
    })
    alert('Importacion registrada correctamente')
    router.push({name:'importaciones'})
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error')
  }
}

//Calculo en tiempo real
const totalQ = () => costo_dolares.value * tasa_cambio.value
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Registrar importacion</h2>
    <div class="card p-4">
      
      <div class="mb-3">
        <label class="mb-3">ID Ingreso</label>
        <input type="number" :value="id_ingreso" class="form-control" disabled>
      </div>
      <div class="mb-3">
        <label class="form-label">País de origen</label>
        <input v-model="pais_origen" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Precio en dólares</label>
        <input type="number" v-model="costo_dolares" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Tasa de cambio</label>
        <input type="number" v-model="tasa_cambio" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Total en quetzales</label>
        <input type="number" :value="totalQ()" class="form-control" disabled />
      </div>
      <button class="btn btn-success" @click="guardar">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push({name:'importaciones'})">Volver</button>
    </div>
  </div>
</template>
