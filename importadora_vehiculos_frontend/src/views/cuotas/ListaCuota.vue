<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { formatearFecha } from '@/helpers/formatearFecha'
import ModalPagarCuota from '@/components/cuotas/ModalPagarCuota.vue'
import { formatearValor } from '@/helpers/formatearValor'
import AlertaBase from '@/components/alertas/AlertaBase.vue'

interface Cuota {
  id_cuota: number
  fecha_pago: string
  monto: number
  interes: number
  estado: string
  id_venta: number
  nombre_cliente: string
  fecha_pagado: string
}

const route = useRoute()

const cuotas = ref<Cuota[]>([])
const modalVisible = ref(false)
const cuotaSeleccionada = ref<number | null>(null)
const idVenta = route.params.idVenta

const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('error')

const cargarCuotas = async () => {
  try {
    const res = await api.get(`/cuotas/venta/${idVenta}`)
    cuotas.value = res.data

    await verificarVentaCompletada()
  } catch (error) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = 'Error al cargar las cuotas'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}
//Cuando las cuotas todas esten pagadas
const marcarVentaPagada = async () => {
  try {
    await api.post(`/ventas/pagar/${idVenta}`)
    alertaTitulo.value = 'Éxito'
    alertaMensaje.value = 'Venta marcada como PAGADA'
    alertaTipo.value = 'success'
    alertaVisible.value = true
  } catch (error: any) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = error?.response?.data?.message || 'Error al actualizar venta'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

const verificarVentaCompletada = async () => {
  try {
    if (cuotas.value.length === 0) return

    const todasPagadas = cuotas.value.every((c) => c.estado === 'PAGADO')
    if (!todasPagadas) return
    const venta = await api.get(`/ventas/${idVenta}`)
    if (todasPagadas && venta.data.estado == 'PENDIENTE') {
      await marcarVentaPagada()
    }
  } catch (error: any) {
    alert('Error al verificar estado de venta completada')
  }
}

const abrirModalPago = (idCuota: number) => {
  cuotaSeleccionada.value = idCuota
  modalVisible.value = true
}
const cerrarModal = () => {
  modalVisible.value = false
}

/* TOTAL PAGADO */
const totalPagado = computed(() => {
  return cuotas.value
    .filter((c) => c.estado === 'PAGADO')
    .reduce((total, cuota) => {
      return total + Number(cuota.monto)
    }, 0)
})

/* SALDO PENDIENTE */
const saldoPendiente = computed(() => {
  return cuotas.value
    .filter((c) => c.estado === 'PENDIENTE')
    .reduce((total, cuota) => {
      return total + Number(cuota.monto)
    }, 0)
})

onMounted(cargarCuotas)
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
      <h2>Lista de Cuotas</h2>
    </div>

    <!-- INFORMACIÓN GENERAL -->

    <div v-if="cuotas.length" class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <strong>ID Venta:</strong>

            <br />

            {{ cuotas[0]?.id_venta }}
          </div>

          <div class="col-md-3">
            <strong>Cliente:</strong>

            <br />

            {{ cuotas[0]?.nombre_cliente }}
          </div>

          <div class="col-md-2">
            <strong>Interés:</strong>

            <br />

            {{ ((cuotas[0]?.interes ?? 0) * 100).toFixed(0) }}%
          </div>

          <div class="col-md-2">
            <strong>Total Pagado:</strong>

            <br />

            Q {{ formatearValor(totalPagado) }}
          </div>

          <div class="col-md-2">
            <strong>Saldo Pendiente:</strong>

            <br />

            Q {{ formatearValor(saldoPendiente) }}
          </div>
        </div>
      </div>
    </div>

    <!-- TABLA -->

    <table class="table table-bordered text-center">
      <thead class="table-dark">
        <tr>
          <th>ID Cuota</th>

          <th>Fecha programada</th>

          <th>Fecha pagado</th>

          <th>Monto</th>

          <th>Estado</th>

          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cuota in cuotas" :key="cuota.id_cuota">
          <td>
            {{ cuota.id_cuota }}
          </td>

          <td>
            {{ formatearFecha(cuota.fecha_pago) }}
          </td>
          <td>
            {{ cuota.fecha_pagado ? formatearFecha(cuota.fecha_pagado) : 'Aún no pagado' }}
          </td>

          <td>Q {{ formatearValor(cuota.monto) }}</td>

          <td>
            <span v-if="cuota.estado === 'PAGADO'" class="badge bg-success"> PAGADO </span>

            <span v-else class="badge bg-warning text-dark"> PENDIENTE </span>
          </td>

          <td>
            <button
              v-if="cuota.estado === 'PENDIENTE'"
              class="btn btn-success btn-sm"
              @click="abrirModalPago(cuota.id_cuota)"
            >
              Pagar
            </button>

            <button v-else class="btn btn-secondary btn-sm" disabled>Pagado</button>
          </td>
        </tr>
      </tbody>
    </table>
    <ModalPagarCuota
      :visible="modalVisible"
      :idCuota="cuotaSeleccionada"
      @close="cerrarModal"
      @pagado="cargarCuotas"
    />
  </div>
</template>
