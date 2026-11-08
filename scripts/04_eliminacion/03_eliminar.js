// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// crud/03_eliminar.js - Operacion DELETE del subsistema de
// hospitalizacion: borrado logico (soft delete) en pacientes y
// borrado fisico (deleteOne) en signos vitales
// =====================================================================

// Me conecto a la base de datos hce_hospitalizacion del modelo U2
const c = db.getSiblingDB("hce_hospitalizacion");

// ---------------------------------------------------------------------
// 1) SOFT DELETE: desactivo al paciente en vez de borrarlo
// ---------------------------------------------------------------------
// En salud no se borra fisicamente la informacion clinica: se marca
// el registro como inactivo para conservar la trazabilidad de la HCE
const r1 = c.pacientes.updateOne(
  // Filtro por el paciente de prueba creado en 01_insertar.js
  { _id: "PAC-2026-0006" },
  { $set: { activo: false } }
);

// Evidencia del borrado logico
print("SOFT DELETE pacientes -> matched: " + r1.matchedCount + ", modified: " + r1.modifiedCount);
printjson(c.pacientes.findOne({ _id: "PAC-2026-0006" }, { _id: 1, apellidos: 1, activo: 1 }));

// ---------------------------------------------------------------------
// 2) SOFT DELETE de la admision: la marco como anulada
// ---------------------------------------------------------------------
// Marco la admision asociada como anulada para simular el cierre del
// episodio sin perder el documento y su evolucion
const r2 = c.admisiones.updateOne(
  { _id: "ADM-2026-0007" },
  // Cambio el estado y dejo constancia de la fecha de egreso
  { $set: { estado: "Anulada", fechaEgreso: ISODate("2026-10-10T08:00:00Z") } }
);

// Evidencia del cierre de la admision
print("SOFT DELETE admisiones -> matched: " + r2.matchedCount + ", modified: " + r2.modifiedCount);
printjson(c.admisiones.findOne({ _id: "ADM-2026-0007" }, { _id: 1, estado: 1, fechaEgreso: 1 }));

// ---------------------------------------------------------------------
// 3) HARD DELETE con deleteOne: suprimo un documento de prueba
// ---------------------------------------------------------------------
// Los controles de signos vitales de una admision anulada no tienen
// valor clinico, asi que se eliminan fisicamente con deleteOne
const r3 = c.signos_vitales.deleteOne({
  // Control de signos vitales insertado en 01_insertar.js
  pacienteId: "PAC-2026-0006",
  admisionId: "ADM-2026-0007"
});

// Muestro la evidencia del borrado fisico
print("HARD DELETE signos_vitales -> deletedCount: " + r3.deletedCount);

// ---------------------------------------------------------------------
// 4) deleteMany condicional: limpieza de registros anulados de prueba
// ---------------------------------------------------------------------
// deleteMany borra todos los documentos que cumplan el filtro:
// aqui la admision anulada del paciente de prueba
const r4 = c.admisiones.deleteMany({
  _id: "ADM-2026-0007",
  estado: "Anulada"
});

// Evidencia del borrado con deleteMany
print("HARD DELETE admisiones -> deletedCount: " + r4.deletedCount);

// ---------------------------------------------------------------------
// 5) Verificacion final de la integridad del borrado
// ---------------------------------------------------------------------
// Consulto el paciente inactivo para confirmar que sigue existiendo
print("paciente PAC-2026-0006 sigue en la coleccion: " + (c.pacientes.findOne({ _id: "PAC-2026-0006" }) !== null));

// Confirmo que la admision y el control de prueba ya no existen
print("admision ADM-2026-0007 restante: " + c.admisiones.countDocuments({ _id: "ADM-2026-0007" }));
print("signos de ADM-2026-0007 restantes: " + c.signos_vitales.countDocuments({ admisionId: "ADM-2026-0007" }));

// Dejo los conteos de la base como evidencia final
print("conteo final: pacientes=" + c.pacientes.countDocuments() +
      ", admisiones=" + c.admisiones.countDocuments() +
      ", signos_vitales=" + c.signos_vitales.countDocuments());
