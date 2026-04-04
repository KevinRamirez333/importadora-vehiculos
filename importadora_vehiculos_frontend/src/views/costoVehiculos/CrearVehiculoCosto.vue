<script setup lang="ts">
import api from '@/services/api'
import { ref } from 'vue'

const tipo_costo =  ref('')
const descripcion = ref('')
const monto = ref(0)
const fecha = ref('')
const crear = async () =>{
    try{
        await api.post('/vehiculo-costos',{
            tipo_costo:tipo_costo.value,
            descripcion:descripcion.value,
            monto:monto.value,
            fecha:fecha.value
        })
    }catch(error:any){
        alert(error.response?.data?.message)
    }
}
</script>
<template>
    <div>
        <h2>Registrar costos</h2>
        <div>
            

        </div>
    </div>

</template>