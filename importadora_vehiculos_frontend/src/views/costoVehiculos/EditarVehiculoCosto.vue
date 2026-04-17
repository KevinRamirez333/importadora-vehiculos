<script setup lang="ts">
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route=useRoute()
const router=useRouter()

const tipo_costo =ref('')
const descripcion=ref('')
const monto=ref(0)
const fecha=ref('')
const id=route.params.id
const cargar = async()=>{
    const res = await api.get(`/vehiculo-costos/${id}`)
    const vehiculo=res.data

    tipo_costo.value=vehiculo.tipo_costo
    descripcion.value = vehiculo.descripcion
    monto.value=vehiculo.monto
    fecha.value=vehiculo.fecha.split('T')[0]
}
const editar = async()=>{
    try{
        await api.put(`/vehiculo-costos/${id}`,{
            tipo_costo:tipo_costo.value,
            descripcion:descripcion.value,
            monto:monto.value,
            fecha:fecha.value
        })
        alert("Costo editado correctamente")
        router.push('/vehiculo-costos')
    } catch(error:any){
        alert(error.response?.data?.message||'Error al editar costo')
    }
}


onMounted(cargar)
</script>

<template>
<div class="container mt-4">
    <h2>Editar costo</h2>
    <div class="card p-4">
    <div class="mb-3">
        <label>Tipo de costo</label>
        <select v-model="tipo_costo" class="form-select">
            <option value="TRASPASO">TRASPASO</option>
            <option value="TALLER">TALLER</option>
            <option value="IMPUESTO">IMPUESTO</option>
            <option value="PLACAS">PLACAS</option>
            <option value="TRAMITES">TRAMITES</option>
            <option value="OTRO">OTRO</option>
        </select>
    </div>
    <div class="mb-3">
        <label>Descripcion</label>
        <input type="text" v-model="descripcion" class="form-control">   
    </div>
    <div class="mb-3">
        <label>Monto</label>
        <input type="number" v-model="monto" class="form-control">
    </div>
    <div class="mb-3">
        <label >Fecha</label>
        <input type="date" v-model="fecha" class="form-control">
    </div>
    <button class="btn btn-success" @click="editar()">Guardar</button>
    <button class="btn btn-secondary mt-2" @click="router.push({name: 'vehiculo-costos'})">Volver</button>
    </div>
</div>
</template>