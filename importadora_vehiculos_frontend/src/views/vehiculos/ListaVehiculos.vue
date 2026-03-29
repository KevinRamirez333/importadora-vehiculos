<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// LISTA
const vehiculos = ref<any[]>([])

// FILTROS
const vin = ref('')
const marca = ref<number | null>(null)
const modelo = ref<number | null>(null)
const anio = ref<number | null>(null)

// LISTAS
const marcas = ref<any[]>([])
const modelos = ref<any[]>([])

// Cargar datos iniciales
const cargarVehiculos = async () => {
  const res = await axios.get('http://localhost:3000/vehiculos')
  vehiculos.value = res.data
}

// 🔍 Buscar con filtros
const buscar = async () => {
  try {
    const params: any = {}

    if (vin.value) params.vin = vin.value
    if (marca.value) params.marca = marca.value
    if (modelo.value) params.modelo = modelo.value
    if (anio.value) params.anio = anio.value

    const res = await axios.get('http://localhost:3000/vehiculos', { params })

    vehiculos.value = res.data
  } catch (error) {
    alert('Error al buscar')
  }
}

// Limpiar filtros
const limpiar = async () => {
  vin.value = ''
  marca.value = null
  modelo.value = null
  anio.value = null

  await cargarVehiculos()
}

// Cargar marcas
const cargarMarcas = async () => {
  const res = await axios.get('http://localhost:3000/marcas')
  marcas.value = res.data
}

// Cargar modelos por marca
const cargarModelos = async () => {
  if (!marca.value) return

  const res = await axios.get(`http://localhost:3000/modelos/marca/${marca.value}`)

  modelos.value = res.data
}

// Acciones
const editar = (vin: string) => {
  router.push(`/vehiculos/editar/${vin}`)
}

const desactivar = async (vin: string) => {
  await axios.post(`http://localhost:3000/vehiculos/desactivar/${vin}`)
  cargarVehiculos()
}

const activar = async (vin: string) => {
  await axios.post(`http://localhost:3000/vehiculos/activar/${vin}`)
  cargarVehiculos()
}

onMounted(async () => {
  await cargarVehiculos()
  await cargarMarcas()
})
</script>

<template>
  <nav class="navbar">
    <button @click="router.push('/dashboard')">← Volver</button>
  </nav>
  <div class="page">
    <br />
    <h2>Listado de Vehículos</h2>
    <button class="btn-crear" @click="router.push('/vehiculos/crear')">+ Crear Vehículo</button>

    <!-- 🔍 FILTROS -->
    <div class="filtros">
      <input v-model="vin" placeholder="Buscar por VIN" />

      <select v-model="marca" @change="cargarModelos">
        <option value="">Marca</option>
        <option v-for="m in marcas" :key="m.id_marca" :value="m.id_marca">
          {{ m.nombre }}
        </option>
      </select>

      <select v-model="modelo">
        <option value="">Modelo</option>
        <option v-for="mo in modelos" :key="mo.id_modelo" :value="mo.id_modelo">
          {{ mo.nombre }}
        </option>
      </select>

      <input type="number" v-model="anio" placeholder="Año" />

      <button @click="buscar">Buscar</button>
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
