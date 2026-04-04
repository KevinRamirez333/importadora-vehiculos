<script setup lang="ts">
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { routeLocationKey, useRouter } from 'vue-router'

const router = useRouter()

const costos = ref<any[]>([])
const tipoBusqueda = ref<'id' | 'vin'>('id')
const idBusqueda = ref('')

const cargar = async () => {
  const res = await api.get('/vehiculo-costos')
  costos.value = res.data
}
const buscar = async () => {
  try {
    let res
    if (tipoBusqueda.value == 'id') {
      res = await api.get(`/vehiculo-costos/${idBusqueda.value}`)
      costos.value = [res.data]
    } else {
      res = await api.get(`/vehiculo-costos/vin/${idBusqueda.value}`)
      costos.value = res.data
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al buscar por ID')
  }
}

const activar =async(id:number)=>{
  try{
    if(!confirm("¿Desea activar este costo?")) return
    await api.post(`/vehiculo-costos/activar/${id}`)
    cargar()

  } catch(error:any){
    alert(error.response?.data?.message||'Error al activar este costo')

  }
}
const anular = async(id:number)=>{
  try{
    if(!confirm('¿Desea anular este costo?')) return
    await api.post(`/vehiculo-costos/anular/${id}`)
    cargar()
  }catch(error:any){
    alert(error.response?.data?.message)
  }
}

const limpiar = async () => {
  idBusqueda.value = ''
  cargar()
}
onMounted(cargar)
</script>

<template>
  <nav class="navbar navbar-dark bg-dark px-3 mb-4">
    <button class="btn btn-outline-light" @click="router.push('/dashboard')">←Volver</button>
  </nav>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de costo de vehiculos</h2>
      <button class="btn btn-primary" @click="router.push('/vehiculo-costos/crear')">Crear</button>
    </div>
    <div class="mb-3 d-flex gap-2">
      <select v-model="tipoBusqueda" class="form-select w-auto">
        <option value="id">Buscar por ID Costo</option>
        <option value="vin">Buscar por VIN</option>
      </select>
      <input
        type="text"
        class="form-control"
        v-model="idBusqueda"
        placeholder="Ingrese valor de busqueda"
      />
      <button class="btn btn-success" @click="buscar()">Buscar</button>
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
          <td>{{ c.fecha }}</td>
          <td>
            <span class="badge" :class="c.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'">
              {{ c.estado }}
            </span>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="router.push(`/vehiculo-costos/editar/${c.id_costo}`)">Editar</button>
            <button v-if="c.estado === 'ANULADO'" class="btn btn-success btn-sm" @click="activar(c.id_costo)">Activar</button>
            <button v-else class="btn btn-danger btn-sm " @click="anular(c.id_costo)">Anular</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
