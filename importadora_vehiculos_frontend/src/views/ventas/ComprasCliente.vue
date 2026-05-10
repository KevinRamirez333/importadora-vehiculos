<script setup lang="ts">
import { formatearFecha } from '@/helpers/formatearFecha'
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const ventas = ref<any[]>([])
const cargar = async () => {
  try {
    const res = await api.get(`ventas/cliente/${id}`)
    
    ventas.value = res.data
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al cargar las compras del cliente')
    router.push({ name: 'clientes' })
  }
}

onMounted(cargar)
</script>

<template>
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
