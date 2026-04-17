<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const marcas = ref<any[]>([])
const marcasCopia = ref<any[]>([])
const textoBusqueda = ref('')
const editandoId = ref<number | null>(null)
const nombreEditado = ref('')
//const id = ref('')

// cargar
const cargarMarcas = async () => {
  const res = await api.get('/marcas')
  marcas.value = res.data
  marcasCopia.value = res.data
}

const filtrar =()=>{
  const texto = textoBusqueda.value.toLowerCase().trim()

  marcas.value = marcasCopia.value.filter((m:any)=>{

    const estado=m.activo===1?'activo': 'inactivo'

    return(
      m.id_marca.toString().includes(texto)||
      m.nombre.toLowerCase().includes(texto)||
      estado===texto
    )
  })
}

/*
//Buscar por id
const buscarPorId = async () => {
  try {
    const res = await api.get(`/marcas/${id.value}`)

    marcas.value = [res.data]
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      alert('No existe una marca con ese ID')
    } else {
      alert('Ocurrió un error al buscar')
    }

    marcas.value = [] // opcional: limpiar resultados
  }
}*/
const limpiar = () => { 
  textoBusqueda.value = ''
  cargarMarcas()
}

// editar
const editar = (m: any) => {
  editandoId.value = m.id_marca
  nombreEditado.value = m.nombre
}

// guardar
const guardar = async (id: number) => {
  await api.put(`/marcas/${id}`, {
    nombre: nombreEditado.value,
  })

  editandoId.value = null
  cargarMarcas()
}

// cancelar
const cancelar = () => {
  editandoId.value = null
}

// activar/desactivar
const desactivar = async (id: number) => {
  await api.post(`/marcas/desactivar/${id}`)
  cargarMarcas()
}

const activar = async (id: number) => {
  await api.post(`/marcas/activar/${id}`)
  cargarMarcas()
}

onMounted(cargarMarcas)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Listado de Marcas</h2>

      <button class="btn btn-primary" @click="router.push({name: 'crear-marca'})">Nueva Marca</button>
    </div>
    <div class="mb-3 d-flex gap-2">
      <input type="text" v-model="textoBusqueda" placeholder="Ingrese el valor de busqueda" />
      <button class="btn btn-success" @click="filtrar">Buscar</button>
      <button class="btn btn-warning" @click="limpiar">Limpiar</button>
    </div>

    <table class="table table-bordered table-hover text-center">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="m in marcas" :key="m.id_marca">
          <td>{{ m.id_marca }}</td>

          <!-- EDIT INLINE -->
          <td>
            <input v-if="editandoId === m.id_marca" v-model="nombreEditado" class="form-control" />
            <span v-else>{{ m.nombre }}</span>
          </td>

          <td>
            <span class="badge" :class="m.activo ? 'bg-success' : 'bg-danger'">
              {{ m.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>

          <td>
            <!-- editar -->
            <button
              v-if="editandoId !== m.id_marca"
              class="btn btn-warning btn-sm me-2"
              @click="editar(m)"
            >
              Editar
            </button>

            <!-- guardar -->
            <button
              v-if="editandoId === m.id_marca"
              class="btn btn-success btn-sm me-2"
              @click="guardar(m.id_marca)"
            >
              Guardar
            </button>

            <!-- cancelar -->
            <button
              v-if="editandoId === m.id_marca"
              class="btn btn-secondary btn-sm me-2"
              @click="cancelar"
            >
              Cancelar
            </button>

            <!-- activar/desactivar -->
            <button v-if="m.activo" class="btn btn-danger btn-sm" @click="desactivar(m.id_marca)">
              Desactivar
            </button>

            <button v-else class="btn btn-success btn-sm" @click="activar(m.id_marca)">
              Activar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
body {
  margin: 0;
}

.navbar {
  position: relative;
  z-index: 1;
}
</style>
