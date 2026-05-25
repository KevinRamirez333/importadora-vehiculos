<script setup lang="ts">
</script>

<template>
  <div class="container mt-4">

    <div class="d-flex justify-content-between mb-3">
      <h2>Lista de Cuotas</h2>

 
    </div>

    <div class="mb-3 d-flex gap-2">
      <input
        type="text"
        class="form-control"
        placeholder="Ingrese el valor de búsqueda"
      />

      <button class="btn btn-success">
        Buscar
      </button>

      <button class="btn btn-warning">
        Limpiar
      </button>
    </div>

    <table class="table table-bordered text-center">

      <thead class="table-dark">
        <tr>
          <th>ID Cuota</th>
          <th>Fecha Pago</th>
          <th>Monto</th>
          <th>Interés</th>
          <th>Estado</th>
          <th>ID Venta</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>

        <tr>
          <td>1</td>
          <td>2025-09-10</td>
          <td>250.00</td>
          <td>15.00</td>
          <td>
            <span class="badge bg-success">
              PAGADO
            </span>
          </td>
          <td>12</td>
          <td>
             <button class="btn btn-secondary btn-sm me-2" disabled>
              Pagado
            </button>

           
          </td>
        </tr>

        <tr>
          <td>2</td>
          <td>2025-10-10</td>
          <td>250.00</td>
          <td>10.00</td>
          <td>
            <span class="badge bg-warning text-dark">
              PENDIENTE
            </span>
          </td>
          <td>12</td>
          <td>
             <button class="btn btn-success btn-sm me-2">
              Pagar
            </button>

           
          </td>
        </tr>

        <tr>
          <td>3</td>
          <td>2025-11-10</td>
          <td>250.00</td>
          <td>8.00</td>
          <td>
            <span class="badge bg-warning text-dark">
              PENDIENTE
            </span>
          </td>
          <td>12</td>
          <td>
            <button class="btn btn-success btn-sm me-2">
              Pagar
            </button>

          
          </td>
        </tr>

      </tbody>

    </table>

  </div>
</template>