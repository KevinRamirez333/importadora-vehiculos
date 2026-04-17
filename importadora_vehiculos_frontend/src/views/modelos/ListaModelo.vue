<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const modelos = ref<any[]>([])
const marcas = ref<any[]>([])
const modelosCopia = ref<[]>([])


const editandoId = ref<number | null>(null)
const nombreEditado = ref('')
const marcaEditada = ref<number | null>(null)


const textoBusqueda = ref('')
const id = ref('')


const filtrar =()=>{
  const texto = textoBusqueda.value.toLowerCase().trim()
  
  modelos.value = modelosCopia.value.filter((m:any)=>{
    const estado= m.activo===1?'activo':'inactivo'

    return(
      m.id_modelo.toString().includes(texto)||
      m.nombre.toLowerCase().includes(texto)||
      m.marca.toLowerCase().includes(texto)||
      estado===texto
    )
  })
}
//buscar por id
const buscarPorId = async () => {
  try {

    const res = await api.get(`/modelos/${id.value}`)

    modelos.value = [res.data]
  } catch (error: any) {
    if (error.response) {
      alert('No existe ninguna marca con ese ID')
    }
  }
}
//Limpiar
const limpiar = () => {
  textoBusqueda.value = ''
  cargarModelos()
}
// cargar datos
const cargarModelos = async () => {
  const res = await api.get('/modelos')
  modelos.value = res.data
  modelosCopia.value=res.data
}

const cargarMarcas = async () => {
  const res = await api.get('/marcas')
  marcas.value = res.data
}

// editar
const editar = (m: any) => {
  editandoId.value = m.id_modelo
  nombreEditado.value = m.nombre
  marcaEditada.value = m.id_marca
}

// guardasr
const guardar = async (id: number) => {
  try{
await api.put(`/modelos/${id}`, {
    nombre: nombreEditado.value,
    id_marca: marcaEditada.value,
  })
  alert('Modelo actualizado')
  editandoId.value = null
  cargarModelos()
  } catch(error:any){
    alert(error.response?.data?.message || 'Error')
  }
  

}

// cancelar
const cancelar = () => {
  editandoId.value = null
}

// activar/desactivar
const desactivar = async (id: number) => {
  await api.post(`/modelos/desactivar/${id}`)

  await cargarModelos()

}

const activar = async (id: number) => {
  await api.post(`/modelos/activar/${id}`)
  await cargarModelos()
}

onMounted(async () => {
  await cargarModelos()
  await cargarMarcas()
})
</script>

<template>
 
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Modelos</h2>

      <button class="btn btn-primary" @click="router.push({name: 'crear-modelo'})">Nuevo Modelo</button>
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
          <th>Marca</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="m in modelos" :key="m.id_modelo">
          <td>{{ m.id_modelo }}</td>

          <!-- nombre -->
          <td>
            <input v-if="editandoId === m.id_modelo" v-model="nombreEditado" class="form-control" />
            <span v-else>{{ m.nombre }}</span>
          </td>

          <!-- marca -->
          <td>
            <select v-if="editandoId === m.id_modelo" v-model="marcaEditada" class="form-select">
              <option v-for="ma in marcas" :key="ma.id_marca" :value="ma.id_marca">
                {{ ma.nombre }}
              </option>
            </select>

            <span v-else>{{ m.marca }}</span>
          </td>

          <!-- estado -->
          <td>
            <span class="badge" :class="m.activo ? 'bg-success' : 'bg-danger'">
              {{ m.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>

          <!-- acciones -->
          <td>
            <button
              v-if="editandoId !== m.id_modelo"
              class="btn btn-warning btn-sm me-2"
              @click="editar(m)"
            >
              Editar
            </button>

            <template v-else>
              <button class="btn btn-success btn-sm me-2" @click="guardar(m.id_modelo)">
                Guardar
              </button>

              <button class="btn btn-secondary btn-sm me-2" @click="cancelar">Cancelar</button>
            </template>

            <button v-if="m.activo" class="btn btn-danger btn-sm" @click="desactivar(m.id_modelo)">
              Desactivar
            </button>

            <button v-else class="btn btn-success btn-sm" @click="activar(m.id_modelo)">
              Activar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
