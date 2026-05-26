<script setup lang="ts">
import api from '@/services/api'
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Variables existentes
const totalVehiculos = ref(0)
const totalImportaciones = ref(0)
const totalClientes = ref(0)
const totalVentas = ref(0)
const totalUsuarios = ref(0)

// Variables para gráficas
const marcasData = ref<{ nombre: string; count: number }[]>([])
const ingresosData = ref<{ tipo: string; count: number }[]>([])
const ventasPagoData = ref<{ tipo: string; count: number }[]>([])
const costosData = ref<{ tipo: string; count: number; total: number }[]>([])

let marcasChart: Chart | null = null
let ingresosChart: Chart | null = null
let ventasPagoChart: Chart | null = null
let costosChart: Chart | null = null

// Funciones de conteo
const conteoVehiculos = async () => {
  try {
    const res = await api.get('/vehiculos')
    totalVehiculos.value = res.data.length
  } catch (error) {
    console.error('Error:', error)
  }
}

const conteoImportaciones = async () => {
  try {
    const res = await api.get('/importaciones')
    totalImportaciones.value = res.data.length
  } catch (error) {
    console.error('Error:', error)
  }
}

const conteoClientes = async () => {
  try {
    const res = await api.get('/clientes')
    totalClientes.value = res.data.length
  } catch (error) {
    console.error('Error:', error)
  }
}

const conteoVentas = async () => {
  try {
    const res = await api.get('/ventas')
    totalVentas.value = res.data.length
  } catch (error) {
    console.error('Error:', error)
  }
}

const conteoUsuarios = async () => {
  try {
    const res = await api.get('/usuarios')
    totalUsuarios.value = res.data.length
  } catch (error) {
    console.error('Error:', error)
  }
}

// Cargar distribución por marca
const cargarMarcas = async () => {
  try {
    const res = await api.get('/vehiculos')
    const vehiculos = res.data

    const marcasMap = new Map()
    vehiculos.forEach((vehiculo: any) => {
      const marca = vehiculo.marca || 'Sin marca'
      marcasMap.set(marca, (marcasMap.get(marca) || 0) + 1)
    })

    marcasData.value = Array.from(marcasMap.entries()).map(([nombre, count]) => ({
      nombre,
      count,
    }))

    crearGraficaMarcas()
  } catch (error) {
    console.error('Error cargando marcas:', error)
  }
}

const cargarIngresos = async () => {
  try {
    const res = await api.get('/ingresos')
    const data = res.data

    const tiposMap = new Map()
    data.forEach((ingreso: any) => {
      const tipo = ingreso.tipo_ingreso || 'OTRO'
      // Solo contar IMPORTACION y COMPRA_LOCAL
      if (tipo === 'IMPORTACION' || tipo === 'COMPRA_LOCAL') {
        tiposMap.set(tipo, (tiposMap.get(tipo) || 0) + 1)
      }
    })

    ingresosData.value = Array.from(tiposMap.entries()).map(([tipo, count]) => ({
      tipo,
      count,
    }))

    crearGraficaIngresos()
  } catch (error) {
    console.error('Error:', error)
  }
}

const cargarVentasPago = async () => {
  try {
    const res = await api.get('/ventas')
    const data = res.data

    const tiposMap = new Map()
    data.forEach((venta: any) => {
      const tipoPago = venta.tipo_pago || 'NO ESPECIFICADO'
      if (tipoPago === 'CONTADO' || tipoPago === 'CREDITO') {
        tiposMap.set(tipoPago, (tiposMap.get(tipoPago) || 0) + 1)
      }
    })

    ventasPagoData.value = Array.from(tiposMap.entries()).map(([tipo, count]) => ({
      tipo,
      count,
    }))

    crearGraficaVentasPago()
  } catch (error) {
    console.error('Error:', error)
  }
}

const cargarCostos = async () => {
  try {
    const res = await api.get('/vehiculo-costos')
    const data = res.data

    const tiposMap = new Map()
    const totalesMap = new Map()

    data.forEach((costo: any) => {
      const tipoCosto = costo.tipo_costo || 'OTRO'
      const monto = Number(costo.monto) || 0

      tiposMap.set(tipoCosto, (tiposMap.get(tipoCosto) || 0) + 1)
      totalesMap.set(tipoCosto, (totalesMap.get(tipoCosto) || 0) + monto)
    })

    costosData.value = Array.from(tiposMap.entries()).map(([tipo, count]) => ({
      tipo,
      count,
      total: totalesMap.get(tipo) || 0,
    }))

    crearGraficaCostos()
  } catch (error) {
    console.error('Error:', error)
  }
}

// Crear gráficas
const crearGraficaMarcas = () => {
  const ctx = document.getElementById('marcasChart') as HTMLCanvasElement
  if (!ctx) return
  if (marcasChart) marcasChart.destroy()

  marcasChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: marcasData.value.map((m) => m.nombre),
      datasets: [
        {
          data: marcasData.value.map((m) => m.count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#C9CBCF',
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: 'bold' } },
        },
        title: {
          display: true,
          text: 'Vehículos por Marca',
          font: { size: 16, weight: 'bold' },
        },
      },
    },
  })
}

