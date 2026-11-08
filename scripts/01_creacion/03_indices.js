// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// 03_indices.js - Crea los indices que optimizan las consultas
// de la base hce_hospitalizacion
// =====================================================================

// Abrevio la conexion a la base para las cuatro colecciones
const c = db.getSiblingDB("hce_hospitalizacion");

// Indice unico para no permitir dos pacientes con la misma identificacion
c.pacientes.createIndex({ identificacion: 1 }, { name: "uk_paciente_identificacion", unique: true });

// Indice para buscar admisiones por paciente
c.admisiones.createIndex({ pacienteId: 1 }, { name: "ix_admision_paciente" });

// Indice compuesto para filtar admisiones activas por servicio y fecha
c.admisiones.createIndex({ estado: 1, fechaIngreso: -1 }, { name: "ix_admision_estado_fecha" });

// Indice sobre el codigo del diagnostico principal (subdocumento embebido)
c.admisiones.createIndex({ "diagnosticoPrincipal.codigo": 1 }, { name: "ix_admision_diagnostico" });

// Indice de texto sobre las notas de evolucion para busquedas de texto
c.admisiones.createIndex({ "notasEvolucion.plan": "text", "notasEvolucion.analisis": "text" }, { name: "ix_admision_texto" });

// Indice para la serie temporal de signos vitales por admision y fecha
c.signos_vitales.createIndex({ admisionId: 1, fecha: 1 }, { name: "ix_signos_admision_fecha" });

// Indice para estadisticas de tension arterial por turno
c.signos_vitales.createIndex({ taSistolica: 1 }, { name: "ix_signos_ta" });

// Muestro los indices creados como evidencia
print("indices de admisiones: " + c.admisiones.getIndexes().map(function (ix) { return ix.name; }).sort().join(", "));
print("indices de signos_vitales: " + c.signos_vitales.getIndexes().map(function (ix) { return ix.name; }).sort().join(", "));
print("indices de pacientes: " + c.pacientes.getIndexes().map(function (ix) { return ix.name; }).sort().join(", "));
