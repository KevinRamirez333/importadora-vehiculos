<script setup lang="ts">
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const importaciones = ref<any[]>([])
const importacionesCopia = ref<any[]>([])
const id = ref('')
const textoBusqueda = ref('')

const cargar = async () => {
  try {
    const res = await api.get('/importaciones')
    importaciones.value = res.data
    importacionesCopia.value = res.data
  } catch (error) {
    alert('Error al cargar importaciones')
  }
}

const filtrar = () => {
  const texto = textoBusqueda.value.toLowerCase().trim()

  importaciones.value = importacionesCopia.value.filter((i: any) => {
    return (
      i.id_importacion.toString().includes(texto) ||
      i.vin.toLowerCase().includes(texto) ||
      i.pais_origen.toLowerCase().includes(texto) ||
      i.costo_dolares.toString().includes(texto) ||
      i.tipo_cambio.toString().includes(texto) ||
      i.estado.toLowerCase().includes(texto)
    )
  })
}
const editar = async (id: number) => {
  router.push({ name: 'editar-importacion', params: { id } })
}

const anular = async (id: number) => {
  if (!confirm('¿Desea anular esta importacion?')) return
  await api.post(`importaciones/anular/${id}`)
  cargar()
}
const activar = async (id: number) => {
  if (!confirm(`¿Desea activar esta importacion?`)) return
  await api.post(`importaciones/activar/${id}`)
  cargar()
}

const buscarPorId = async () => {
  try {
    const res = await api.get(`/importaciones/${id.value}`)
    importaciones.value = [res.data]
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      alert('No existe una importacion con ese ID')
    } else {
      alert('Ocurrió un error al buscar')
    }
    importaciones.value = []
  }
}
const Limpiar = () => {
  textoBusqueda.value = ''
  cargar()
}
onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de Importaciones</h2>
      <button class="btn btn-primary" @click="router.push({ name: 'crear-ingreso-vehiculo' })">
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
      <button class="btn btn-warning" @click="Limpiar()">Limpiar</button>
    </div>

    <table class="table table-bordered table-hover text-center">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>VIN</th>
          <th>País</th>
          <th>Costo</th>
          <th>Tasa cambio</th>

          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in importaciones" :key="i.id_importacion">
          <td>{{ i.id_importacion }}</td>
          <td>{{ i.vin }}</td>
          <td>{{ i.pais_origen }}</td>
          <td>{{ i.costo_dolares }}</td>
          <td>{{ i.tipo_cambio }}</td>
          <td>
            <span class="badge" :class="i.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'">
              {{ i.estado }}
            </span>
          </td>
          <td>
            <button class="btn btn-warning btn-sm me-2" @click="editar(i.id_importacion)">
              Editar
            </button>
            <button
              v-if="i.estado === 'ACTIVO'"
              class="btn btn-danger btn-sm"
              @click="anular(i.id_importacion)"
            >
              Anular
            </button>
            <button v-else class="btn btn-success btn-sm" @click="activar(i.id_importacion)">
              Activar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
