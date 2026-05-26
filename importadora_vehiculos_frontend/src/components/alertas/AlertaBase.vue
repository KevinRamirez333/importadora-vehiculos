<script setup lang="ts">

defineProps<{
  visible: boolean
  titulo: string
  mensaje: string
  tipo: 'success' | 'error'
}>()

const emit = defineEmits(['close'])

</script>

<template>

  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0,0,0,0.5)"
  >

    <div class="modal-dialog modal-sm">

      <div class="modal-content border-3"
        :class="
          tipo === 'success'
            ? 'border-success'
            : 'border-danger'
        "
      >

        <div class="modal-header">

          <h5
            class="modal-title"
            :class="
              tipo === 'success'
                ? 'text-success'
                : 'text-danger'
            "
          >
            {{ titulo }}
          </h5>

        </div>

        <div class="modal-body">

          {{ mensaje }}

        </div>

        <div class="modal-footer">

          <button
            class="btn"
            :class="
              tipo === 'success'
                ? 'btn-success'
                : 'btn-danger'
            "
            @click="$emit('close')"
          >
            Aceptar
          </button>

        </div>

      </div>

    </div>

  </div>

</template>