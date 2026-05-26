<script setup lang="ts">
import { ref, watch } from 'vue'
import api from '@/services/api'

const props = defineProps<{
  visible: boolean
  idCuota: number | null
}>()

const emit = defineEmits(['close', 'pagado'])

const fecha_pagado = ref('')

watch(
  () => props.visible,
  (nuevoValor) => {
    if (nuevoValor) {
      fecha_pagado.value = new Date().toISOString().split('T')[0] || ''
    }
  },
)

const pagarCuota = async () => {
  if (!props.idCuota) return

  try {

    await api.post(`cuotas/pagar/${props.idCuota}`, {
      fecha_pagado: fecha_pagado.value,
    })

    emit('pagado')

    emit('close')
  } catch (error) {
    alert('Error al pagar cuota')

    console.error(error)
  }
}
</script>

<template>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Pagar cuota</h5>

          <button class="btn-close" @click="$emit('close')" />
        </div>

        <div class="modal-body">
          <label class="form-label"> Fecha de pago </label>

          <input type="date" class="form-control" v-model="fecha_pagado" />
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Cancelar</button>

          <button class="btn btn-success" @click="pagarCuota">Confirmar pago</button>
        </div>
      </div>
    </div>
  </div>
</template>
