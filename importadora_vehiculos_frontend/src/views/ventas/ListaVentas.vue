<script setup lang="ts">
import { formatearFecha } from '@/helpers/formatearFecha'
import api from '@/services/api'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const ventas = ref<any[]>([])

const cargar = async () => {
  try {
    const res = await api.get('/ventas')
    ventas.value = res.data
  } catch (error: any) {
    alert(error.response?.data?.message)
  }
}
const anular = async (id:string)=>{
  try {
    if(!confirm('Desea anular esta venta')) return
     await api.post(`/ventas/anular/${id}`)
     alert('Venta anulada correctamente')
     cargar()
  }catch(error){
    alert('Error al anular venta')

  }
}
onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de Ventas</h2>
      <button class="btn btn-primary" @click="router.push({name: 'crear-venta'})">Crear</button>
    </div>
    <div class="mb-3 d-flex gap-2">
        <input type="text"
        class="form-control"
        placeholder="Ingrese el valor de busqueda">
        <button class="btn btn-success">Buscar</button>
        <button class="btn btn-warning">Limpiar</button>
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
                <td>{{ v.enganche||'-' }}</td>
                <td>{{ v.saldo_financiado||'-' }}</td>
                <td>{{v.precio_venta}}</td>
                <td>{{ v.estado }}</td>
                <td>
                    <button
                    v-if="v.estado ==='PAGADO'|| v.estado==='PENDIENTE'"
                     class="btn btn-danger" @click="anular(v.id_venta)">Anular</button>
                     
                </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>
