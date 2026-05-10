<script setup lang="ts">
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const costos = ref<any[]>([])
const costosOriginal = ref([])
const textoBusqueda = ref('')
const tipoBusqueda = ref<'id' | 'vin'>('id')
const idBusqueda = ref('')

const cargar = async () => {
  try{
const res = await api.get('/vehiculo-costos')
  costos.value = res.data
  costosOriginal.value = res.data
  }catch(error){
    alert('Error al cargar costos de vehículos')
  }
  
}
const filtrar = () => {
    const texto = textoBusqueda.value.toLowerCase().trim()

  costos.value = costosOriginal.value.filter((c:any) => {
    const vin = c.vin?.toLowerCase() || ''
    const tipoCosto = c.tipo_costo?.toLowerCase()|| ''
    const descripcion = c.descripcion?.toLowerCase() || ''
    const estado = c.estado?.toLowerCase() || ''
    const fecha = c.fecha ? formatearFecha(c.fecha).toLowerCase() : ''
    const id = c.id_costo?.toString() || ''
    const monto = c.monto?.toString() || ''

    return (
      vin.includes(texto) ||
      tipoCosto.includes(texto) ||
      descripcion.includes(texto) ||
      estado.includes(texto) ||
      fecha.includes(texto) ||
      id.includes(texto) ||
      monto.includes(texto)
    )
  })
}


const activar = async (id: number) => {
  try {
    if (!confirm('¿Desea activar este costo?')) return
    await api.post(`/vehiculo-costos/activar/${id}`)
    cargar()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al activar este costo')
  }
}
const anular = async (id: number) => {
  try {
    if (!confirm('¿Desea anular este costo?')) return
    await api.post(`/vehiculo-costos/anular/${id}`)
    cargar()
  } catch (error: any) {
    alert(error.response?.data?.message)
  }
}

const limpiar = async () => {
  idBusqueda.value = ''
  cargar()
}

const formatearFecha = (fecha: string) => {
  return fecha.split('T')[0]?.split('-').reverse().join('/')||''
}
onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de costo de vehículos</h2>
      <button class="btn btn-primary" @click="router.push({ name: 'crear-vehiculo-costo' })">
        Crear
      </button>
    </div>
    <div class="mb-3 d-flex gap-2">

      <input
        type="text"
        class="form-control"
        v-model="textoBusqueda"
        placeholder="Ingrese valor de busqueda"
      />
      <button class="btn btn-success" @click="filtrar()">Buscar</button>
      <button class="btn btn-warning" @click="limpiar()">Limpiar</button>
    </div>

    <table class="table table-bordered table-hover text-center">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>VIN</th>
          <th>Tipo costo</th>
          <th>Descripcion</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in costos" :key="c.id_costo">
          <td>{{ c.id_costo }}</td>
          <td>{{ c.vin }}</td>
          <td>{{ c.tipo_costo }}</td>
          <td>{{ c.descripcion }}</td>
          <td>{{ c.monto }}</td>
          <td>{{ formatearFecha(c.fecha) }}</td>
          <td>
            <span class="badge" :class="c.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'">
              {{ c.estado }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-warning btn-sm me-2"
              @click="router.push({ name: 'editar-vehiculo-costo', params: { id: c.id_costo } })"
            >
              Editar
            </button>
            <button
              v-if="c.estado === 'ANULADO'"
              class="btn btn-success btn-sm"
              @click="activar(c.id_costo)"
            >
              Activar
            </button>
            <button v-else class="btn btn-danger btn-sm" @click="anular(c.id_costo)">Anular</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
