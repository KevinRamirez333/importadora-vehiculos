<script setup lang="ts">
import api from '@/services/api';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const nombre = ref('')
const apellido = ref('')
const nit = ref('')
const dpi = ref('')
const telefono = ref('')
const direccion= ref('')
const crear = async ()=>{
    try{
        await api.post('/clientes',{
            nombre: nombre.value,
            apellido: apellido.value,
            nit: nit.value,
            dpi: dpi.value,
            telefono: telefono.value,
            direccion: direccion.value
        })
        alert('Cliente creado correctamente')
        nombre.value = ''
        apellido.value = ''
        nit.value = ''
        dpi.value= ''
        telefono.value = ''
        direccion.value = ''

    }catch(error:any){
        alert(error.response?.data?.message || 'Error al crear el cliente')
    }
}
</script>

<template>
<div class="container mt-4">
    <h2>Crear cliente</h2>
    <div class="card p-4">
        <div class="mb-3">
            <label>Nombre</label>
            <input type="text" class="form-control" v-model="nombre">
        </div>
        <div class="mb-3">
            <label>Apellido</label>
            <input type="text" class="form-control" v-model="apellido">
        </div>
        <div class="mb-3">
            <label>NIT</label>
            <input type="text" class="form-control" v-model="nit">
        </div>
        <div class="mb-3">
            <label>DPI</label>
            <input type="text" class="form-control" v-model="dpi">
        </div>
        <div class="mb-3">
            <label>Teléfono</label>
            <input type="text" class="form-control" v-model="telefono">
        </div>
        <div class="mb-3">
            <label>Dirección</label>
            <input type="text" class="form-control" v-model="direccion">
        </div>
        <button class="btn btn-success" @click="crear()">Guardar</button>
        <button class="btn btn-secondary mt-2" @click="router.push({name:'clientes'})">Volver</button>
    </div>
</div>
</template>