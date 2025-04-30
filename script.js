// Importar funciones necesarias de Firebase
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; 

// Inicializar Firestore
const db = getFirestore(app); // Asegúrate de que 'app' está definido como el objeto de Firebase

const userForm = document.getElementById('user-form');
const userList = document.getElementById('user-list');

// Función para agregar un usuario
userForm.addEventListener('submit', async function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const dni = document.getElementById('dni').value;
  const fechaInicioIpe = document.getElementById('fechaInicio').value;
  const fechaFinIpe = document.getElementById('fechaFin').value;
  const resultadoIpe = document.getElementById('resultadoIpe').value;
  const orientador = document.getElementById('orientador').value;

  if (!nombre || !dni || !fechaInicioIpe || !fechaFinIpe || !resultadoIpe || !orientador) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  // Generar el número de usuario (con 3 dígitos)
  const numeroUsuario = String(userCount).padStart(3, '0');

  // Crear objeto de usuario
  const user = {
    numeroUsuario,
    nombre,
    dni,
    fechaInicioIpe,
    fechaFinIpe,
    resultadoIpe,
    orientador,
  };

  // Guardar el usuario en Firestore
  try {
    const docRef = await addDoc(collection(db, "usuarios"), user);  // 'usuarios' es la colección
    console.log("Usuario guardado con ID: ", docRef.id);
    alert("Usuario guardado exitosamente.");
    userCount++;
    userForm.reset();
    loadUsers(); // Recargar los usuarios para mostrar el nuevo
  } catch (e) {
    console.error("Error al agregar el documento: ", e);
  }
});

// Función para cargar los usuarios desde Firestore y mostrar en la UI
async function loadUsers() {
  const querySnapshot = await getDocs(collection(db, "usuarios"));
  userList.innerHTML = ''; // Limpiar la lista antes de mostrar los nuevos usuarios
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    addUserToList(user);
  });
}

// Función para agregar un usuario a la lista en la interfaz
function addUserToList(user) {
  const li = document.createElement('li');
  li.classList.add('user-item');
  li.innerHTML = `
    <strong>${user.nombre}</strong> - ${user.dni}
    <p>Orientador/a: ${user.orientador}</p>
    <p>Fecha Inicio IPE: ${user.fechaInicioIpe}</p>
    <p>Fecha Fin IPE: ${user.fechaFinIpe}</p>
    <p>Resultado IPE: ${user.resultadoIpe}</p>
    <p><strong>Número de Usuario:</strong> ${user.numeroUsuario}</p>
    <button class="edit-button">Editar</button>
    <button class="delete-button">Eliminar</button>
  `;
  
  // Añadir los botones de edición y eliminación
  const editButton = li.querySelector('.edit-button');
  const deleteButton = li.querySelector('.delete-button');

  editButton.addEventListener('click', () => editUser(user, li));
  deleteButton.addEventListener('click', () => deleteUser(user, li));

  // Añadir el nuevo elemento a la lista
  userList.appendChild(li);
}

// Función para eliminar un usuario
function deleteUser(user, li) {
  // Eliminar de Firestore
  deleteDoc(doc(db, "usuarios", user.id));
  
  // Eliminar de la UI
  users = users.filter(u => u.dni !== user.dni);
  li.remove();
}

// Cargar los usuarios al cargar la página
window.onload = loadUsers;
