<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../services/api'

// LISTAS
const vehiculos = ref<any[]>([])
const vehiculosCopia = ref<any[]>([])

// FILTROS
const textoBusqueda = ref('')

// Cargar datos iniciales
const cargarVehiculos = async () => {
  try {
    const res = await api.get('/vehiculos')
    vehiculos.value = res.data
    vehiculosCopia.value = res.data
  } catch (error) {
    alert('Error al cargar vehículos')
  }
}

// Buscar con texto libre
const filtrar = () => {
  const texto = textoBusqueda.value.toLowerCase().trim()

  vehiculos.value = vehiculosCopia.value.filter((v: any) => {
    const precio_venta = v.precio_venta?.toString() || ''
    const activo = v.activo ? 'activo' : 'inactivo'

    return (
      v.vin.toLowerCase().includes(texto) ||
      v.marca.toLowerCase().includes(texto) ||
      v.modelo.toLowerCase().includes(texto) ||
      v.anio.toString().includes(texto) ||
      v.color.toLowerCase().includes(texto) ||
      v.placa.toLowerCase().includes(texto) ||
      precio_venta.includes(texto) ||
      activo.includes(texto)
    )
  })
}

// Limpiar filtros
const limpiar = async () => {
  textoBusqueda.value = ''
  await cargarVehiculos()
}

// Formatear moneda
const formatearPrecio = (valor: string) => {
  if (!valor) return '0.00'
  return Number(valor).toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

onMounted(async () => {
  await cargarVehiculos()
})
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Catálogo de Vehículos</h2>

    <div class="mb-3 d-flex gap-2">
      <input
        v-model="textoBusqueda"
        class="form-control"
        placeholder="Buscar vehículo..."
        @keyup.enter="filtrar"
      />
      <button class="btn btn-primary" @click="filtrar">Buscar</button>
      <button class="btn btn-secondary" @click="limpiar">Limpiar</button>
    </div>

    <div class="table-responsive shadow-sm rounded">
      <table class="table table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>VIN</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Color</th>
            <th>Placa</th>
            <th>Precio Venta</th>
            <th class="text-center">Vigente</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in vehiculos" :key="v.vin">
            <td>{{ v.vin }}</td>
            <td>{{ v.marca }}</td>
            <td>{{ v.modelo }}</td>
            <td>{{ v.anio }}</td>
            <td>{{ v.color }}</td>
            <td>{{ v.placa }}</td>
            <td>Q {{ formatearPrecio(v.precio_venta) }}</td>
            <td class="text-center">
              <span :class="v.activo ? 'badge text-bg-success' : 'badge text-bg-danger'">
                {{ v.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
          </tr>

          <tr v-if="vehiculos.length === 0">
            <td colspan="8" class="text-center py-4 text-muted">No se encontraron vehículos.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
