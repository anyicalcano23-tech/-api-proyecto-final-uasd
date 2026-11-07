const express = require('express');
const app = express();

app.use(express.json()); // Middleware para procesar JSON

// ==========================================
// DATOS EN MEMORIA (Simulando base de datos)
// ==========================================
let parcelas = [
    { id: 1, productor: "Ramón", extension: 10, cultivo: "Plátano" },
    { id: 2, productor: "Pedro", extension: 5, cultivo: "Yuca" }
];

let turnos = [
    { id: 1, parcelaId: 1, fecha: "2026-11-10", estado: "pendiente" }
];

// ==========================================
// RECURSO 1: PARCELAS (5 Endpoints)
// ==========================================

// 1. GET: Obtener todas las parcelas
app.get('/api/parcelas', (req, res) => {
    res.status(200).json(parcelas);
});

// 2. GET: Obtener una parcela por ID
app.get('/api/parcelas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const parcela = parcelas.find(p => p.id === id);
    
    if (!parcela) {
        return res.status(404).json({ error: "Parcela no encontrada" });
    }
    res.status(200).json(parcela);
});

// 3. POST: Crear una nueva parcela
app.post('/api/parcelas', (req, res) => {
    const { productor, extension, cultivo } = req.body;

    // Validaciones básicas
    if (!productor || typeof productor !== 'string') {
        return res.status(400).json({ error: "El campo 'productor' es obligatorio y debe ser texto." });
    }
    if (!extension || typeof extension !== 'number' || extension <= 0) {
        return res.status(400).json({ error: "El campo 'extension' es obligatorio y debe ser un número mayor a 0." });
    }
    if (!cultivo || typeof cultivo !== 'string') {
        return res.status(400).json({ error: "El campo 'cultivo' es obligatorio y debe ser texto." });
    }

    const nuevaParcela = {
        id: parcelas.length > 0 ? parcelas[parcelas.length - 1].id + 1 : 1,
        productor,
        extension,
        cultivo
    };
    
    parcelas.push(nuevaParcela);
    res.status(201).json({ mensaje: "Parcela creada exitosamente", datos: nuevaParcela });
});

// 4. PATCH: Actualizar parcialmente una parcela
app.patch('/api/parcelas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const parcela = parcelas.find(p => p.id === id);

    if (!parcela) {
        return res.status(404).json({ error: "Parcela no encontrada" });
    }

    const { productor, extension, cultivo } = req.body;
    
    if (productor) parcela.productor = productor;
    if (extension) parcela.extension = extension;
    if (cultivo) parcela.cultivo = cultivo;

    res.status(200).json({ mensaje: "Parcela actualizada", datos: parcela });
});

// 5. DELETE: Eliminar una parcela
app.delete('/api/parcelas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = parcelas.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Parcela no encontrada" });
    }

    parcelas.splice(index, 1);
    res.status(200).json({ mensaje: "Parcela eliminada correctamente" });
});


// ==========================================
// RECURSO 2: TURNOS (5 Endpoints)
// ==========================================

// 6. GET: Obtener todos los turnos
app.get('/api/turnos', (req, res) => {
    res.status(200).json(turnos);
});

// 7. GET: Obtener un turno por ID
app.get('/api/turnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const turno = turnos.find(t => t.id === id);
    
    if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado" });
    }
    res.status(200).json(turno);
});

// 8. POST: Crear un nuevo turno
app.post('/api/turnos', (req, res) => {
    const { parcelaId, fecha, estado } = req.body;

    // Validaciones básicas
    if (!parcelaId || typeof parcelaId !== 'number') {
        return res.status(400).json({ error: "El campo 'parcelaId' es obligatorio y debe ser un número." });
    }
    if (!fecha || typeof fecha !== 'string') {
        return res.status(400).json({ error: "El campo 'fecha' es obligatorio y debe ser texto (YYYY-MM-DD)." });
    }

    // Validar que la parcela existe
    const parcelaExiste = parcelas.find(p => p.id === parcelaId);
    if (!parcelaExiste) {
        return res.status(400).json({ error: "La parcela especificada no existe." });
    }

    const nuevoTurno = {
        id: turnos.length > 0 ? turnos[turnos.length - 1].id + 1 : 1,
        parcelaId,
        fecha,
        estado: estado || "pendiente"
    };
    
    turnos.push(nuevoTurno);
    res.status(201).json({ mensaje: "Turno asignado exitosamente", datos: nuevoTurno });
});

// 9. PATCH: Actualizar el estado de un turno
app.patch('/api/turnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const turno = turnos.find(t => t.id === id);

    if (!turno) {
        return res.status(404).json({ error: "Turno no encontrado" });
    }

    const { estado } = req.body;
    if (!estado || typeof estado !== 'string') {
        return res.status(400).json({ error: "El campo 'estado' es obligatorio." });
    }

    turno.estado = estado;
    res.status(200).json({ mensaje: "Turno actualizado", datos: turno });
});

// 10. DELETE: Eliminar un turno
app.delete('/api/turnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = turnos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Turno no encontrado" });
    }

    turnos.splice(index, 1);
    res.status(200).json({ mensaje: "Turno cancelado/eliminado correctamente" });
});


// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de RiegoJusto corriendo en http://localhost:${PORT}`);
});
