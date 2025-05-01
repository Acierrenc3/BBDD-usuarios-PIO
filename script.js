import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnq2-JxaYw697zpBRQiXqhNiwA9KGX_lw",
  authDomain: "bbdd-usuarios.firebaseapp.com",
  projectId: "bbdd-usuarios",
  storageBucket: "bbdd-usuarios.firebasestorage.app",
  messagingSenderId: "945433915987",
  appId: "1:945433915987:web:e0fdd14678de48239e4ca6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');

userForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const dni = document.getElementById('dni').value;
  const orientador = document.getElementById('orientador').value;
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;
  const resultadoIpe = document.getElementById('resultadoIpe').value;

  if (!nombre || !dni || !fechaInicio || !fechaFin || !resultadoIpe || !orientador) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  const user = {
    nombre,
    dni,
    orientador,
    fechaInicio,
    fechaFin,
    resultadoIpe
  };

  try {
    await addDoc(collection(db, "usuarios"), user);
    alert("Usuario guardado exitosamente.");
    userForm.reset();
    loadUsers();
  } catch (e) {
    console.error("Error al agregar el documento: ", e);
  }
});

// Cargar usuarios desde Firestore
async function loadUsers() {
  const querySnapshot = await getDocs(collection(db, "usuarios"));
  userList.innerHTML = '';

  const row = document.createElement('div');
  row.className = 'row';

  let count = 0;

  querySnapshot.forEach((docSnap) => {
    const user = docSnap.data();
    user.id = docSnap.id;

    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
      <div class="card h-100 shadow-sm p-3">
        <h5 class="card-title">${user.nombre}</h5>
        <p><strong>DNI:</strong> ${user.dni}</p>
        <p><strong>Orientador/a:</strong> ${user.orientador}</p>
        <p><strong>Inicio IPE:</strong> ${user.fechaInicio}</p>
        <p><strong>Fin IPE:</strong> ${user.fechaFin}</p>
        <p><strong>Resultado:</strong> ${user.resultadoIpe}</p>
        <button class="btn btn-warning btn-sm edit-button mb-1">Editar</button>
        <button class="btn btn-danger btn-sm delete-button">Eliminar</button>
      </div>
    `;

    // Asignar eventos a botones
    col.querySelector('.delete-button').addEventListener('click', () => deleteUser(user.id));
    col.querySelector('.edit-button').addEventListener('click', () => alert('Función editar en desarrollo'));

    row.appendChild(col);
    count++;

    if (count % 3 === 0) {
      userList.appendChild(row.cloneNode(true));
      row.innerHTML = '';
    }
  });

  if (row.children.length > 0) {
    userList.appendChild(row);
  }
}

// Eliminar usuario
async function deleteUser(userId) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    try {
      await deleteDoc(doc(db, "usuarios", userId));
      alert("Usuario eliminado.");
      loadUsers();
    } catch (error) {
      console.error("Error al eliminar usuario: ", error);
    }
  }
}

window.onload = loadUsers;
