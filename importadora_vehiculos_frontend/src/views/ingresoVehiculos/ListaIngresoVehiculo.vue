<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const ingresos = ref<any[]>([])

const id = ref('')
//Busqueda de ingreso de vehiculo por id
const BuscarPorId = async () => {
  try{
  const res = await api.get(`/ingresos/${id.value}`)
  ingresos.value = [res.data]  
  }catch(error:any){
    if (error.response) {
      alert('No existe una ingreso con ese ID')
    } else {
      alert('Ocurrió un error al buscar')
    }
  }

}


//Cargar ingresos de vehiculos
const cargar = async () => {
  const res = await api.get('/ingresos')
  ingresos.value = res.data
}

//Acceder a vista editar ingresos
const editar = (id: number) => {
  router.push(`/ingresosVehiculos/editar/${id}`)
}

const anular = async (id: number) => {
  if (!confirm('¿Seguro que deseas anular este ingreso?')) return

  try {
    await api.post(`/ingresos/anular/${id}`)
    cargar()
  } catch {
    alert('Error al anular')
  }
}
const activar = async (id: number) => {
  if (!confirm('¿Reactivar ingreso?')) return
  try {
    await api.post(`/ingresos/activar/${id}`)
    cargar()
  } catch {
    alert('Error al activar')
  }
}

function formatearFecha(fecha: any) {
  const [anio, mes, dia] = fecha.split('T')[0].split('-')
  return `${dia}/${mes}/${anio}`
}

const limpiar = async () => {
  id.value = ''
  cargar()
}

onMounted(cargar)
</script>

<template>
  <nav class="navbar navbar-dark bg-dark px-3 mb-4">
    <button class="btn btn-outline-light" @click="router.push('/dashboard')">← Volver</button>
  </nav>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Ingreso de Vehículos</h2>

      <button class="btn btn-primary" @click="router.push('/ingresosVehiculos/crear')">
        Nuevo ingreso
      </button>
    </div>
    <div class="mb-3 d-flex gap-2">
      
        <input type="text" v-model="id" class="form-control" placeholder="Buscar por ID" />
        <button class="btn btn-success" @click="BuscarPorId">Buscar</button>
        <button class="btn btn-warning" @click="limpiar">Limpiar</button>
      
    </div>
    <table class="table table-bordered text-center">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>VIN</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Valor</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in ingresos" :key="i.id_ingreso">
          <td>{{ i.id_ingreso }}</td>
          <td>{{ i.vin }}</td>
          <td>{{ i.tipo_ingreso }}</td>
          <td>{{ formatearFecha(i.fecha) }}</td>
          <td>{{ i.cliente }}</td>
          <td>
            {{
              Number(i.valor_ingreso).toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }}
          </td>
          <td>
            <span class="badge" :class="i.estado_ingreso === 'ACTIVO' ? 'bg-success' : 'bg-danger'">
              {{ i.estado_ingreso }}
            </span>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editar(i.id_ingreso)">
              Editar
            </button>

            <!-- Si está activo -->
            <button
              v-if="i.estado_ingreso === 'ACTIVO'"
              class="btn btn-danger btn-sm"
              @click="anular(i.id_ingreso)"
            >
              Anular
            </button>

            <!-- Si está anulado -->
            <button v-else class="btn btn-success btn-sm" @click="activar(i.id_ingreso)">
              Activar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
