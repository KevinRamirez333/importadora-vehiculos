<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import AlertaBase from '@/components/alertas/AlertaBase.vue'
// ALERTA BASE
const alertaVisible = ref(false)
const alertaMensaje = ref('')
const alertaTitulo = ref('')
const alertaTipo = ref<'success' | 'error'>('success')

const router = useRouter()

// FORM
const vin = ref('')
const placa = ref('')
const anio = ref<number | null>(null)
const color = ref('')
const precio_venta = ref<number | null>(null)
const id_marca = ref<number | null>(null)
const id_estado = ref<number | null>(1)
const id_modelo = ref<number | null>(null)

// LISTAS
const marcas = ref<any[]>([])
const estados = ref<any[]>([])
const modelos = ref<any[]>([])

// Cargar marcas
const cargarMarcas = async () => {
  const res = await api.get('/marcas')
  marcas.value = res.data
}

// Cargar estados
const cargarEstados = async () => {
  const res = await api.get('/estados')
  estados.value = res.data
}

// Cargar modelos por marca
const cargarModelos = async () => {
  if (!id_marca.value) return

  const res = await api.get(`/modelos/marca/${id_marca.value}`)

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
    const datosVehiculo = {
      vin: vin.value,
      placa: placa.value,
      anio: anio.value,
      color: color.value,
      precio_venta: precio_venta.value,
      id_marca: id_marca.value,
      id_estado: 1,
      id_modelo: id_modelo.value,
    }

    await api.post('/vehiculos', datosVehiculo)

    alertaTitulo.value = 'Éxito'
    alertaMensaje.value = 'Vehículo creado correctamente'
    alertaTipo.value = 'success'
    alertaVisible.value = true

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
    alertaTitulo.value = 'Error'
    alertaMensaje.value = error.response?.data?.message || 'Error al crear vehículo'
    alertaTipo.value = 'error'
    alertaVisible.value = true
  }
}

onMounted(async () => {
  await cargarMarcas()
  await cargarEstados()
})
</script>

<template>
  <div class="page">
    <AlertaBase
      :visible="alertaVisible"
      :titulo="alertaTitulo"
      :mensaje="alertaMensaje"
      :tipo="alertaTipo"
      @close="alertaVisible = false"
    />
    <!-- FORMULARIO -->
    <div class="form-container">
      <br />
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
        <input type="text" placeholder="REPARACION" disabled />
      </div>

      <!-- BOTÓN -->
      <button class="btn btn-success" @click="guardar">Guardar Vehículo</button>
      <button class="btn btn-secondary" @click="router.push({ name: 'vehiculos' })">Volver</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
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
</style>
