<script setup lang="ts">
import { formatearValor } from '@/helpers/formatearValor'
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlertaBase from '@/components/alertas/AlertaBase.vue'

const route = useRoute()
const router = useRouter()
const vin = route.params.vin

// ALERTA BASE
const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('success')

const ingreso = ref('')
const costos = ref('')
const total = ref('')
const precioVenta = ref(0)
let precioVentaMostrar: number = 0
const porcentaje = ref(0)
const cargar = async () => {
  try {
    const res = await api.get(`/vehiculos/costo-total/${vin}`)

    ingreso.value = res.data.ingreso
    costos.value = res.data.costos
    total.value = res.data.total
  } catch (error: any) {
    alert(error.response?.data?.message)
  }
}
const calcular = () => {
  precioVenta.value = Number(total.value) + Number(total.value) * (porcentaje.value / 100)
  precioVentaMostrar = precioVenta.value
}

const guardar = async () => {
  try {
    await api.put(`/vehiculos/precio/${vin}`, {
      precio: precioVenta.value,
      porcentaje: porcentaje.value,
    })
    alertaTitulo.value = 'Éxito'
    alertaMensaje.value = 'Precio de venta actualizado correctamente'
    alertaTipo.value = 'success'
    alertaVisible.value = true
  } catch (error: any) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = error.response?.data?.message || 'Ocurrió un error inesperado'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

// manejar el evento @close de la alerta
const manejarCierreAlerta = () => {
  alertaVisible.value = false

  // Solo redirigimos si la alerta fue de éxito
  if (alertaTipo.value === 'success') {
    router.push({ name: 'vehiculos' })
  }
}

const formatearPrecio = (valor: string) => {
  return Number(valor).toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <AlertaBase
      :visible="alertaVisible"
      :titulo="alertaTitulo"
      :mensaje="alertaMensaje"
      :tipo="alertaTipo"
      @close="manejarCierreAlerta"
    />
    <h2>Definir precio de venta</h2>
    <div class="card p-4">
      <div class="mb-3">
        <label>Costo de ingreso del vehiculo</label>
        <input type="text" :value="formatearPrecio(ingreso)" class="form-control" disabled />
      </div>
      <div class="mb-3">
        <label>Costos adicionales (placas, taller, traspaso, entre otros)</label>
        <input type="text" :value="formatearPrecio(costos)" class="form-control" disabled />
      </div>
      <div class="mb-3">
        <label>Costo total</label>
        <input type="text" :value="formatearPrecio(total)" class="form-control" disabled />
      </div>
      <div class="mb-3">
        <label>Porcentaje de ganancia</label>
        <input type="number" v-model="porcentaje" @input="calcular()" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Precio de venta</label>
        <input :value="formatearValor(precioVenta)" class="form-control" disabled />
      </div>
      <button class="btn btn-success" @click="guardar()">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push({ name: 'vehiculos' })">
        Volver
      </button>
    </div>
  </div>
</template>
