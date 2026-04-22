<script setup lang="ts">
import api from '@/services/api'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fecha = ref('')
const vin = ref('')
const id_cliente = ref(0)
const tipo_pago = ref('')
const cuotas = ref(0)
const precio_venta = ref(0)
const estado = computed(() => {
  return tipo_pago.value === 'CONTADO' ? 'PAGADO' : 'PENDIENTE'
})
const nombreVehiculo = ref('')
const placaVehiculo = ref('')
const nombreCliente = ref('')
const apellidoCliente = ref('')
const clienteBusqueda = ref('')

const vinBusqueda = ref('')

const crear = async () => {
  try {
    await api.post('/ventas', {
      fecha: fecha.value,
      vin: vin.value,
      id_cliente: id_cliente.value,
      tipo_pago: tipo_pago.value,
      cuotas: cuotas.value,
      precio_venta: precio_venta.value,
      estado: estado.value,
    })

    alert('Venta guardada correctamente')

    fecha.value = ''
    vin.value = ''
    nombreVehiculo.value=''
    placaVehiculo.value=''
    vinBusqueda.value=''
    id_cliente.value = 0
    nombreCliente.value=''
    apellidoCliente.value=''
    clienteBusqueda.value=''
    tipo_pago.value = ''
    cuotas.value = 0
    precio_venta.value = 0
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al guardar la venta')
  }
}

const buscarPorVin = async () => {
  try {
    const result = await api.get(`/vehiculos/${vinBusqueda.value}`)
    const data = result.data
    vin.value = data.vin
    placaVehiculo.value = data.placa
    nombreVehiculo.value = data.nombre
    precio_venta.value = data.precio_venta
    alert('Vehículo encontrado correctamente')
  } catch (error: any) {
    nombreVehiculo.value = ''
    vin.value = ''
    alert(error.response?.data?.message)
  }
}

const buscarCliente = async () => {
  try {
    const result = await api.get(`/clientes/dpi/${clienteBusqueda.value}`)
    const data = result.data

    id_cliente.value = data.id_cliente
    nombreCliente.value = data.nombre
    apellidoCliente.value = data.apellido
    alert('Cliente encontrado correctamente')
  } catch (error: any) {
    id_cliente.value = 0
    nombreCliente.value = ''
    alert(error.response?.data?.message)
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2>Registrar venta</h2>

    <div class="card p-4">
      <div class="mb-3">
        <label>Fecha</label>
        <input type="date" class="form-control" v-model="fecha" />
      </div>
      <div>
        <label>VIN</label>
      </div>
      <div class="mb-3 d-flex gap-2">
        <input
          type="text"
          class="form-control"
          placeholder="Vehículo seleccionado..."
          disabled
          :value="nombreVehiculo && placaVehiculo ? nombreVehiculo + ' ' + placaVehiculo : ''"
        />
        <input
          type="text"
          class="form-control"
          placeholder="Buscar vehiculo por VIN"
          v-model="vinBusqueda"
        />
        <button class="btn btn-success" @click="buscarPorVin">Buscar</button>
      </div>
      <div>
        <label>Cliente</label>
      </div>
      <div class="mb-3 d-flex gap-2">
        <input
          type="text"
          class="form-control"
          placeholder="Cliente seleccionado..."
          disabled
          :value="nombreCliente && apellidoCliente ? nombreCliente + ' ' + apellidoCliente : ''"
        />
        <input
          type="text"
          placeholder="Buscar cliente por DPI..."
          v-model="clienteBusqueda"
          class="form-control"
        />
        <button class="btn btn-success" @click="buscarCliente()">Buscar</button>
      </div>
      <div class="mb-3">
        <label>Tipo de pago</label>
        <select v-model="tipo_pago" class="form-select">
          <option value="CONTADO">CONTADO</option>
          <option value="CREDITO">CREDITO</option>
        </select>
      </div>
      <div class="mb-3" v-if="tipo_pago === 'CREDITO'">
        <label>Cuotas</label>
        <input type="number" class="form-control" v-model="cuotas" />
      </div>
      <div class="mb-3">
        <label>Precio Venta</label>
        <input type="number" class="form-control" v-model="precio_venta" />
      </div>
      <div class="mb-3">
        <label>Estado</label>
        <input type="text" class="form-control" :value="estado" readonly />
      </div>
      <button class="btn btn-success" @click="crear()">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push({ name: 'ventas' })">
        Volver
      </button>
    </div>
  </div>
</template>
