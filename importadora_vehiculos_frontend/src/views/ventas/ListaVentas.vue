<script setup lang="ts">
import { formatearFecha } from '@/helpers/formatearFecha'
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AlertaBase from '@/components/alertas/AlertaBase.vue'
import ConfirmacionBase from '@/components/alertas/ConfirmacionBase.vue'
// Estado para confirmación de comprobante
const confirmacionVisible = ref(false)
const ventaAComprobar = ref<string | null>(null)
const nombreClienteAComprobar = ref<string | undefined>(undefined)

const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('success')

const router = useRouter()
const ventas = ref<any[]>([])
const textoBusqueda = ref('')
const ventasCopia = ref<any[]>([])

const cargar = async () => {
  try {
    const res = await api.get('/ventas')
    ventas.value = res.data
    ventasCopia.value = res.data
  } catch (error: any) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = error.response?.data?.message || 'Error al cargar ventas'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

const anular = async (id: string) => {
  try {
    if (!confirm('Desea anular esta venta')) return
    await api.post(`/ventas/anular/${id}`)
    alertaTitulo.value = 'Éxito'
    alertaMensaje.value = 'Venta anulada correctamente'
    alertaTipo.value = 'success'
    alertaVisible.value = true
    cargar()
  } catch (error) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = 'Error al anular venta'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

const solicitarConfirmacionComprobante = (id_venta: string, nombreCliente?: string) => {
  ventaAComprobar.value = id_venta
  nombreClienteAComprobar.value = nombreCliente
  confirmacionVisible.value = true
}

const GenerarComprobante = async () => {
  if (!ventaAComprobar.value) return
  try {
    const response = await api.get(`/ventas/comprobante/${ventaAComprobar.value}`, {
      responseType: 'blob',
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // Obtener nombre desde backend
    const disposition = response.headers['content-disposition']
    let filename = ''
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/)
      if (match?.[1]) {
        filename = match[1]
      }
    }
    if (!filename && nombreClienteAComprobar.value) {
      filename = `${nombreClienteAComprobar.value.replace(/\s+/g, '_')}_Comprobante.pdf`
    }
    if (!filename) filename = 'comprobante.pdf'
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    confirmacionVisible.value = false
    ventaAComprobar.value = null
    nombreClienteAComprobar.value = undefined
  } catch (error) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = 'Error al generar comprobante'
    alertaTipo.value = 'error'
    alertaVisible.value = true
    confirmacionVisible.value = false
    ventaAComprobar.value = null
    nombreClienteAComprobar.value = undefined
  }
}

const filtrar = () => {
  try {
    const texto = textoBusqueda.value.toLowerCase().trim()
    ventas.value = ventasCopia.value.filter((v: any) => {
      const fecha = formatearFecha(v.fecha)
      return (
        v.id_venta?.toString().includes(texto) ||
        fecha?.toString().includes(texto) ||
        v.vin?.toLowerCase().includes(texto) ||
        v.id_cliente?.toString().includes(texto) ||
        v.nombre?.toLowerCase().includes(texto) ||
        v.tipo_pago?.toLowerCase().includes(texto) ||
        (v.cuotas ?? '').toString().toLowerCase().includes(texto) ||
        (v.enganche ?? '').toString().toLowerCase().includes(texto) ||
        (v.saldo_financiado ?? '').toString().toLowerCase().includes(texto) ||
        (v.precio_venta ?? '').toString().toLowerCase().includes(texto) ||
        v.estado?.toLowerCase().includes(texto)
      )
    })
  } catch (error) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = 'Error al filtrar'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}
const limpiar = async () => {
  textoBusqueda.value = ''
  await cargar()
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
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de Ventas</h2>
      <button class="btn btn-primary" @click="router.push({ name: 'crear-venta' })">Crear</button>
    </div>
    <div class="mb-3 d-flex gap-2">
      <input
        type="text"
        class="form-control"
        placeholder="Ingrese el valor de busqueda"
        v-model="textoBusqueda"
      />
      <button class="btn btn-success" @click="filtrar()">Buscar</button>
      <button class="btn btn-warning" @click="limpiar()">Limpiar</button>
    </div>
    <table class="table table-bordered text-center">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>VIN</th>
          <th>ID Cliente</th>
          <th>Nombre cliente</th>
          <th>Tipo Pago</th>
          <th>Cuotas</th>
          <th>Enganche</th>
          <th>Saldo financiado</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in ventas">
          <td>{{ v.id_venta }}</td>
          <td>{{ formatearFecha(v.fecha) }}</td>
          <td>{{ v.vin }}</td>
          <td>{{ v.id_cliente }}</td>
          <td>{{ v.nombre }}</td>
          <td>{{ v.tipo_pago }}</td>
          <td>{{ v.cuotas || '-' }}</td>
          <td>{{ v.enganche || '-' }}</td>
          <td>{{ v.saldo_financiado || '-' }}</td>
          <td>{{ v.precio_venta }}</td>
          <td>{{ v.estado }}</td>
          <td class="d-flex justify-content-center gap-2">
            <div class="dropdown">
              <button
                class="btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                Opciones
              </button>

              <ul class="dropdown-menu">
                <li v-if="v.tipo_pago === 'CREDITO'">
                  <button
                    class="dropdown-item"
                    @click="
                      router.push({
                        name: 'cuotas',
                        params: { idVenta: v.id_venta },
                      })
                    "
                  >
                    Ver cuotas
                  </button>
                </li>

                <li>
                  <button
                    class="dropdown-item"
                    @click="solicitarConfirmacionComprobante(v.id_venta, v.nombre)"
                  >
                    Descargar comprobante
                  </button>
                </li>

                <li v-if="v.estado === 'PAGADO' || v.estado === 'PENDIENTE'">
                  <button class="dropdown-item text-danger" @click="anular(v.id_venta)">
                    Anular venta
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal de confirmación global, fuera del ciclo y menú -->
  <ConfirmacionBase
    :visible="confirmacionVisible"
    titulo="Generar comprobante"
    mensaje="¿Desea generar comprobante de pago?"
    @confirm="GenerarComprobante"
    @cancel="confirmacionVisible = false"
  />
</template>
