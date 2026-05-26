<script setup lang="ts">
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AlertaBase from '@/components/alertas/AlertaBase.vue'
import ConfirmacionBase from '@/components/alertas/ConfirmacionBase.vue'

const router = useRouter()

const clientes = ref<any[]>([])
const opcion = ref<'ID' | 'NIT' | 'DPI'>('ID')
const idBusqueda = ref('')
const textoBusqueda = ref('')
const clientesCopia = ref<any[]>([])

const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('success')

const cargarClientes = async () => {
  try {
    const res = await api.get('/clientes')
    clientes.value = res.data
    clientesCopia.value = res.data
  } catch (error) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = 'Error al cargar clientes'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

const filtrar = () => {
  const texto = textoBusqueda.value.toLowerCase().trim()
  clientes.value = clientesCopia.value.filter((c: any) => {
    const estado = c.estado ? 'activo' : 'inactivo'
    return (
      c.id_cliente.toString().includes(texto) ||
      c.nombre.toLowerCase().includes(texto) ||
      c.apellido.toLowerCase().includes(texto) ||
      c.nit.toLowerCase().includes(texto) ||
      c.dpi.toLowerCase().includes(texto) ||
      c.telefono.toLowerCase().includes(texto) ||
      c.direccion.toLowerCase().includes(texto) ||
      estado === texto
    )
  })
}

const buscar = async () => {
  try {
    let res
    if (opcion.value == 'ID') {
      res = await api.get(`/clientes/${idBusqueda.value}`)
      clientes.value = [res.data]
    } else if (opcion.value == 'NIT') {
      res = await api.get(`/clientes/nit/${idBusqueda.value}`)
      clientes.value = [res.data]
    } else {
      res = await api.get(`/clientes/dpi/${idBusqueda.value}`)
      clientes.value = [res.data]
    }
  } catch (error: any) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = error.response?.data?.message || 'Error al buscar el cliente'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

const confirmacionVisible = ref(false)
const confirmacionMensaje = ref('')
const confirmacionTitulo = ref('')
let confirmacionAccion: (() => Promise<void>) | null = null as (() => Promise<void>) | null

const mostrarConfirmacion = (mensaje: string, titulo: string, accion: () => Promise<void>) => {
  confirmacionMensaje.value = mensaje
  confirmacionTitulo.value = titulo
  confirmacionAccion = accion
  confirmacionVisible.value = true
}

const desactivar = (id: number) => {
  mostrarConfirmacion('¿Desea desactivar este cliente?', 'Confirmar desactivación', async () => {
    try {
      await api.post(`/clientes/desactivar/${id}`)
      alertaTitulo.value = 'Éxito'
      alertaMensaje.value = 'Cliente desactivado correctamente'
      alertaTipo.value = 'success'
      alertaVisible.value = true
      cargarClientes()
    } catch (error: any) {
      alertaTitulo.value = 'Error'
      alertaMensaje.value = error.response?.data?.message || 'Error al desactivar el cliente'
      alertaTipo.value = 'error'
      alertaVisible.value = true
    }
  })
}

const activar = (id: number) => {
  mostrarConfirmacion('¿Desea activar este cliente?', 'Confirmar activación', async () => {
    try {
      await api.post(`/clientes/activar/${id}`)
      alertaTitulo.value = 'Éxito'
      alertaMensaje.value = 'Cliente activado correctamente'
      alertaTipo.value = 'success'
      alertaVisible.value = true
      cargarClientes()
    } catch (error: any) {
      alertaTitulo.value = 'Error'
      alertaMensaje.value = error.response?.data?.message || 'Error al activar el cliente'
      alertaTipo.value = 'error'
      alertaVisible.value = true
    }
  })
}

const limpiar = () => {
  textoBusqueda.value = ''
  cargarClientes()
}

const verCompras = (id_cliente: number) => {
  router.push({ name: 'compras-cliente', params: { id: id_cliente } })
}
onMounted(cargarClientes)
</script>

<template>
  <AlertaBase
    :visible="alertaVisible"
    :titulo="alertaTitulo"
    :mensaje="alertaMensaje"
    :tipo="alertaTipo"
    @close="alertaVisible = false"
  />
  <ConfirmacionBase
    :visible="confirmacionVisible"
    :titulo="confirmacionTitulo"
    :mensaje="confirmacionMensaje"
    @cancel="confirmacionVisible = false"
    @confirm="
      async () => {
        confirmacionVisible = false
        if (confirmacionAccion) await confirmacionAccion?.()
      }
    "
  />
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de Clientes</h2>
      <button class="btn btn-primary" @click="router.push({ name: 'crear-cliente' })">Crear</button>
    </div>
    <div class="mb-3 d-flex gap-2">
      <input
        type="text"
        v-model="textoBusqueda"
        placeholder="Ingrese valor de busqueda"
        class="form-control"
      />
      <button class="btn btn-success" @click="filtrar">Buscar</button>
      <button class="btn btn-warning" @click="limpiar()">Limpiar</button>
    </div>
    <table class="table table-bordered table-hover text-center">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Nit</th>
          <th>DPI</th>
          <th>Telefono</th>
          <th>Dirección</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clientes" :key="c.id_cliente">
          <td>{{ c.id_cliente }}</td>
          <td>{{ c.nombre }}</td>
          <td>{{ c.apellido }}</td>
          <td>{{ c.nit }}</td>
          <td>{{ c.dpi }}</td>
          <td>{{ c.telefono }}</td>
          <td>{{ c.direccion }}</td>
          <td>
            <span class="badge" :class="c.estado ? 'bg-success' : 'bg-danger'">
              {{ c.estado ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-warning btn-sm me-2"
              @click="router.push({ name: 'editar-cliente', params: { id: c.id_cliente } })"
            >
              Editar
            </button>

            <button
              v-if="c.estado"
              class="btn btn-danger btn-sm me-2"
              @click="desactivar(c.id_cliente)"
            >
              Desactivar
            </button>
            <button v-else class="btn btn-success btn-sm me-2" @click="activar(c.id_cliente)">
              Activar
            </button>
            <button class="btn btn-secondary btn-sm " @click="verCompras(c.id_cliente)">
              Ver compras
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
