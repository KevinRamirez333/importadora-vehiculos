<script setup lang="ts">
import { formatearFecha } from '@/helpers/formatearFecha'
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlertaBase from '@/components/alertas/AlertaBase.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const ventas = ref<any[]>([])

const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('error')

const cargar = async () => {
  try {
    const res = await api.get(`ventas/cliente/${id}`)
    ventas.value = res.data
  } catch (error: any) {
    alertaTitulo.value = 'Error'
    alertaMensaje.value = error.response?.data?.message || 'Error al cargar las compras del cliente'
    alertaTipo.value = 'error'
    alertaVisible.value = true
    setTimeout(() => {
      alertaVisible.value = false
      router.push({ name: 'clientes' })
    }, 2000)
  }
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
    <h2>Compras del cliente</h2>

    <table class="table table-bordered text-center">
      <thead class="table-dark">
        <tr>
          <th>ID Venta</th>
          <th>Fecha</th>
          <th>VIN</th>
          <th>Tipo pago</th>
          <th>Cuotas</th>
          <th>Precio</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in ventas" :key="v.id_venta">
          <td>{{ v.id_venta }}</td>
          <td>{{ formatearFecha(v.fecha) }}</td>
          <td>{{ v.vin }}</td>
          <td>{{ v.tipo_pago }}</td>
          <td>{{ v.cuotas || '-' }}</td>
          <td>{{ v.precio_venta }}</td>
          <td>{{ v.estado }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
