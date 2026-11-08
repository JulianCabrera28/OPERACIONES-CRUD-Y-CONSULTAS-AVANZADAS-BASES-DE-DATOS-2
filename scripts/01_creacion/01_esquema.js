// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// 01_esquema.js - Crea la base de datos hce_hospitalizacion con las
// colecciones del modelo documental del subsistema de hospitalizacion:
// pacientes, profesionales, admisiones y signos_vitales.
// =====================================================================

// Me conecto (estoy dentro de la base) y borro versiones anteriores para
// reconstruir el modelo desde cero de forma repetible
const conexion = db.getSiblingDB("hce_hospitalizacion");

// Elimino las colecciones si ya existen para no duplicar datos viejos
for (const coleccion of ["pacientes", "profesionales", "admisiones", "signos_vitales"]) {
  // drop() devuelve true si existia y se borro
  conexion[coleccion].drop();
}

// Creo las colecciones con reglas de validacion (schema JSON) para que
// los documentos guardados respeten la estructura del modelo fisico
conexion.createCollection("pacientes", {
  // validator: reglas que debe cumplir cada documento de paciente
  validator: { $jsonSchema: {
    bsonType: "object",
    // propiedades exigidas del documento de paciente
    required: ["_id", "identificacion", "nombres", "apellidos", "eps"],
    properties: {
      _id: { bsonType: "string", description: "codigo interno PAC-*" },
      // identificacion del paciente (c tipo cedula deben ser 7 a 15 digitos)
      identificacion: { bsonType: "string", maxLength: 15 },
      nombres: { bsonType: "string" },
      apellidos: { bsonType: "string" },
      // EPS a la que pertenece el paciente
      eps: { bsonType: "string" },
      // fecha de nacimiento en tipo fecha
      fechaNacimiento: { bsonType: "date" },
      sexo: { enum: ["M", "F"] },
      telefono: { bsonType: "string" },
      ciudad: { bsonType: "string" },
      // activo queda false con el soft delete en lugar de borrar
      activo: { bsonType: "bool" }
    }
  } }
});

// Colecion de profesionales de la salud (medicos tratantes)
conexion.createCollection("profesionales", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "identificacion", "nombres", "apellidos", "especialidad"],
    properties: {
      _id: { bsonType: "objectId" },
      identificacion: { bsonType: "string" },
      nombres: { bsonType: "string" },
      apellidos: { bsonType: "string" },
      // especialidad con la que atiende hospitalizacion
      especialidad: { bsonType: "string" },
      registroMedico: { bsonType: "string" },
      activo: { bsonType: "bool" }
    }
  } }
});

// Colecion principal: cada admision representa un episodio completo de
// hospitalizacion con subdocumentos y vectores embebidos
conexion.createCollection("admisiones", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "pacienteId", "profesionalTratanteId", "servicio", "estado"],
    properties: {
      _id: { bsonType: "string", description: "codigo ADM-*" },
      // referencia al _id del paciente hospitalizado
      pacienteId: { bsonType: "string" },
      // referencia al ObjectId del profesional tratante
      profesionalTratanteId: { bsonType: "objectId" },
      servicio: { bsonType: "string" },
      cama: { bsonType: "string" },
      fechaIngreso: { bsonType: "date" },
      fechaEgreso: { bsonType: ["date", "null"] },
      estado: { enum: ["Activa", "Egresada", "Anulada"] },
      // SUBDOCUMENTO con el diagnostico principal del episodio
      diagnosticoPrincipal: {
        bsonType: "object",
        required: ["codigo", "descripcion", "tipo"],
        properties: {
          codigo: { bsonType: "string" },
          descripcion: { bsonType: "string" },
          tipo: { enum: ["Principal"] }
        }
      },
      // subdocumento con datos de la habitacion donde esta hospitalizado
      hospital: {
        bsonType: "object",
        properties: {
          sede: { bsonType: "string" },
          piso: { bsonType: "int" }
        }
      },
      // VECTOR de notas de evolucion clinica escritas por el medico
      notasEvolucion: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["fecha", "subjetivo", "objetivo", "analisis", "plan"],
          properties: {
            fecha: { bsonType: "date" },
            turno: { bsonType: "string" },
            subjetivo: { bsonType: "string" },
            objetivo: { bsonType: "string" },
            analisis: { bsonType: "string" },
            plan: { bsonType: "string" }
          }
        }
      },
      // VECTOR de notas de enfermeria del episodio
      notasEnfermeria: { bsonType: "array" },
      // VECTOR de ordenes de medicamento y su estado en la farmacia
      ordenesMedicamentos: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: ["medicamento", "dosis", "frecuencia", "estado"],
          properties: {
            medicamento: { bsonType: "string" },
            dosis: { bsonType: "string" },
            frecuencia: { bsonType: "string" },
            estado: { enum: ["Activa", "Completada", "Suspendida"] }
          }
        }
      },
      // subdocumento opcional con el resumen del egreso
      resumenAlta: { bsonType: ["object", "null"] }
    }
  } }
});

// Colecion de controles de signos vitales (serie temporal por paciente)
conexion.createCollection("signos_vitales", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "pacienteId", "admisionId", "fecha", "turno", "taSistolica", "taDiastolica", "fc", "fr", "spo2", "temperatura"],
    properties: {
      _id: { bsonType: "int" },
      pacienteId: { bsonType: "string" },
      admisionId: { bsonType: "string" },
      fecha: { bsonType: "date" },
      turno: { enum: ["Manana", "Tarde", "Noche"] },
      // tension arterial sistolica en mmHg
      taSistolica: { bsonType: "int" },
      // tension arterial diastolica en mmHg
      taDiastolica: { bsonType: "int" },
      // frecuencia cardiaca en lpm
      fc: { bsonType: "int" },
      // frecuencia respiratoria en rpm
      fr: { bsonType: "int" },
      // saturacion de oxigeno en porcentaje (campo spo2)
      spo2: { bsonType: "int" },
      temperatura: { bsonType: ["double", "int"] }
    }
  } }
});

// Listo: muestro las colecciones creadas como evidencia
print("colecciones creadas en hce_hospitalizacion:");
printjson(conexion.getCollectionNames().sort());
