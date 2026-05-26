<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const id = route.params.id

const tipo_ingreso = ref('')
const fecha = ref('')
const id_cliente = ref<number | null>(null)
const cliente = ref('')
const valor_ingreso = ref<number | null>(null)
const clientes = ref<any[]>([])
const buscarCliente = ref('')

const formato = computed(() => {
  return Number(valor_ingreso.value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const cargar = async () => {
  const res = await api.get(`/ingresos/${id}`)

  const data = res.data

  tipo_ingreso.value = data.tipo_ingreso
  fecha.value = data.fecha.split('T')[0]
  id_cliente.value = data.id_cliente
  valor_ingreso.value = data.valor_ingreso
}

const actualizar = async () => {
  await api.put(`/ingresos/${id}`, {
    tipo_ingreso: tipo_ingreso.value,
    fecha: fecha.value,
    id_cliente: id_cliente.value,
    valor_ingreso: valor_ingreso.value,
  })
  if (tipo_ingreso.value === 'IMPORTACION') {
    router.push({ name: 'crear-importacion', params: { id: id } })
  }
  ;((tipo_ingreso.value = ''),
    (fecha.value = ''),
    (id_cliente.value = null),
    (valor_ingreso.value = null),
    alert('Actualizado correctamente'))
  router.push({ name: 'ingresos-vehiculos' })
}

const cargarClientes = async () => {
  const res = await api.get('/clientes')
  clientes.value = res.data
}

const buscarClienteDPI = async () => {
  try {
    const res = await api.get(`clientes/dpi/${buscarCliente.value}`)
    const data = res.data
    id_cliente.value = data.id_cliente
    cliente.value = data.nombre
  } catch (error: any) {
    alert(error.response?.data?.message)
    cliente.value = ''
    id_cliente.value = null
  }
}

onMounted(async () => {
  await cargar()
})
</script>

<template>
  <div class="container mt-4">
    <h2>Editar Ingreso</h2>

    <div class="card p-4">
      <div class="mb-3">
        <label>Tipo de ingreso</label>
        <select v-model="tipo_ingreso" class="form-select">
          <option value="IMPORTACION">IMPORTACION</option>
          <option value="COMPRA_LOCAL">COMPRA LOCAL</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Fecha</label>
        <input type="date" v-model="fecha" class="form-control" />
      </div>
      <!--<div class="mb-3">
        <label>Cliente</label>
      </div>
      <div class="mb-3 d-flex gap-2">
        <input type="text" v-model="cliente" disabled placeholder="Cliente seleccionado" />
        <input type="text" v-model="buscarCliente" placeholder="Busqueda por DPI" />
        <button class="btn btn-success" @click="buscarClienteDPI">Buscar</button>
      </div>-->
      <div class="mb-3" v-if="tipo_ingreso !== 'IMPORTACION'">
        <label>Valor de ingreso</label>
        <input type="number" v-model="valor_ingreso" class="form-control" />
        <small>
          {{ formato }}
        </small>
      </div>

      <button class="btn btn-success" @click="actualizar">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push({ name: 'ingresos-vehiculos' })">
        Volver
      </button>
    </div>
  </div>
</template>
