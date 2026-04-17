<script setup lang="ts">
import { ref,onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router=useRouter()

const nombre=ref('')
const id_marca=ref<number|null>(null)

const marcas=ref<any[]>([])

//cargar marcas
const cargarMarcas = async () =>{
    const res = await api.get('/marcas')
    marcas.value=res.data
}
//crear modelo 
const crearModelo=async ()=>{
    try{
        if(!nombre.value||!id_marca.value){
            return alert("Todos los campos son requeridos")
        }
        await api.post('/modelos',{
            nombre:nombre.value,
            id_marca: id_marca.value
        })
        alert('Modelo creado')

        nombre.value=''
        id_marca.value=null
    } catch(error:any){
        alert(error.response?.data?.message || 'Error')
    }
}
onMounted(cargarMarcas)
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-4">Crear Modelo</h2>
        <div class="card p-4 shadow-sm">
            <!--nombre-->
            <div>
                <label class="form-label">Nombre del modelo</label>
                <input v-model="nombre" class="form-control" placeholder="Ej: Corolla">
            </div>
            <!--marca-->
            <div class="mb-3">
                <label class="form-label">Marcas</label>
                <select v-model="id_marca" class="form-select">
                    <option value="">Seleccione marca</option>
                    <option v-for="m in marcas" :key="m.id_marca" :value="m.id_marca">
                        {{ m.nombre }}
                    </option>
                </select>
            </div>
            <button class="btn btn-success" @click="crearModelo">Guardar</button>
            <button class="btn btn-secondary mt-2" @click="router.push({name: 'modelos'})">Volver</button>
        </div>
    </div>

</template>