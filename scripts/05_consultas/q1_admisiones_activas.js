// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// consultas/q1.js - Consulta avanzada 1: admisiones activas con los
// datos del paciente hospitalizado (relacion documento-referencia)
// Etapas: $match -> $lookup -> $unwind -> $project (4 etapas)
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion
const c = db.getSiblingDB("hce_hospitalizacion");

// Cuerpo del pipeline de agregacion (exactamente 4 etapas)
const resultado = c.admisiones.aggregate([

  // ETAPA 1: dejo unicamente las admisiones que siguen activas
  { $match: { estado: "Activa" } },

  // ETAPA 2: traigo los datos del paciente enriqueciendo la admision
  // con la coleccion pacientes usando el campo referencia pacienteId
  { $lookup: {
      from: "pacientes",          // coleccion con la que se cruza
      localField: "pacienteId",   // campo local de la admision
      foreignField: "_id",        // campo _id del paciente
      as: "paciente"              // arreglo donde queda el cruce
  } },

  // ETAPA 3: convierto el arreglo paciente en un subdocumento unico
  // porque cada admision solo pertenece a un paciente
  { $unwind: "$paciente" },

  // ETAPA 4: selecciono solo los campos que interesan al reporte
  { $project: {
      _id: 0,                                        // oculto el id interno
      admision: "$_id",                              // codigo de la admision
      servicio: 1,                                   // servicio hospitalario
      cama: 1,                                       // cama asignada
      diagnostico: "$diagnosticoPrincipal.descripcion", // descripcion CIE-10
      paciente: {                                    // datos clave del paciente
        nombres: "$paciente.nombres",
        apellidos: "$paciente.apellidos",
        eps: "$paciente.eps",
        edadAnios: {                                 // edad calculada en el motor
          $dateDiff: { startDate: "$paciente.fechaNacimiento", endDate: "$$NOW", unit: "year" }
        }
      }
  } }
]).toArray();

// Ordeno la salida por servicio desde el shell para la lectura del reporte
resultado.sort(function (a, b) { return a.servicio.localeCompare(b.servicio); });

// Muestro la evidencia de la consulta
print("Consulta 1 - admisiones activas con datos del paciente:");
printjson(resultado);
print("total admisiones activas: " + resultado.length);
