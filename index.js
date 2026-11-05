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

    const { titulo, completada } = req.body;

    // Validar que el título exista y sea texto
    if (typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({
            exito: false,
            mensaje: 'El título es obligatorio y debe ser texto'
        });
    }

    // Validar que completada sea verdadero o falso
    if (completada !== undefined && typeof completada !== 'boolean') {
        return res.status(400).json({
            exito: false,
            mensaje: 'El campo completada debe ser verdadero o falso'
        });
    }

    // Crear la nueva tarea
    const nuevaTarea = {
        id: tareas.length + 1,
        titulo: titulo.trim(),
        completada: completada ?? false
    };

    tareas.push(nuevaTarea);

    // Respuesta exitosa
    res.status(201).json({
        exito: true,
        mensaje: 'Tarea creada correctamente',
        datos: nuevaTarea
    });
});

// 4. PATCH: Actualizar una tarea existente
app.patch('/api/tareas/:id', (req, res) => {

    const id = Number(req.params.id);

    // Validar que el ID sea un número entero positivo
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            exito: false,
            mensaje: 'El ID debe ser un número entero positivo'
        });
    }

    // Buscar la tarea
    const tarea = tareas.find(t => t.id === id);

    // Verificar si la tarea existe
    if (!tarea) {
        return res.status(404).json({
            exito: false,
            mensaje: 'No se encontró una tarea con ese ID'
        });
    }

    const { titulo, completada } = req.body;

    // Verificar que se envíe al menos un dato
    if (titulo === undefined && completada === undefined) {
        return res.status(400).json({
            exito: false,
            mensaje: 'Debes enviar al menos un campo para actualizar'
        });
    }

    // Validar el título si fue enviado
    if (titulo !== undefined) {
        if (typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({
                exito: false,
                mensaje: 'El título debe ser un texto y no puede estar vacío'
            });
        }
    }

    // Validar el estado si fue enviado
    if (completada !== undefined && typeof completada !== 'boolean') {
        return res.status(400).json({
            exito: false,
            mensaje: 'El campo completada debe ser true o false'
        });
    }

    // Actualizar solamente los campos recibidos
    if (titulo !== undefined) {
        tarea.titulo = titulo.trim();
    }

    if (completada !== undefined) {
        tarea.completada = completada;
    }

    // Respuesta exitosa
    res.status(200).json({
        exito: true,
        mensaje: 'Tarea actualizada correctamente',
        datos: tarea
    });
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
