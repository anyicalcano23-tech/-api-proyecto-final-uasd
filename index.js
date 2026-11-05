const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- BASE DE DATOS EN MEMORIA (RECURSOS) ---
let tareas = [
    { id: 1, titulo: 'Configurar servidor', completada: true },
    { id: 2, titulo: 'Crear endpoints', completada: false }
];

let usuarios = [
    { id: 1, nombre: 'Anyi', rol: 'Backend Core' },
    { id: 2, nombre: 'Henry', rol: 'Validación y Errores' }
];

// Ruta principal de bienvenida
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Bienvenida a la API REST del proyecto final!' });
});

// ==========================================
// RECURSO 1: TAREAS (Endpoints)
// ==========================================

// 1. GET: Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
    res.json(tareas);
});

// 2. GET: Obtener una tarea por ID
app.get('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Recurso no encontrado' });
    res.json(tarea);
});

// 3. POST: Crear una nueva tarea
app.post('/api/tareas', (req, res) => {
    if (!req.body.titulo) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const nuevaTarea = {
        id: tareas.length + 1,
        titulo: req.body.titulo,
        completada: req.body.completada || false
    };
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// 4. PATCH: Actualizar una tarea existente
app.patch('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Recurso no encontrado' });

    tarea.titulo = req.body.titulo || tarea.titulo;
    if (req.body.completada !== undefined) tarea.completada = req.body.completada;

    res.json(tarea);
});

// 5. DELETE: Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
    const index = tareas.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Recurso no encontrado' });

    const tareaEliminada = tareas.splice(index, 1);
    res.json({ mensaje: 'Tarea eliminada con éxito', tarea: tareaEliminada[0] });
});

// ==========================================
// RECURSO 2: USUARIOS (Endpoints)
// ==========================================

// 6. GET: Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    res.json(usuarios);
});

// 7. POST: Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
    if (!req.body.nombre || !req.body.rol) {
        return res.status(400).json({ error: 'Nombre y rol son obligatorios' });
    }
    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre,
        rol: req.body.rol
    };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

// 8. DELETE: Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Recurso no encontrado' });

    const usuarioEliminado = usuarios.splice(index, 1);
    res.json({ mensaje: 'Usuario eliminado con éxito', usuario: usuarioEliminado[0] });
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});