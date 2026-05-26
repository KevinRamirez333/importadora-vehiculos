<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  titulo?: string
  mensaje: string
}>()
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-sm">
      <div class="modal-content border-3 border-warning">
        <div class="modal-header">
          <h5 class="modal-title text-warning">{{ titulo || 'Confirmar acción' }}</h5>
        </div>
        <div class="modal-body">
          {{ mensaje }}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
          <button class="btn btn-warning" @click="$emit('confirm')">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>
