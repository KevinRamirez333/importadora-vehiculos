<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuarios = ref<any[]>([])
const mostrarModalPassword = ref(false)
const usuarioSeleccionado = ref<number | null>(null)
const nuevaPassword = ref('')
const cargarUsuarios = async () => {
  try {
    const res = await axios.get('http://localhost:3000/usuarios')
    usuarios.value = res.data
  } catch (error) {
    alert('Error cargando usuarios')
  }
}

const desactivarUsuario = async (id: number) => {
  if (!confirm('¿Seguro que deseas desactivar este usuario?')) return

  try {
    await axios.post(`http://localhost:3000/usuarios/${id}/desactivar`)
    cargarUsuarios()
  } catch {
    alert('Error desactivando usuario')
  }
}
const activarUsuario = async (id: number) => {
  if (!confirm('¿Seguro que deseas activar este usuario?')) return

  try {
    await axios.post(`http://localhost:3000/usuarios/${id}/activar`)
    cargarUsuarios()
  } catch {
    alert('Error activando usuario')
  }
}

const editarUsuario = (id: number) => {
  router.push(`/usuarios/editar/${id}`)
}

const abrirResetPassword = (id: number) => {
  usuarioSeleccionado.value = id
  nuevaPassword.value = ''
  mostrarModalPassword.value = true
}
const confirmarResetPassword = async () => {

  if (!nuevaPassword.value) {
    alert("Ingrese una contraseña")
    return
  }

  try {

    await axios.patch(
      `http://localhost:3000/usuarios/reset/password/${usuarioSeleccionado.value}`,
      {
        newPassword: nuevaPassword.value
      }
    )

    alert("Contraseña reseteada correctamente")

    mostrarModalPassword.value = false

  } catch {
    alert("Error reseteando contraseña")
  }

}
onMounted(cargarUsuarios)
</script>

<template>
  <div class="page">
    <nav class="navbar">
      <button class="btn-volver" @click="router.push('/dashboard')">← Volver al dashboard</button>
    </nav>
    <br>

    <h2 class="titulo">Usuarios del Sistema</h2>
    <button class="btn-crear" @click="router.push('/usuarios/crear')">Crear Usuario</button>
    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in usuarios" :key="u.id_usuario">
          <td>{{ u.nombre }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.rol }}</td>
          <td>
            <span :class="u.activo ? 'badge-activo' : 'badge-inactivo'">
              {{ u.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>

          <td>
            <div class="acciones">
              <button class="btn-editar" @click="editarUsuario(u.id_usuario)">Editar</button>
              <button class="btn-password" @click="abrirResetPassword(u.id_usuario)">Reset Password</button>
              <button v-if="u.activo" class="btn-desactivar" @click="desactivarUsuario(u.id_usuario)">
                Desactivar
              </button>

              <button v-else class="btn-activar" @click="activarUsuario(u.id_usuario)">Activar</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="mostrarModalPassword" class="modal-overlay">

  <div class="modal">

    <h3>Resetear contraseña</h3>

    <input
      type="password"
      v-model="nuevaPassword"
      placeholder="Nueva contraseña"
    />

    <div class="modal-buttons">

      <button class="btn-confirmar" @click="confirmarResetPassword">
        Guardar
      </button>

      <button class="btn-cancelar" @click="mostrarModalPassword = false">
        Cancelar
      </button>

    </div>

  </div>

</div>
</template>

<style scoped>
.page {
  width: 85%;
  margin: auto;
  margin-top: 40px;
  font-family: Arial, Helvetica, sans-serif;
}

/* NAVBAR */

.navbar {
  margin-bottom: 20px;
}

.btn-volver {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-volver:hover {
  background: #1a252f;
}

/* HEADER */

.titulo {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 26px;
}

/* BOTON CREAR */

.btn-crear {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 20px;
  transition: 0.2s;
}

.btn-crear:hover {
  background: #36996f;
}

/* TABLA */

.tabla {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.tabla thead {
  background: #f4f6f8;
}

.tabla th {
  padding: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.tabla td {
  padding: 12px;
  border-top: 1px solid #333;
  color: black;
  text-align: center;
}

.tabla tbody tr:hover {
  background: #f9fafb;
}

/* BADGES */

.badge-activo {
  background: #2ecc71;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.badge-inactivo {
  background: #e74c3c;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* BOTONES ACCIONES */

.btn-editar {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-right: 6px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-editar:hover {
  background: #2d82bd;
}

.btn-desactivar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-desactivar:hover {
  background: #c0392b;
}

.btn-activar {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-activar:hover {
  background: #27ae60;
}
.btn-password {
  background: #f39c12;
  color: white;
  border: none;
  padding: 6px 12px;
  margin-right: 6px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-password:hover {
  background: #d68910;
}
.acciones {
  display: flex;
  gap: 8px; /* espacio entre botones */
  justify-content: center;
  flex-wrap: wrap; /* evita que se rompa en pantallas pequeñas */
}
/* OVERLAY */

.modal-overlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.5);
display:flex;
align-items:center;
justify-content:center;
}

/* CAJA MODAL */

.modal{
background:white;
padding:25px;
border-radius:10px;
width:350px;
display:flex;
flex-direction:column;
gap:15px;
box-shadow:0 4px 20px rgba(0,0,0,0.2);
}

/* INPUT */

.modal input{
padding:12px;
border-radius:6px;
border:1px solid #ccc;
font-size:14px;
}

/* BOTONES */

.modal-buttons{
display:flex;
justify-content:space-between;
}

.btn-confirmar{
background:#42b983;
color:white;
border:none;
padding:8px 16px;
border-radius:6px;
cursor:pointer;
}

.btn-confirmar:hover{
background:#36996f;
}

.btn-cancelar{
background:#e74c3c;
color:white;
border:none;
padding:8px 16px;
border-radius:6px;
cursor:pointer;
}

.btn-cancelar:hover{
background:#c0392b;
}
</style>
