<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import api from '../../services/api'

const router = useRouter()

// LISTA
const vehiculos = ref<any[]>([])
const vehiculosCopia = ref<any[]>([])

// FILTROS
const textoBusqueda = ref('')
const vin = ref('')
const marca = ref<number | null>(null)
const modelo = ref<number | null>(null)
const anio = ref<number | null>(null)

// LISTAS
const marcas = ref<any[]>([])
const modelos = ref<any[]>([])

// Cargar datos iniciales
const cargarVehiculos = async () => {
  try{
  const res = await api.get('/vehiculos')
  vehiculos.value = res.data
  vehiculosCopia.value = res.data
  } catch(error){
    alert('Error al cargar vehículos')
  }

}

const filtrar = async () => {
  const texto = textoBusqueda.value.toLowerCase().trim()
  console.log(vehiculosCopia.value)
  vehiculos.value = vehiculosCopia.value.filter((v: any) => {
    const precio_venta = v.precio_venta?.toString() || ''
    const activo = v.activo ? 'activo' : 'inactivo'
    return (
      v.vin.toLowerCase().includes(texto) ||
      v.marca.toLowerCase().includes(texto) ||
      v.modelo.toLowerCase().includes(texto) ||
      v.anio.toString().includes(texto) ||
      v.color.toLowerCase().includes(texto) ||
      v.placa.toLowerCase().includes(texto)||
      precio_venta.includes(texto) ||
      v.estado.toLowerCase().includes(texto) ||
      activo.includes(texto)
    )
  })
}
// Buscar con filtros
const buscar = async () => {
  try {
    const params: any = {}

    if (vin.value) params.vin = vin.value
    if (marca.value) params.marca = marca.value
    if (modelo.value) params.modelo = modelo.value
    if (anio.value) params.anio = anio.value

    const res = await api.get('/vehiculos', { params })

    vehiculos.value = res.data
  } catch (error) {
    alert('Error al buscar')
  }
}

// Limpiar filtros
const limpiar = async () => {
textoBusqueda.value = ''
  await cargarVehiculos()
}

// Cargar marcas
const cargarMarcas = async () => {
  try{
  const res = await api.get('/marcas')
  marcas.value = res.data
  } catch(error){
    alert('Error al cargar marcas')
  }

}


// Acciones
const editar = (vin: string) => {
  router.push({ name: 'editar-vehiculo', params: { vin } })
}
const precioVenta = (vin: string) => {
  router.push({ name: 'precio-venta', params: { vin } })
}

const desactivar = async (vin: string) => {
  await api.post(`/vehiculos/desactivar/${vin}`)
  cargarVehiculos()
}

const activar = async (vin: string) => {
  await api.post(`/vehiculos/activar/${vin}`)
  cargarVehiculos()
}

const formatearPrecio = (valor: string) => {
  return Number(valor).toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

onMounted(async () => {
  await cargarVehiculos()
  await cargarMarcas()
})
</script>

<template>
  <div class="mx-5">
    <br />
    <h2>Listado de Vehículos</h2>
    <button class="btn-crear" @click="router.push({ name: 'crear-vehiculo' })">
      + Crear Vehículo
    </button>

    <!-- 🔍 FILTROS 
     -->
    <div class="filtros">
      <input v-model="textoBusqueda" placeholder="Ingrese valor de busqueda" />

      <button @click="filtrar">Buscar</button>
      <button @click="limpiar">Limpiar</button>
    </div>

    <!-- 📋 TABLA -->

    <table>
      <thead>
        <tr>
          <th>VIN</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Color</th>
          <th>Placa</th>
          <th>Precio Venta</th>
          <th>% Ganancia</th>
          <th>Estado</th>
          <th>Vigente</th>
          <th>Acciones</th>
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
          <td>{{ formatearPrecio(v.precio_venta) }}</td>
          <td>{{ v.porcent_ganancia }}</td>
          <td>{{ v.estado }}</td>
          <td>
            <span :class="v.activo ? 'badge-activo' : 'badge-inactivo'">
              {{ v.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>

          <td class="acciones">
            <button class="btn-editar" @click="editar(v.vin)">Editar</button>

            <button v-if="v.activo" class="btn-desactivar" @click="desactivar(v.vin)">
              Desactivar
            </button>

            <button v-else class="btn-activar" @click="activar(v.vin)">Activar</button>
            <button class="btn btn-success" @click="precioVenta(v.vin)">Precio Venta</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.page {
  width: 85%;
  margin: auto;
  margin-top: 40px;
  font-family: Arial, Helvetica, sans-serif;
}

/* TÍTULO */
h2 {
  margin-bottom: 15px;
  font-size: 26px;
}

/* BOTÓN CREAR */
.btn-crear {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 20px;
  transition: 0.2s;
}

.btn-crear:hover {
  background: #36996f;
}

/* FILTROS */
.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: nowrap;
}

.filtros input,
.filtros select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* BOTONES FILTRO */
.filtros button {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 9px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.filtros button:hover {
  background: #1a252f;
}

/* TABLA */
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: #f4f6f8;
}

th {
  padding: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

td {
  padding: 12px;
  border-top: 1px solid #eee;
  color: black;
  text-align: center;
}

tbody tr:hover {
  background: #f9fafb;
}

/* BADGES */
.badge-activo {
  background: #2ecc71;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.badge-inactivo {
  background: #e74c3c;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* BOTONES ACCIONES */
.acciones {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-editar {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-editar:hover {
  background: #2d82bd;
}

.btn-desactivar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-desactivar:hover {
  background: #c0392b;
}

.btn-activar {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-activar:hover {
  background: #27ae60;
}

.navbar {
  background: #2c3e50;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* BOTÓN VOLVER */
.navbar button {
  background: transparent;
  color: white;
  border: 1px solid #fff;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

/* HOVER */
.navbar button:hover {
  background: white;
  color: #2c3e50;
}
</style>
