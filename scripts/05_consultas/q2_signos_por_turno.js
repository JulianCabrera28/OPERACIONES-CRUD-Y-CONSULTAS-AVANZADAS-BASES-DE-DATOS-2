// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// consultas/q2.js - Consulta avanzada 2: estadisticas de signos
// vitales por turno de vigilancia (media, maximos y conteos)
// Etapas: $match -> $group -> $project -> $sort (4 etapas)
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion
const c = db.getSiblingDB("hce_hospitalizacion");

// Cuerpo del pipeline de agregacion
const resultado = c.signos_vitales.aggregate([

  // ETAPA 1: filtro los controles recientes (octubre hacia adelante)
  // para trabajar solo con la ventana de tiempo actual
  { $match: { fecha: { $gte: ISODate("2026-09-01T00:00:00Z") } } },

  // ETAPA 2: agrupo por turno y calculo los indicadores de vigilancia
  { $group: {
      _id: "$turno",                                   // clave del grupo: el turno
      controles: { $sum: 1 },                          // cuantos controles hubo
      taMediaSistolica: { $avg: "$taSistolica" },      // promedio de TA sistolica
      taMaxSistolica: { $max: "$taSistolica" },        // pico maximo de TA sistolica
      fcMedia: { $avg: "$fc" },                        // promedio de frecuencia cardiaca
      tempMax: { $max: "$temperatura" },               // temperatura mas alta registrada
      spo2Minima: { $min: "$spo2" }                    // peor saturacion registrada
  } },

  // ETAPA 3: redondeo los promedios para que el reporte sea legible
  { $project: {
      _id: 0,                                                     // oculto el id de grupo
      turno: "$_id",                                              // muestro el turno
      controles: 1,                                               // conteo de controles
      taMediaSistolica: { $round: ["$taMediaSistolica", 1] },      // promedio con 1 decimal
      taMaxSistolica: 1,                                          // pico de TA en el turno
      fcMedia: { $round: ["$fcMedia", 1] },                       // media cardiaca redondeada
      tempMax: 1,                                                 // temperatura maxima
      spo2Minima: 1                                               // saturacion minima
  } },

  // ETAPA 4: ordeno por numero de controles descendente (turno mas activo primero)
  { $sort: { controles: -1 } }
]).toArray();

// Muestro la evidencia de la consulta
print("Consulta 2 - estadisticas de signos vitales por turno:");
printjson(resultado);
