// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// crud/02_actualizar.js - Operacion UPDATE del subsistema de
// hospitalizacion: actualizacion de campo simple, de un subdocumento
// anidado y agregacion de un elemento a un vector con $push
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion del modelo U2
const c = db.getSiblingDB("hce_hospitalizacion");

// ---------------------------------------------------------------------
// 1) UPDATE de un campo simple: telefono del paciente nuevo
// ---------------------------------------------------------------------
// Filtro por el _id del paciente insertado en 01_insertar.js
const filtroPaciente = { _id: "PAC-2026-0006" };

// Con $set cambio solo el telefono sin tocar el resto del documento
const r1 = c.pacientes.updateOne(filtroPaciente, { $set: { telefono: "3185557400" } });

// Muestro la evidencia: cuantos documentos coincidieron y se modificaron
print("UPDATE pacientes (telefono) -> matched: " + r1.matchedCount + ", modified: " + r1.modifiedCount);

// Evidencia del nuevo valor guardado
printjson(c.pacientes.findOne(filtroPaciente, { _id: 1, nombres: 1, apellidos: 1, telefono: 1 }));

// ---------------------------------------------------------------------
// 2) UPDATE de un subdocumento anidado (diagnosticoPrincipal)
// ---------------------------------------------------------------------
// Filtro por la admision creada en 01_insertar.js
const filtroAdmision = { _id: "ADM-2026-0007" };

// Con notacion de punto llego al campo dentro del subdocumento y lo sustituyo
const r2 = c.admisiones.updateOne(
  filtroAdmision,
  {
    $set: {
      // El medico afina el diagnostico tras los resultados de laboratorio
      "diagnosticoPrincipal.codigo": "E11.65",
      "diagnosticoPrincipal.descripcion": "Diabetes tipo 2 con hiperglucemia",
    }
  }
);

// Evidencia del update en el subdocumento
print("UPDATE admisiones (diagnosticoPrincipal) -> matched: " + r2.matchedCount + ", modified: " + r2.modifiedCount);
printjson(c.admisiones.findOne(filtroAdmision, { _id: 1, diagnosticoPrincipal: 1 }));

// ---------------------------------------------------------------------
// 3) UPDATE con $push: agrego una nota de evolucion al vector
// ---------------------------------------------------------------------
// $push annade un elemento al final del arreglo notasEvolucion sin
// reemplazar los existentes, conservando la evolucion historica
const r3 = c.admisiones.updateOne(
  filtroAdmision,
  {
    $push: {
      notasEvolucion: {
        // Segunda nota de evolucion, dos dias despues del ingreso
        fecha: ISODate("2026-10-07T09:30:00Z"),
        turno: "Manana",
        subjetivo: "Refiere menos sed y micciones menos frecuentes.",
        objetivo: "TA 128/78, FC 86, glucemia 180 mg/dl.",
        analisis: "Respuesta favorable al esquema de insulina.",
        plan: "Ajustar insulina segun pantallas glicemicas y educar al paciente."
      }
    }
  }
);

// Evidencia del $push: cuento cuantas notas quedaron en el vector
print("UPDATE admisiones ($push nota) -> matched: " + r3.matchedCount + ", modified: " + r3.modifiedCount);
const adm = c.admisiones.findOne(filtroAdmision, { _id: 1, notasEvolucion: 1 });
print("notasEvolucion en ADM-2026-0007: " + adm.notasEvolucion.length);

// ---------------------------------------------------------------------
// 4) UPDATE con operador arreglo: cierro la orden de insulina
// ---------------------------------------------------------------------
// El filtro posicional "$" apunta al elemento del vector que cumplio
// la condicion del filtro, para cambiar solo ese elemento
const r4 = c.admisiones.updateOne(
  // La admision y la orden cuyo medicamento es insulina regular
  { _id: "ADM-2026-0007", "ordenesMedicamentos.medicamento": "Insulina regular 6 UI" },
  { $set: { "ordenesMedicamentos.$.estado": "Completada" } }
);

// Evidencia del cambio de estado en la orden
print("UPDATE admisiones (orden $) -> matched: " + r4.matchedCount + ", modified: " + r4.modifiedCount);
printjson(c.admisiones.findOne(filtroAdmision, { _id: 1, ordenesMedicamentos: 1 }));
