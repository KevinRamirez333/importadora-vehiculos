<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// FORM
const vin = ref('')
const placa = ref('')
const anio = ref<number | null>(null)
const color = ref('')
const precio_venta = ref<number | null>(null)
const id_marca = ref<number | null>(null)
const id_estado = ref<number | null>(null)
const id_modelo = ref<number | null>(null)

// LISTAS
const marcas = ref<any[]>([])
const estados = ref<any[]>([])
const modelos = ref<any[]>([])

// Cargar marcas
const cargarMarcas = async () => {
  const res = await axios.get('http://localhost:3000/marcas')
  marcas.value = res.data
}

// Cargar estados
const cargarEstados = async () => {
  const res = await axios.get('http://localhost:3000/estados')
  estados.value = res.data
}

// Cargar modelos por marca
const cargarModelos = async () => {
  if (!id_marca.value) return

  const res = await axios.get(
    `http://localhost:3000/modelos/marca/${id_marca.value}`
  )

  modelos.value = res.data
}

// Detectar cambio de marca
watch(id_marca, () => {
  id_modelo.value = null
  cargarModelos()
})

// Guardar vehículo
const guardar = async () => {
  try {

    const payload = {
      vin: vin.value,
      placa: placa.value,
      anio: anio.value,
      color: color.value,
      precio_venta: precio_venta.value=null,
      id_marca: id_marca.value,
      id_estado: id_estado.value,
      id_modelo: id_modelo.value
    }

    await axios.post('http://localhost:3000/vehiculos', payload)

    alert('Vehículo creado correctamente')

    // limpiar formulario
    vin.value = ''
    placa.value = ''
    anio.value = null
    color.value = ''
    precio_venta.value = null
    id_marca.value = null
    id_modelo.value = null
    id_estado.value = null

  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al crear vehículo')
  }
}

onMounted(async () => {
  await cargarMarcas()
  await cargarEstados()
})
</script>

<template>
  <div class="page">

    <!-- NAVBAR -->
    <nav class="navbar">
      <button @click="router.push('/Vehiculos')">
        ← Volver
      </button>
    </nav>

    <!-- FORMULARIO -->
    <div class="form-container">
      <br>
      <h2 class="titulo">Crear Vehículo</h2>

      <!-- VIN -->
      <div class="campo">
        <label>VIN</label>
        <input v-model="vin" placeholder="Ej: 1HGCM82633A123456" />
      </div>

      <!-- Placa -->
      <div class="campo">
        <label>Placa</label>
        <input v-model="placa" placeholder="Ej: P123ABC" />
      </div>

      <!-- Año -->
      <div class="campo">
        <label>Año</label>
        <input type="number" v-model="anio" placeholder="Ej: 2024" />
      </div>

      <!-- Color -->
      <div class="campo">
        <label>Color</label>
        <input v-model="color" placeholder="Ej: Rojo" />
      </div>

      

      <!-- Marca -->
      <div class="campo">
        <label>Marca</label>
        <select v-model="id_marca">
          <option disabled value="">Seleccione una marca</option>
          <option v-for="m in marcas" :key="m.id_marca" :value="m.id_marca">
            {{ m.nombre }}
          </option>
        </select>
      </div>

      <!-- Modelo -->
      <div class="campo">
        <label>Modelo</label>
        <select v-model="id_modelo">
          <option disabled value="">Seleccione un modelo</option>
          <option v-for="mo in modelos" :key="mo.id_modelo" :value="mo.id_modelo">
            {{ mo.nombre }}
          </option>
        </select>
      </div>

      <!-- Estado -->
      <div class="campo">
        <label>Estado</label>
        <select v-model="id_estado">
          <option disabled value="">Seleccione un estado</option>
          <option v-for="e in estados" :key="e.id_estado" :value="e.id_estado">
            {{ e.nombre }}
          </option>
        </select>
      </div>

      <!-- BOTÓN -->
      <button class="btn-guardar" @click="guardar">
        Guardar Vehículo
      </button>
    </div>

  </div>
</template>

<style scoped>

.page {
  display: flex;
  flex-direction: column;
}

/* NAVBAR */
.navbar {
  padding: 15px 30px;
  background-color: #2c3e50;
}

.navbar button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

/* CONTENEDOR */
.form-container {
  width: 420px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* TÍTULO */
.titulo {
  text-align: center;
  margin-bottom: 10px;
}

/* CAMPOS */
.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
  font-size: 14px;
}

/* INPUTS */
input,
select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* BOTÓN */
.btn-guardar {
  margin-top: 10px;
  padding: 14px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-guardar:hover {
  background-color: #36996f;
}

</style>