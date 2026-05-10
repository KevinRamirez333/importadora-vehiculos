<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import api from '@/services/api'
import { formatearFecha } from '@/helpers/formatearFecha'

const router = useRouter()
const ingresos = ref<any[]>([])
const ingresosCopia = ref<any[]>([])
const textoBusqueda = ref('')

const id = ref('')
//Busqueda de ingreso de vehiculo por id
const BuscarPorId = async () => {
  try {
    const res = await api.get(`/ingresos/${id.value}`)
    ingresos.value = [res.data]
  } catch (error: any) {
    if (error.response) {
      alert('No existe una ingreso con ese ID')
    } else {
      alert('Ocurrió un error al buscar')
    }
  }
}

//Cargar ingresos de vehiculos
const cargar = async () => {
  try{
const res = await api.get('/ingresos')
  ingresos.value = res.data
  ingresosCopia.value = res.data
  console.log(ingresos.value)
  } catch(error){
    alert('Error al cargar ingreso de vehículos')
  }
  
}
const filtrar = async () => {
  const texto = textoBusqueda.value.toLowerCase().trim()
  ingresos.value = ingresosCopia.value.filter((i: any) => {
    const cliente = i.id_cliente?.toLowerCase() || ''

    return (
      i.id_ingreso.toString().includes(texto) ||
      i.vin.toLowerCase().includes(texto) ||
      i.tipo_ingreso.toLowerCase().includes(texto) ||
      formatearFecha(i.fecha).toString().includes(texto) ||
      cliente.includes(texto) ||
      i.valor_ingreso.toString().includes(texto) ||
      i.estado_ingreso.toLowerCase().includes(texto)
    )
  })
}
//Acceder a vista editar ingresos
const editar = (id: number) => {
  router.push({ name: 'editar-ingreso-vehiculo', params: { id } })
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


const limpiar = async () => {
  textoBusqueda.value = ''
  cargar()
}

onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Ingreso de Vehículos</h2>

      <button class="btn btn-primary" @click="router.push({ name: 'crear-ingreso-vehiculo' })">
        Nuevo ingreso
      </button>
    </div>
    <div class="mb-3 d-flex gap-2">
      <input
        type="text"
        v-model="textoBusqueda"
        class="form-control"
        placeholder="Ingrese el valor de busqueda"
      />
      <button class="btn btn-success" @click="filtrar">Buscar</button>
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
