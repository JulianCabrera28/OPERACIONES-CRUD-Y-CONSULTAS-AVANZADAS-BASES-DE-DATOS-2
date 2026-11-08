// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// crud/01_insertar.js - Operacion CREATE (INSERT) del subsistema de
// hospitalizacion en MongoDB: paciente nuevo, su admision con
// subdocumento y vectores, y su primer control de signos vitales
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion del modelo U2
const c = db.getSiblingDB("hce_hospitalizacion");

// ---------------------------------------------------------------------
// 1) INSERTAR un documento nuevo en la coleccion pacientes
// ---------------------------------------------------------------------
// Defino el objeto del paciente que ingresa nuevo por urgencias
const nuevoPaciente = {
  // Codigo interno consecutivo del paciente en la HCE
  _id: "PAC-2026-0006",
  // Identificacion de cedula del paciente
  identificacion: "1039882450",
  // Nombres y apellidos separados para facilitar reportes
  nombres: "Sara",
  apellidos: "Vidales Restrepo",
  // EPS con la que el paciente esta afiliado
  eps: "Sura",
  // Fecha de nacimiento en tipo fecha para calcular la edad
  fechaNacimiento: ISODate("1988-04-11T00:00:00Z"),
  // Sexo para estadisticas epidemiologicas
  sexo: "F",
  // Telefono de contacto para confirmaciones
  telefono: "3185557499",
  // Ciudad de residencia del paciente
  ciudad: "Medellin",
  // Bandera que permite el soft delete mas adelante
  activo: true
};

// Ejecuto la insercion captando la respuesta de Mongo
const r1 = c.pacientes.insertOne(nuevoPaciente);

// Muestro la evidencia: el documento insertado y su id
print("INSERT en pacientes -> matchedId: " + r1.insertedId);
printjson(c.pacientes.findOne({ _id: r1.insertedId }));

// ---------------------------------------------------------------------
// 2) INSERTAR la admision de hospitalizacion de ese paciente
// ---------------------------------------------------------------------
// La admision lleva el subdocumento diagnosticoPrincipal y los
// vectores de notas de evolucion, notas de enfermeria y ordenes
const nuevaAdmision = {
  // Codigo consecutivo de la admision
  _id: "ADM-2026-0007",
  // Referencia al paciente que acabo de insertar
  pacienteId: "PAC-2026-0006",
  // Referencia al ObjectId del medico tratante (Marcela Rios, Medicina Interna)
  profesionalTratanteId: ObjectId("66a000000000000000000010"),
  // Servicio onde queda hospitalizado el paciente
  servicio: "Medicina Interna",
  // Cama asignada en hospitalizacion
  cama: "101",
  // Fecha y hora de ingreso al hospital
  fechaIngreso: ISODate("2026-10-05T07:30:00Z"),
  // Sin fecha de egreso porque la admision sigue activa
  fechaEgreso: null,
  // Estado del episodio de hospitalizacion
  estado: "Activa",
  // SUBDOCUMENTO con el diagnostico principal del ingreso
  diagnosticoPrincipal: {
    // Codigo CIE-10 del diagnostico
    codigo: "E11.9",
    // Descripcion textual del diagnostico
    descripcion: "Diabetes tipo 2 no controlada",
    // Tipo de diagnostico registrado
    tipo: "Principal"
  },
  // Subdocumento con la ubicacion fisica
  hospital: { sede: "Central", piso: 1 },
  // VECTOR: primera nota de evolucion clinica del episodio
  notasEvolucion: [
    {
      fecha: ISODate("2026-10-05T10:00:00Z"),
      turno: "Manana",
      subjetivo: "Poliuria y polidipsia de una semana, sin fiebre.",
      objetivo: "TA 132/80, FC 92, glucemia 320 mg/dl.",
      analisis: "Descompensacion metabolica por diabetes tipo 2.",
      plan: "Hidratacion, esquema de insulina y controles glicemicos."
    }
  ],
  // VECTOR: primera nota de enfermeria del turno
  notasEnfermeria: [
    { fecha: ISODate("2026-10-05T06:00:00Z"), turno: "Manana", observacion: "Se reciben signos vitales dentro de parametros." }
  ],
  // VECTOR: ordenes de medicamento activas para vigilancia farmacologica
  ordenesMedicamentos: [
    { medicamento: "Insulina regular 6 UI", dosis: "6 UI", frecuencia: "Cada 8 horas", estado: "Activa" },
    { medicamento: "Solucion salina 0.9 % 500 ml", dosis: "500 ml", frecuencia: "Cada 8 horas", estado: "Activa" }
  ]
};

// Ejecuto la insercion y capturo la respuesta
const r2 = c.admisiones.insertOne(nuevaAdmision);

// Muestro la evidencia del insert en admisiones
print("INSERT en admisiones -> insertedId: " + r2.insertedId);
printjson(c.admisiones.findOne({ _id: r2.insertedId }, { _id: 1, pacienteId: 1, servicio: 1, diagnosticoPrincipal: 1 }));

// ---------------------------------------------------------------------
// 3) INSERTAR el primer control de signos vitales de la admision
// ---------------------------------------------------------------------
// Documento de la coleccion signos_vitales asociado a la admision nueva
const nuevoSigno = {
  // Consecutivo interno del control (uso el maximo + 1 calculado con aggregate)
  _id: NumberInt(c.signos_vitales.find().sort({ _id: -1 }).limit(1).toArray()[0]._id + 1),
  // Referencia al paciente
  pacienteId: "PAC-2026-0006",
  // Referencia a la admision activa
  admisionId: "ADM-2026-0007",
  // Fecha del control
  fecha: ISODate("2026-10-05T08:00:00Z"),
  // Turno en que se tomo el control
  turno: "Manana",
  // Valores medidos en el control
  taSistolica: NumberInt(136),
  taDiastolica: NumberInt(84),
  fc: NumberInt(92),
  fr: NumberInt(18),
  spo2: NumberInt(97),
  temperatura: 37.1
};

// Ejecuto la insercion y evidencio el resultado
const r3 = c.signos_vitales.insertOne(nuevoSigno);
print("INSERT en signos_vitales -> insertedId: " + r3.insertedId);
print("conteo final de signos: " + c.signos_vitales.countDocuments());
