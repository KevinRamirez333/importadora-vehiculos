<script setup lang="ts">
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const vin = ref('')
const tipo_costo = ref('')
const descripcion = ref('')
const monto = ref(0)
const fecha = ref('')
const vehiculos = ref<any[]>([])
const vinBusqueda = ref('')

const cargar = async () => {
  try {
    const res = await api.get('/vehiculos')
    vehiculos.value = res.data
  } catch (error: any) {
    alert(error.response?.data?.message)
  }
}
const crear = async () => {
  try {
    await api.post('/vehiculo-costos', {
      vin:vin.value,
      tipo_costo: tipo_costo.value,
      descripcion: descripcion.value,
      monto: monto.value,
      fecha: fecha.value,
    })
    alert('Costo creado correctamente')
    tipo_costo.value = ''
    descripcion.value = ''
    monto.value = 0
    fecha.value = ''
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al crear el costo')
  }
}
const buscarPorId = async () => {
  try {
    const result = await api.get(`/vehiculos/${vinBusqueda.value}`)
    const data = result.data

    vin.value = data.vin
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al buscar el ID')
  }
}
onMounted(cargar)
</script>
<template>
  <div class="container mt-4">
    <h2>Registrar costos</h2>
    <div class="card p-4">
      <div class="mb-3 d-flex gap-2">
        <label>VIN</label>
        <select v-model="vin" class="form-select">
          <option value="">Seleccione vehículo</option>
          <option v-for="v in vehiculos" :key="v.vin" :value="v.vin">
            {{ v.vin }}-{{ v.modelo }}
          </option>
        </select>
        <input type="text" placeholder="Buscar por ID" v-model="vinBusqueda" class="form-control" />
        <button class="btn btn-primary" @click="buscarPorId()">Buscar</button>
      </div>
      <div class="mb-3">
        <label>Tipo de Costo</label>
        <select v-model="tipo_costo" class="form-select">
          <option value="TRASPASO">TRASPASO</option>
          <option value="TALLER">TALLER</option>
          <option value="IMPUESTO">IMPUESTO</option>
          <option value="PLACAS">PLACAS</option>
          <option value="TRAMITES">TRAMITES</option>
          <option value="OTRO">OTRO</option>
        </select>
      </div>
      <div class="mb-3">
        <label>Descripcion</label>
        <input type="text" v-model="descripcion" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Monto</label>
        <input type="number" v-model="monto" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Fecha</label>
        <input type="date" class="form-control" v-model="fecha" />
      </div>
      <button class="btn btn-success" @click="crear()">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push('/vehiculo-costos')">
        Volver
      </button>
    </div>
  </div>
</template>
