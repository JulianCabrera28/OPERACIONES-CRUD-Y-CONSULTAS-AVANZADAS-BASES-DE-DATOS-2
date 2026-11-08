// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// consultas/q4.js - Consulta avanzada 4: uso de medicamentos en las
// ordenes medicas activas de los pacientes hospitalizados
// Etapas: $unwind -> $match -> $group -> $sort (4 etapas)
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion
const c = db.getSiblingDB("hce_hospitalizacion");

// Cuerpo del pipeline de agregacion (exactamente 4 etapas)
const uso = c.admisiones.aggregate([

  // ETAPA 1: desarmo el vector ordenesMedicamentos para analizar
  // cada orden como si fuera un documento independiente
  { $unwind: "$ordenesMedicamentos" },

  // ETAPA 2: conservo solo las ordenes vigentes de los episodios
  // activos, que es lo que se esta administrando hoy
  { $match: {
      estado: "Activa",                                   // episodio activo
      "ordenesMedicamentos.estado": "Activa"              // orden vigente en farmacia
  } },

  // ETAPA 3: agrupo por nombre del medicamento y cuento en cuantas
  // ordenes activas aparece cada farmaco
  { $group: {
      _id: "$ordenesMedicamentos.medicamento",            // clave: nombre del medicamento
      ordenesActivas: { $sum: 1 }                         // numero de ordenes con el farmaco
  } },

  // ETAPA 4: ordeno por numero de ordenes de mayor a menor
  // (el medicamento mas prescrito aparece primero)
  { $sort: { ordenesActivas: -1, _id: 1 } }
]).toArray();

// Renombro la clave _id a medicamento para una salida mas legible
const resultado = uso.map(function (f) {
  // Devuelvo el objeto con el nombre final de los campos
  return { medicamento: f._id, ordenesActivas: f.ordenesActivas };
});

// Muestro la evidencia de la consulta
print("Consulta 4 - medicamentos en ordenes activas de hospitalizacion:");
printjson(resultado);
print("total medicamentos en uso: " + resultado.length);
