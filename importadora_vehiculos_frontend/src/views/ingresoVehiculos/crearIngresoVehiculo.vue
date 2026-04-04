<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const vin = ref('')
const tipo_ingreso = ref('')
const fecha = ref('')
const id_cliente = ref<number | null>(null)
const valor_ingreso = ref<number | null>(null)

const vehiculos = ref<any[]>([])
const clientes = ref<any[]>([])
const vinBusqueda = ref('')

// cargar datos
const cargarVehiculos = async () => {
  const res = await api.get('/vehiculos')
  vehiculos.value = res.data
}
//buscar por ID
const buscarPorId = async () => {
  try {
    const res = await api.get(`/vehiculos/${vinBusqueda.value}`)

    const data = res.data

    vin.value = data.vin
  } catch (error: any) {
    alert('Vehículo no encontrado')
  }
}
const cargarClientes = async () => {
  const res = await api.get('/clientes')
  clientes.value = res.data
}

// crear
const crear = async () => {
  try {
    const res = await api.post('/ingresos', {
      vin: vin.value,
      tipo_ingreso: tipo_ingreso.value,
      fecha: fecha.value,
      id_cliente: id_cliente.value,
      valor_ingreso: tipo_ingreso.value ==='IMPORTACION'?0:valor_ingreso.value,
    })

      const idIngreso = res.data.id
      console.log(idIngreso)
    if (tipo_ingreso.value === 'IMPORTACION') {
      router.push(`/importaciones/crear/${idIngreso}`)
    ;((vin.value = ''),
      (tipo_ingreso.value = ''),
      (fecha.value = ''),
      (id_cliente.value = null),
      (valor_ingreso.value = null))

  
    }
    alert('Ingreso registrado')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error')
  }
}

const formato = computed(() => {
  return Number(valor_ingreso.value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

onMounted(async () => {
  await cargarVehiculos()
  await cargarClientes()
})
</script>

<template>
  <div class="container mt-4">
    <h2>Registrar Ingreso de Vehículo</h2>

    <div class="card p-4">
      <div class="mb-3 d-flex gap-2">
        <select v-model="vin" class="form-select">
          <option value="">Seleccione vehículo</option>
          <option v-for="v in vehiculos" :key="v.vin" :value="v.vin">
            {{ v.vin }} - {{ v.modelo }}
          </option>
        </select>

        <input
          type="text"
          v-model="vinBusqueda"
          class="form-control"
          placeholder="Buscar por VIN"
        />

        <button class="btn btn-success" @click="buscarPorId">Buscar</button>
      </div>

      <div class="mb-3">
        <label>Tipo de ingreso</label>
        <select v-model="tipo_ingreso" class="form-select">
          <option value="IMPORTACION">IMPORTACION</option>
          <option value="COMPRA_LOCAL">COMPRA LOCAL</option>
          <option value="RECIBIDO_COMO_PAGO">RECIBIDO COMO PAGO</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Fecha</label>
        <input type="date" v-model="fecha" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Cliente (opcional)</label>
        <select v-model="id_cliente" class="form-select">
          <option value="null">Ninguno</option>
          <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
            {{ c.nombre }}
          </option>
        </select>
      </div>

      <div class="mb-3" v-if="tipo_ingreso !=='IMPORTACION'">
        <label>Valor de ingreso</label>
        <input type="number" v-model="valor_ingreso" class="form-control" />

        <small>
          {{ formato }}
        </small>
      </div>

      <button class="btn btn-success" @click="crear">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push('/ingresosVehiculos')">
        Volver
      </button>
    </div>
  </div>
</template>