const crearGraficaIngresos = () => {
  const ctx = document.getElementById('ingresosChart') as HTMLCanvasElement
  if (!ctx) return
  if (ingresosChart) ingresosChart.destroy()

  // Mapear los tipos a nombres legibles
  const labels = ingresosData.value.map((i) => {
    return i.tipo === 'IMPORTACION' ? 'Importación' : 'Compra Local'
  })

  ingresosChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: ingresosData.value.map((i) => i.count),
          backgroundColor: ['#36A2EB', '#4BC0C0'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: 'bold' } },
        },
        title: {
          display: true,
          text: 'Tipos de ingreso de vehículos',
          font: { size: 16, weight: 'bold' },
        },
      },
    },
  })
}

const crearGraficaVentasPago = () => {
  const ctx = document.getElementById('ventasPagoChart') as HTMLCanvasElement
  if (!ctx) return
  if (ventasPagoChart) ventasPagoChart.destroy()

  ventasPagoChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ventasPagoData.value.map((v) => v.tipo),
      datasets: [
        {
          data: ventasPagoData.value.map((v) => v.count),
          backgroundColor: ['#4BC0C0', '#FFCE56'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: 'bold' } },
        },
        title: {
          display: true,
          text: 'Ventas por Tipo de Pago',
          font: { size: 16, weight: 'bold' },
        },
      },
    },
  })
}

const crearGraficaCostos = () => {
  const ctx = document.getElementById('costosChart') as HTMLCanvasElement
  if (!ctx) return
  if (costosChart) costosChart.destroy()

  costosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: costosData.value.map((c) => c.tipo),
      datasets: [
        {
          label: 'Cantidad',
          data: costosData.value.map((c) => c.count),
          backgroundColor: '#36A2EB',
          yAxisID: 'y',
          borderRadius: 5,
        },
        {
          label: 'Total ($)',
          data: costosData.value.map((c) => c.total),
          backgroundColor: '#FF6384',
          type: 'line',
          yAxisID: 'y1',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12, weight: 'bold' } },
        },
        title: {
          display: true,
          text: 'Tipos de costos de vehículos',
          font: { size: 16, weight: 'bold' },
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              `${ctx.dataset.label}: ${ctx.dataset.label === 'Total ($)' ? '$' + Number(ctx.raw).toLocaleString() : ctx.raw}`,
          },
        },
      },
      scales: {
        y: {
          title: { display: true, text: 'Cantidad', font: { weight: 'bold' } },
          beginAtZero: true,
        },
        y1: {
          position: 'right',
          title: { display: true, text: 'Monto Total ($)', font: { weight: 'bold' } },
          beginAtZero: true,
          grid: { drawOnChartArea: false },
        },
      },
    },
  })
}

// Inicialización
onMounted(async () => {
  await Promise.all([
    conteoVehiculos(),
    conteoClientes(),
    conteoImportaciones(),
    conteoUsuarios(),
    conteoVentas(),
    cargarMarcas(),
    cargarIngresos(),
    cargarVentasPago(),
    cargarCostos(),
  ])
})
</script>

<template>
  <div class="container-fluid px-4">
    <!-- Tarjetas de métricas -->
    <div class="row g-4 mt-3">
      <div
        class="col-md-6 col-xl-3"
        v-for="(item, idx) in [
          {
            title: 'Vehículos',
            value: totalVehiculos,
            icon: 'bi-car-front-fill',
            color: 'primary',
          },
          {
            title: 'Importaciones',
            value: totalImportaciones,
            icon: 'bi-box-seam',
            color: 'success',
          },
          { title: 'Clientes', value: totalClientes, icon: 'bi-people-fill', color: 'warning' },
          { title: 'Ventas', value: totalVentas, icon: 'bi-cash-stack', color: 'danger' },
        ]"
        :key="idx"
      >
        <div
          class="card shadow-sm border-0 h-100 dashboard-card border-start border-4"
          :class="`border-${item.color}`"
        >
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2 fw-bold">{{ item.title }}</h6>
                <h2 class="fw-bold display-6">{{ item.value }}</h2>
              </div>
              <i :class="`bi ${item.icon} fs-1 text-${item.color}`"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficas -->
    <div class="row mt-4">
      <div
        class="col-md-6 mb-4"
        v-for="(chart, idx) in [
          { id: 'marcasChart' },
          { id: 'ingresosChart' },
          { id: 'ventasPagoChart' },
          { id: 'costosChart' },
        ]"
        :key="idx"
      >
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <canvas :id="chart.id"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  transition: 0.2s ease;
  border-radius: 15px;
}
.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
canvas {
  max-height: 350px;
  width: 100% !important;
}
.card {
  border-radius: 15px;
  border: none;
}
.display-6 {
  font-size: 2.5rem;
}
</style>
