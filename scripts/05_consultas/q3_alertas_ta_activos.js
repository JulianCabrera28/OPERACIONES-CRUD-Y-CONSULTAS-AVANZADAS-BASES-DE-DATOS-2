// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// consultas/q3.js - Consulta avanzada 3: alertas de tension arterial
// alta (>= 150 mmHg) en pacientes hospitalizados actualmente
// Etapas: $match -> $lookup -> $unwind -> $match (4 etapas)
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion
const c = db.getSiblingDB("hce_hospitalizacion");

// Cuerpo del pipeline de agregacion (exactamente 4 etapas)
const alertas = c.signos_vitales.aggregate([

  // ETAPA 1: detecto los controles con tension arterial sistolica
  // superior o igual a 150 mmHg (signo de alarma clinica)
  { $match: { taSistolica: { $gte: 150 } } },

  // ETAPA 2: cruzo con la coleccion admisiones y ya dentro del join
  // conservo solo los episodios activos (paciente hospitalizado hoy)
  { $lookup: {
      from: "admisiones",               // coleccion a la que me uno
      localField: "admisionId",         // referencia local de la toma
      foreignField: "_id",              // codigo de la admision
      as: "admision",                   // arreglo resultado del cruce
      pipeline: [                       // filtro interno del join
        { $match: { estado: "Activa" } } // solo admisiones aun activas
      ]
  } },

  // ETAPA 3: aplano el arreglo admision; las tomas sin episodio activo
  // desaparecen aqui porque el arreglo queda vacio tras el filtro
  { $unwind: "$admision" },

  // ETAPA 4: armo el informe final de vigilancia con los datos utiles
  { $project: {
      _id: 0,                                                        // oculto el id interno
      fecha: 1,                                                      // cuando se tomo el signo
      turno: 1,                                                      // turno de la medicion
      taSistolica: 1,                                                // valor de TA sistolica
      taDiastolica: 1,                                               // valor de TA diastolica
      paciente: "$admision.pacienteId",                              // paciente alertado
      servicio: "$admision.servicio",                                // servicio del episodio
      diagnostico: "$admision.diagnosticoPrincipal.descripcion"      // diagnostico activo
  } }
]).toArray();

// Ordeno las alertas de mayor a menor presion desde el shell
alertas.sort(function (a, b) { return b.taSistolica - a.taSistolica; });

// Muestro la evidencia de la consulta
print("Consulta 3 - alertas de TA >= 150 en admisiones activas:");
printjson(alertas);
print("total alertas activas: " + alertas.length);
