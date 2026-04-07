<script setup lang="ts">
import api from '@/services/api'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
const route = useRoute()
const router = useRouter()
const pais_origen = ref('')
const costo_dolares = ref(0)
const vin = ref('')
const tipo_cambio = ref(0)
const cargar = async () => {
  const res = await api.get(`/importaciones/${route.params.id}`)
  const data = res.data

  ;((pais_origen.value = data.pais_origen),
    (costo_dolares.value = data.costo_dolares),
    (tipo_cambio.value = data.tipo_cambio))
  vin.value = data.vin
}

const editar = async () => {
  try{
  await api.put(`/importaciones/${route.params.id}`, {
    pais_origen: pais_origen.value,
    costo_dolares: costo_dolares.value,
    tipo_cambio: tipo_cambio.value,
  })
  alert('Importacion actualizada correctamente')
  router.push('/importaciones')
  } catch(error:any){
    alert(error.response?.data?.message || 'Error al actualizar'  )
  }

}

const totalQ = ()=> costo_dolares.value*tipo_cambio.value
onMounted(cargar)
</script>

<template>
  <div class="container mt-4">
    <h2>Editar importacion</h2>
    <div class="card p-4">
      <div class="mb-3">
        <label>VIN</label>
        <input type="text" v-model="vin" disabled />
      </div>
      <div class="mb-3">
        <label>Pais Origen</label>
        <input type="text" class="form-control" v-model="pais_origen" />
      </div>
      <div class="mb-3">
        <label>Tipo Cambio</label>
        <input type="number" class="form-control" v-model="tipo_cambio" />
      </div>
      <div class="mb-3">
        <label>Costo en Dolares</label>
        <input type="number" v-model="costo_dolares" />
      </div>
      <div class="mb-3">
        <label >Total en quetzales</label>
        <input type="text" :value="totalQ()" disabled>

      </div>
      <button class="btn btn-success" @click="editar()">Guardar</button>
      <button class="btn btn-secondary mt-2" @click="router.push('/importaciones')">Volver</button>
    </div>
  </div>
</template>
