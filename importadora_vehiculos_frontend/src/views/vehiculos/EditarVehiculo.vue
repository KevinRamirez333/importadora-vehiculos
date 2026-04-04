<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api'

const router = useRouter()
const route = useRoute()

const vinParam = route.params.vin as string

// FORM
const vin = ref('')
const placa = ref('')
const anio = ref<number | null>(null)
const color = ref('')
const id_marca = ref<number | null>(null)
const id_estado = ref<number | null>(null)
const id_modelo = ref<number | null>(null)

// LISTAS
const marcas = ref<any[]>([])
const estados = ref<any[]>([])
const modelos = ref<any[]>([])

//  Cargar datos iniciales
const cargarMarcas = async () => {
  const res = await api.get('/marcas')
  marcas.value = res.data
}

const cargarEstados = async () => {
  const res = await api.get('/estados')
  estados.value = res.data
}

const cargarModelos = async () => {
  if (!id_marca.value) return

  const res = await api.get(`/modelos/marca/${id_marca.value}`)

  modelos.value = res.data
}

// cuando cambia marca
watch(id_marca, () => {
  id_modelo.value = null
  cargarModelos()
})

//  cargar vehículo
const cargarVehiculo = async () => {
  const res = await api.get(`/vehiculos/${vinParam}`)

  const data = res.data

  vin.value = data.vin
  placa.value = data.placa
  anio.value = data.anio
  color.value = data.color

  // primero marca
  id_marca.value = data.id_marca

  //carga modelos
  await cargarModelos()

  //ahora sí modelo
  id_modelo.value = data.id_modelo

  id_estado.value = data.id_estado
}

//  guardar cambios
const actualizar = async () => {
  try {
    const payload = {
      placa: placa.value,
      anio: anio.value,
      color: color.value,
      id_marca: id_marca.value,
      id_estado: id_estado.value,
      id_modelo: id_modelo.value,
    }

    await api.put(`/vehiculos/${vinParam}`, payload)

    alert('Vehículo actualizado')

    router.push('/vehiculos')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al actualizar')
  }
}

onMounted(async () => {
  await cargarMarcas()
  await cargarEstados()
  await cargarVehiculo()
})
</script>

<template>
  <nav class="navbar">
    <button @click="router.push('/vehiculos')">← Volver</button>
  </nav>
  <div class="page">
    <div class="form-container">
      <h2>Editar Vehículo</h2>

      <!-- VIN -->
      <div class="campo">
        <label>VIN</label>
        <input v-model="vin" disabled />
      </div>

      <!-- Placa -->
      <div class="campo">
        <label>Placa</label>
        <input v-model="placa" />
      </div>

      <!-- Año -->
      <div class="campo">
        <label>Año</label>
        <input type="number" v-model="anio" />
      </div>

      <!-- Color -->
      <div class="campo">
        <label>Color</label>
        <input v-model="color" />
      </div>

      <!-- Marca -->
      <div class="campo">
        <label>Marca</label>
        <select v-model="id_marca">
          <option v-for="m in marcas" :key="m.id_marca" :value="m.id_marca">
            {{ m.nombre }}
          </option>
        </select>
      </div>

      <!-- Modelo -->
      <div class="campo">
        <label>Modelo</label>
        <select v-model="id_modelo">
          <option v-for="mo in modelos" :key="mo.id_modelo" :value="mo.id_modelo">
            {{ mo.nombre }}
          </option>
        </select>
      </div>

      <!-- Estado -->
      <div class="campo">
        <label>Estado</label>
        <select v-model="id_estado">
          <option v-for="e in estados" :key="e.id_estado" :value="e.id_estado">
            {{ e.nombre }}
          </option>
        </select>
      </div>

      <button @click="actualizar">Guardar Cambios</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 420px;
  margin: auto;
  margin-top: 40px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.campo {
  display: flex;
  flex-direction: column;
}

input,
select {
  padding: 10px;
}

button {
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
