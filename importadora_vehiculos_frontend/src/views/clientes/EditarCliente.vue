<script setup lang="ts">
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const nombre = ref('')
const apellido = ref('')
const nit = ref('')
const dpi = ref('')
const telefono = ref('')
const direccion = ref('')

const cargarCliente = async ()=>{
    const res = await api.get(`/clientes/${route.params.id}`)
    const cliente = res.data

    nombre.value = cliente.nombre
    apellido.value = cliente.apellido
    nit.value = cliente.nit
    dpi.value = cliente.dpi
    telefono.value = cliente.telefono
    direccion.value = cliente.direccion

}

const editar = async () =>{
    try{
        await api.put(`/clientes/${route.params.id}`,{
            nombre: nombre.value,
            apellido: apellido.value,
            nit: nit.value,
            dpi: dpi.value,
            telefono: telefono.value,
            direccion:direccion.value
        })
        alert('Cliente actualizado correctamente')
        router.push({name:'clientes'})
    } catch(error:any){
        alert(error.response?.data?.message)
    }
}
onMounted(cargarCliente)
</script>

<template>
<div class="container mt-4">
    <h2>Editar Cliente</h2>
    <div class="card p-4">
        <div class="mb-3">
            <label >Nombre</label>
            <input type="text" v-model="nombre" class="form-control">
        </div>
        <div class="mb-3">
            <label>Apellido</label>
            <input type="text" v-model="apellido" class="form-control">
        </div>
        <div class="mb-3">
            <label>NIT</label>
            <input type="text" v-model="nit" class="form-control">
        </div>
        <div class="mb-3">
            <label>DPI</label>
            <input type="text" v-model="dpi" class="form-control">
        </div>
        <div class="mb-3">
            <label>Telefono</label>
            <input type="text" v-model="telefono" class="form-control">
        </div>
        <div class="mb-3">
            <label>Dirección</label>
            <input type="text" v-model="direccion" class="form-control">
        </div>
        <button  @click="editar" class="btn btn-success">Guardar</button>
        <button @click="router.push({name:'clientes'})" class="btn btn-secondary mt-2">Volver</button>
    </div>

</div>
</template>