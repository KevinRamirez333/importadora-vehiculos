<script setup lang="ts">
import { ref, onMounted,type Ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { formatearFecha } from '@/helpers/formatearFecha'
import AlertaBase from '@/components/alertas/AlertaBase.vue'
import ConfirmacionBase from '@/components/alertas/ConfirmacionBase.vue'

const router = useRouter()
const ingresos = ref<any[]>([])
const ingresosCopia = ref<any[]>([])
const textoBusqueda = ref('')
const id = ref('')

const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('error')


//Busqueda de ingreso de vehiculo por id
const BuscarPorId = async () => {
  try {
    const res = await api.get(`/ingresos/${id.value}`)
    ingresos.value = [res.data]
  } catch (error: any) {
    alertaTitulo.value = 'Error'
    if (error.response) {
      alertaMensaje.value = 'No existe una ingreso con ese ID'
    } else {
      alertaMensaje.value = 'Ocurrió un error al buscar'
    }
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

//Cargar ingresos de vehiculos
const cargar = async () => {
  try {
    const res = await api.get('/ingresos')
    ingresos.value = res.data
    ingresosCopia.value = res.data
    console.log(ingresos.value)
  } catch (error) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = 'Error al cargar ingreso de vehículos'
    alertaTipo.value = 'error'
    alertaVisible.value = true
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
const anular = (id: number) => {
  mostrarConfirmacion(
    '¿Seguro que deseas anular este ingreso?',
    'Confirmar anulación',
    async () => {
      try {
        await api.post(`/ingresos/anular/${id}`)
        alertaTitulo.value = 'Éxito'
        alertaMensaje.value = 'Ingreso anulado correctamente'
        alertaTipo.value = 'success'
        alertaVisible.value = true
        cargar()
      } catch {
        alertaTitulo.value = 'Error'
        alertaMensaje.value = 'Error al anular'
        alertaTipo.value = 'error'
        alertaVisible.value = true
      }
    },
  )
}

const activar = (id: number) => {
  mostrarConfirmacion('¿Reactivar ingreso?', 'Confirmar activación', async () => {
    try {
      await api.post(`/ingresos/activar/${id}`)
      alertaTitulo.value = 'Éxito'
      alertaMensaje.value = 'Ingreso activado correctamente'
      alertaTipo.value = 'success'
      alertaVisible.value = true
      cargar()
    } catch {
      alertaTitulo.value = 'Error'
      alertaMensaje.value = 'Error al activar'
      alertaTipo.value = 'error'
      alertaVisible.value = true
    }
  })
}

const limpiar = async () => {
  textoBusqueda.value = ''
  cargar()
}

onMounted(cargar)
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
        if (confirmacionAccion) await confirmacionAccion()
      }
    "
  />
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
