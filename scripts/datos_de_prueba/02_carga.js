// =====================================================================
// TRABAJO BASES DE DATOS 2 - UNIDAD 3 (individual)
// Estudiante: Julian Camilo Cabrera Echeverri
// 02_carga.js - Puebla la base hce_hospitalizacion con datos simulados
// coherentes del subsistema de hospitalizacion de la HCE
// =====================================================================

// Abrevio la conexion a la base para no repetirla en cada instruccion
const c = db.getSiblingDB("hce_hospitalizacion");

// ---------------------------------------------------------------------
// PACIENTES: 5 pacientes con datos basicos
// ---------------------------------------------------------------------
// Inserto los pacientes uno a uno, con la identificacion personal y el codigo interno PAC-2026-000X
c.pacientes.insertMany([
  { _id: "PAC-2026-0001", identificacion: "1032456789", nombres: "Luis Fernando", apellidos: "Cardona Restrepo", eps: "Sanitas", fechaNacimiento: ISODate("1968-03-14T00:00:00Z"), sexo: "M", telefono: "3045551201", ciudad: "Medellin", activo: true },
  { _id: "PAC-2026-0002", identificacion: "1076543210", nombres: "Maria Jose", apellidos: "Torres Salazar", eps: "Sura", fechaNacimiento: ISODate("1994-11-02T00:00:00Z"), sexo: "F", telefono: "3125553402", ciudad: "Itagui", activo: true },
  { _id: "PAC-2026-0003", identificacion: "1099887766", nombres: "Camila", apellidos: "Zuluaga Perez", eps: "Salud Total", fechaNacimiento: ISODate("2001-06-27T00:00:00Z"), sexo: "F", telefono: "3205557803", ciudad: "Envigado", activo: true },
  { _id: "PAC-2026-0004", identificacion: "1020034512", nombres: "Andres Felipe", apellidos: "Ospina Mejia", eps: "Sura", fechaNacimiento: ISODate("1975-09-18T00:00:00Z"), sexo: "M", telefono: "3015556104", ciudad: "Medellin", activo: true },
  { _id: "PAC-2026-0005", identificacion: "1009988771", nombres: "Valentina", apellidos: "Giraldo Osorio", eps: "Coomeva", fechaNacimiento: ISODate("1999-01-23T00:00:00Z"), sexo: "F", telefono: "3335556905", ciudad: "Bello", activo: true }
]);

// ---------------------------------------------------------------------
// PROFESIONALES: 6 medicos con su especialidad
// ---------------------------------------------------------------------
// Guardo los ObjectIds fijos para poder referenciarlos en las admisiones
const idCarlo = ObjectId("66a00000000000000000000b");
const idLaur = ObjectId("66a00000000000000000000c");
const idJorg = ObjectId("66a00000000000000000000d");
const idMex = ObjectId("66a00000000000000000000e");
const idAndr = ObjectId("66a00000000000000000000f");
const idMarc = ObjectId("66a000000000000000000010");

// Cada profesional con registro medico y estado activo
c.profesionales.insertMany([
  { _id: idCarlo, identificacion: "71524580", nombres: "Carlos Andres", apellidos: "Restrepo Gomez", especialidad: "Medicina General", registroMedico: "RM-45120", activo: true },
  { _id: idLaur, identificacion: "10298374", nombres: "Laura Milena", apellidos: "Zapata Rios", especialidad: "Pediatria", registroMedico: "RM-47310", activo: true },
  { _id: idJorg, identificacion: "71456298", nombres: "Jorge Ivan", apellidos: "Munoz Cardona", especialidad: "Cardiologia", registroMedico: "RM-40877", activo: true },
  { _id: idMex, identificacion: "10384761", nombres: "Diana Patricia", apellidos: "Velez Ortiz", especialidad: "Ginecologia", registroMedico: "RM-43990", activo: true },
  { _id: idAndr, identificacion: "71897456", nombres: "Andres Felipe", apellidos: "Gomez Londono", especialidad: "Ortopedia", registroMedico: "RM-46023", activo: true },
  { _id: idMarc, identificacion: "10125487", nombres: "Marcela", apellidos: "Rios Betancur", especialidad: "Medicina Interna", registroMedico: "RM-42156", activo: true }
]);

// ---------------------------------------------------------------------
// ADMISIONES: 6 episodios de hospitalizacion
// ---------------------------------------------------------------------
// Cada admision lleva el subdocumento diagnosticoPrincipal, la
// ubicacion en hospital y los vectores de notas y ordenes
// Guardo las admisiones en un arreglo y las inserto una a una,
// para que si alguna falla la validacion se vea cual fue
const admisiones = [
  {
    _id: "ADM-2026-0001",
    pacienteId: "PAC-2026-0004",
    profesionalTratanteId: idCarlo,
    servicio: "Medicina Interna",
    cama: "312",
    fechaIngreso: ISODate("2026-03-02T12:40:00Z"),
    fechaEgreso: ISODate("2026-03-06T15:15:00Z"),
    estado: "Egresada",
    diagnosticoPrincipal: { codigo: "A40.9", descripcion: "Sepsis bacteriana", tipo: "Principal" },
    hospital: { sede: "Central", piso: 3 },
    notasEvolucion: [
      { fecha: ISODate("2026-03-02T15:00:00Z"), turno: "Noche", subjetivo: "Dolor toracico y fiebre hace dos dias.", objetivo: "TA 128/78 mmHg, FC 104 lpm, T 38.6 oC.", analisis: "Sepsis de origen cutaneo", plan: "Hospitalizar en Medicina Interna, iniciar antibiotico combinado y soporte hidroelectrolitico." },
      { fecha: ISODate("2026-03-05T13:30:00Z"), turno: "Manana", subjetivo: "Refiere remision de la fiebre.", objetivo: "TA 122/76, FC 88, T 36.8.", analisis: "Buena respuesta antibiotica.", plan: "Continuar esquema y preparar egreso con cita de seguimiento." },
      { fecha: ISODate("2026-03-06T12:00:00Z"), turno: "Manana", subjetivo: "Asintomatica la noche anterior.", objetivo: "TA 120/74, FC 84, T 36.6.", analisis: "Egreso clinico con control de infeccion.", plan: "Egreso con tratamiento oral y control por consulta externa." }
    ],
    notasEnfermeria: [
      { fecha: ISODate("2026-03-03T06:00:00Z"), turno: "Noche", observacion: "Paciente descansando, sin fiebre durante el turno." }
    ],
    ordenesMedicamentos: [
      { medicamento: "Piperacilina Tazobactam 4.5 g", dosis: "4.5 g", frecuencia: "Cada 8 horas", estado: "Completada" },
      { medicamento: "Paracetamol 1 g", dosis: "1 g", frecuencia: "Cada 8 horas si hay fiebre", estado: "Completada" }
    ],
    resumenAlta: { fecha: ISODate("2026-03-06"), diasEstancia: 4, condicion: "Mejorado", controlesExterno: 7 }
  },
  {
    _id: "ADM-2026-0002",
    pacienteId: "PAC-2026-0002",
    profesionalTratanteId: idJorg,
    servicio: "Cardiologia",
    cama: "508",
    fechaIngreso: ISODate("2026-04-12T02:10:00Z"),
    fechaEgreso: ISODate("2026-04-18T20:00:00Z"),
    estado: "Egresada",
    diagnosticoPrincipal: { codigo: "I21.0", descripcion: "Infarto agudo de miocardio", tipo: "Principal" },
    hospital: { sede: "Central", piso: 5 },
    notasEvolucion: [
      { fecha: ISODate("2026-04-12T05:00:00Z"), turno: "Manana", subjetivo: "Dolor precordial en el acceso.", objetivo: "TA 145/90, FC 110, SpO2 94 %.", analisis: "IAM invasivo de pared anterior en evolución.", plan: "Cateterismo urgente, doble antiagregación y monitoreo continuo." },
      { fecha: ISODate("2026-04-13T06:00:00Z"), turno: "Noche", subjetivo: "En reposo sin episodios de angina.", objetivo: "TA 138/84, FC 92, SpO2 96 %.", analisis: "Post cateterismo con flujo normalizado.", plan: "Mantener antiagregacion y betabloqueo." },
      { fecha: ISODate("2026-04-18T09:00:00Z"), turno: "Manana", subjetivo: "Sin angina a mínimo esfuerzos.", objetivo: "TA 124/78, FC 72, SpO2 98 %.", analisis: "Evolución favorable; se habilita para egreso.", plan: "Egreso con seguimiento por consulta externa en 7 días." }
    ],
    notasEnfermeria: [
      { fecha: ISODate("2026-04-13T22:00:00Z"), turno: "Noche", observacion: "Monitorización continua sin eventos arrítmicos." }
    ],
    ordenesMedicamentos: [
      { medicamento: "Aspirina 100 mg", dosis: "100 mg", frecuencia: "Cada 24 horas", estado: "Completada" },
      { medicamento: "Clopidogrel 75 mg", dosis: "75 mg", frecuencia: "Cada 24 horas", estado: "Completada" },
      { medicamento: "Atorvastatina 40 mg", dosis: "40 mg", frecuencia: "Cada 24 horas", estado: "Completada" },
      { medicamento: "Omeprazol 20 mg", dosis: "20 mg", frecuencia: "Cada 24 horas", estado: "Completada" }
    ],
    resumenAlta: { fecha: ISODate("2026-04-18"), diasEstancia: 6, condicion: "Mejorado", controlesExterno: 7 }
  },
  {
    _id: "ADM-2026-0003",
    pacienteId: "PAC-2026-0003",
    profesionalTratanteId: idLaur,
    servicio: "Pediatria",
    cama: "204",
    fechaIngreso: ISODate("2026-05-23T09:00:00Z"),
    fechaEgreso: ISODate("2026-05-27T17:05:00Z"),
    estado: "Egresada",
    diagnosticoPrincipal: { codigo: "J18.1", descripcion: "Neumonia lobar", tipo: "Principal" },
    hospital: { sede: "Central", piso: 2 },
    notasEvolucion: [
      { fecha: ISODate("2026-05-23T16:00:00Z"), turno: "Tarde", subjetivo: "Tos productiva y fiebre alta de 3 dias.", objetivo: "TA 104/66, FC 108, T 39.2 oC.", analisis: "Neumonia adquirida en la comunidad.", plan: "Iniciar ceftriaxona y control radiológico." },
      { fecha: ISODate("2026-05-26T14:00:00Z"), turno: "Tarde", subjetivo: "Refiere mejoria del dolor y respiracion.", objetivo: "TA 102/64, FC 92, T 36.7 oC.", analisis: "Resolucion de la fiebre y mejoría radiológica.", plan: "Pasar a antibiotico oral 24 horas antes del egreso." }
    ],
    notasEnfermeria: [
      { fecha: ISODate("2026-05-24T14:00:00Z"), turno: "Tarde", observacion: "Mantiene buena tolerancia oral sin requerir antitérmicos." }
    ],
    ordenesMedicamentos: [
      { medicamento: "Ceftriaxona 1 g", dosis: "1 g", frecuencia: "Cada 24 horas", estado: "Completada" },
      { medicamento: "Acetaminofen 500 mg", dosis: "500 mg", frecuencia: "Cada 6 horas si hay fiebre", estado: "Completada" },
      { medicamento: "Ibuprofeno 400 mg", dosis: "400 mg", frecuencia: "Cada 8 horas", estado: "Completada" }
    ],
    resumenAlta: { fecha: ISODate("2026-05-27"), diasEstancia: 4, condicion: "Mejorado", controlesExterno: 4 }
  },
  {
    _id: "ADM-2026-0004",
    pacienteId: "PAC-2026-0001",
    profesionalTratanteId: idAndr,
    servicio: "Ortopedia",
    cama: "107",
    fechaIngreso: ISODate("2026-06-14T09:05:00Z"),
    fechaEgreso: null,
    estado: "Activa",
    diagnosticoPrincipal: { codigo: "S82.0", descripcion: "Fractura de patela", tipo: "Principal" },
    hospital: { sede: "Central", piso: 1 },
    notasEvolucion: [
      { fecha: ISODate("2026-06-14T15:00:00Z"), turno: "Tarde", subjetivo: "Caida en bicicleta con dolor en la rodilla derecha.", objetivo: "TA 132/80, FC 84, T 36.5 oC, miembro alineado con ferula.", analisis: "Fractura patelar desplazada confirmada por radiografía.", plan: "Fijación quirúrgica programada y analgesia controlada." },
      { fecha: ISODate("2026-06-16T09:30:00Z"), turno: "Manana", subjetivo: "Dolor tolerable con analgésicos.", objetivo: "TA 128/78, FC 76, marcha no carga.", analisis: "Postoperatorio de 48 horas sin signos de infección.", plan: "Iniciar rehabilitación asistida y control de herida." },
      { fecha: ISODate("2026-06-19T13:00:00Z"), turno: "Tarde", subjetivo: "Marcha con apoyo parcial tolerada.", objetivo: "TA 126/76, FC 74, arco de movimiento progresivo.", analisis: "Evolución funcional favorable.", plan: "Continuar fisioterapia diaria y analgesia en descenso." },
      { fecha: ISODate("2026-06-22T14:00:00Z"), turno: "Tarde", subjetivo: "Refiere mejora funcional para actividades basicas.", objetivo: "TA 122/74, FC 70, herida en cicatrizacion.", analisis: "Cicatrización avanzada sin complicaciones.", plan: "Continuar control analgésico y valoración por consulta externa." }
    ],
    notasEnfermeria: [
      { fecha: ISODate("2026-06-15T06:00:00Z"), turno: "Noche", observacion: "Ferula en sitio, dolor controlado con medicación pautada." }
    ],
    ordenesMedicamentos: [
      { medicamento: "Enoxaparina 40 mg", dosis: "40 mg", frecuencia: "Cada 24 horas", estado: "Activa" },
      { medicamento: "Metformina 850 mg", dosis: "850 mg", frecuencia: "Cada 12 horas", estado: "Activa" },
      { medicamento: "Tramadol 50 mg", dosis: "50 mg", frecuencia: "Cada 8 horas si hay dolor", estado: "Activa" },
      { medicamento: "Omeprazol 20 mg", dosis: "20 mg", frecuencia: "Cada 24 horas", estado: "Suspendida" }
    ]
  },
  {
    _id: "ADM-2026-0005",
    pacienteId: "PAC-2026-0003",
    profesionalTratanteId: idMarc,
    servicio: "Medicina Interna",
    cama: "402",
    fechaIngreso: ISODate("2026-07-02T23:40:00Z"),
    fechaEgreso: null,
    estado: "Activa",
    diagnosticoPrincipal: { codigo: "A41.9", descripcion: "Sepsis no especificada", tipo: "Principal" },
    hospital: { sede: "Central", piso: 4 },
    notasEvolucion: [
      { fecha: ISODate("2026-07-03T03:00:00Z"), turno: "Noche", subjetivo: "Fiebre y desorientacion de 2 dias.", objetivo: "TA 150/86, FC 106, T 38.9 oC, lactato elevado.", analisis: "Sepsis probable de origen urinario en estudio.", plan: "Cultivos, antibiótico de amplio espectro y cargas de líquidos." },
      { fecha: ISODate("2026-07-05T08:00:00Z"), turno: "Manana", subjetivo: "Refiere mejoria con el antibiótico.", objetivo: "TA 134/80, FC 88, T 37.2 oC.", analisis: "Respuesta favorable al esquema antibiótico.", plan: "Ajustar esquema según resultado de urocultivo." },
      { fecha: ISODate("2026-07-08T14:30:00Z"), turno: "Tarde", subjetivo: "Sin nichos febriles.", objetivo: "TA 120/76, FC 78, T 36.7 oC.", analisis: "Estabilidad hemodinámica con control de la infección.", plan: "Deambular y seguimiento ambulatorio." },
      { fecha: ISODate("2026-07-10T09:00:00Z"), turno: "Manana", subjetivo: "Sin sintomas desde el relevo anterior.", objetivo: "TA 118/74, FC 74, T 36.6 oC.", analisis: "Evolución clínica favorable.", plan: "Continuar infusión y transición a oral para alta." }
    ],
    notasEnfermeria: [
      { fecha: ISODate("2026-07-04T14:00:00Z"), turno: "Tarde", observacion: "Balance de líquidos en rangos esperados." }
    ],
    ordenesMedicamentos: [
      { medicamento: "Ceftriaxona 1 g", dosis: "1 g", frecuencia: "Cada 24 horas", estado: "Activa" },
      { medicamento: "Metronidazol 500 mg", dosis: "500 mg", frecuencia: "Cada 8 horas", estado: "Activa" },
      { medicamento: "Lactato de Ringer 1000 ml", dosis: "1000 ml", frecuencia: "Cada 8 horas", estado: "Activa" },
      { medicamento: "Acetaminofen 1 g", dosis: "1 g", frecuencia: "Cada 8 horas si hay fiebre", estado: "Activa" }
    ]
  },
  {
    _id: "ADM-2026-0006",
    pacienteId: "PAC-2026-0002",
    profesionalTratanteId: idCarlo,
    servicio: "Medicina Interna",
    cama: "305",
    fechaIngreso: ISODate("2026-09-18T08:20:00Z"),
    fechaEgreso: null,
    estado: "Activa",
    diagnosticoPrincipal: { codigo: "I10", descripcion: "Hipertension arterial esencial", tipo: "Principal" },
    hospital: { sede: "Central", piso: 3 },
    notasEvolucion: [
      { fecha: ISODate("2026-09-18T14:00:00Z"), turno: "Manana", subjetivo: "Refiere cefalea y mareo desde hace tres dias.", objetivo: "TA 176/102, FC 92, SpO2 96 %.", analisis: "Hipertensión no controlada por suspensión del tratamiento.", plan: "Reiniciar losartan, agregar amlodipino y monitorizar tensión cada 6 horas." },
      { fecha: ISODate("2026-09-20T13:00:00Z"), turno: "Manana", subjetivo: "Cefalea en mejoria.", objetivo: "TA 146/90, FC 82, SpO2 98 %.", analisis: "Descenso gradual de la tensión.", plan: "Continuar esquema dual y reforzar adherencia." },
      { fecha: ISODate("2026-09-22T08:00:00Z"), turno: "Manana", subjetivo: "Cumplimiento del tratamiento en marcha.", objetivo: "TA 138/86, FC 80, SpO2 98 %.", analisis: "Control adecuado de la tensión.", plan: "Medición por turnos y educación en estilo de vida." },
      { fecha: ISODate("2026-09-24T14:00:00Z"), turno: "Tarde", subjetivo: "Sin sintomas de alarma.", objetivo: "TA 132/82, FC 78, SpO2 98 %.", analisis: "Sin eventos de riesgo observados.", plan: "Seguimiento estrecho por consulta externa." },
      { fecha: ISODate("2026-09-25T22:00:00Z"), turno: "Noche", subjetivo: "Duerme sin cefalea.", objetivo: "TA 130/80, FC 76, SpO2 98 %.", analisis: "Control farmacologico estable.", plan: "Valorar evolucion y egreso con control ambulatorio." }
    ],
    notasEnfermeria: [
      { fecha: ISODate("2026-09-19T06:00:00Z"), turno: "Noche", observacion: "Tomas de presión nocturnas sin complicaciones." }
    ],
    ordenesMedicamentos: [
      { medicamento: "Losartan 100 mg", dosis: "100 mg", frecuencia: "Cada 24 horas", estado: "Activa" },
      { medicamento: "Amlodipino 5 mg", dosis: "5 mg", frecuencia: "Cada 24 horas", estado: "Activa" },
      { medicamento: "Hidroclorotiazida 25 mg", dosis: "25 mg", frecuencia: "Cada 24 horas", estado: "Activa" },
      { medicamento: "Atorvastatina 20 mg", dosis: "20 mg", frecuencia: "Cada 24 horas", estado: "Activa" }
    ]
  }
];

// Recorro el arreglo e inserto cada admision reportando su resultado
admisiones.forEach(function (a) {
  // Intento insertar la admision y capto el error si la validacion la rechaza
  try {
    c.admisiones.insertOne(a);
    print("insertada " + a._id);
  } catch (e) {
    print("FALLO " + a._id + ": " + e.message);
  }
});

// ---------------------------------------------------------------------
// SIGNOS VITALES: 43 controles (32 Manana, 10 Noche, 1 Tarde)
// ---------------------------------------------------------------------
// Arreglos con valores simulados coherentes, en el orden que consume el ciclo
const sistolica = [134, 128, 176, 158, 108, 118, 132, 98, 145, 152, 126, 162, 108, 84, 118, 168, 104, 112, 130, 142, 156, 96, 110, 138, 148, 124, 106, 92, 160, 144, 117, 102];
const diastolica = [84, 82, 102, 94, 70, 78, 82, 62, 88, 92, 76, 64, 72, 58, 80, 98, 66, 72, 84, 88, 92, 58, 70, 86, 90, 78, 68, 60, 94, 84, 74, 64];
const cardiaca = [104, 92, 110, 98, 88, 94, 90, 82, 100, 104, 86, 78, 90, 84, 92, 112, 84, 88, 96, 100, 108, 80, 88, 96, 102, 86, 82, 76, 110, 98, 88, 84];
const respiratoria = [22, 18, 20, 18, 16, 20, 22, 18, 21, 17, 18, 16, 20, 19, 18, 20, 19, 18, 21, 17, 22, 16, 18, 19, 18, 20, 18, 17, 20, 19, 18, 16];
const saturacion = [96, 97, 93, 95, 98, 97, 96, 99, 94, 96, 97, 98, 96, 98, 97, 93, 98, 97, 95, 96, 94, 98, 97, 96, 95, 97, 98, 99, 94, 96, 97, 98];
const temperatura = [37.2, 36.8, 38.1, 37.4, 36.6, 36.9, 37.0, 36.5, 37.8, 37.1, 36.7, 36.6, 36.9, 36.8, 37.0, 38.3, 36.8, 36.7, 37.2, 37.5, 37.6, 36.5, 36.9, 37.2, 37.3, 36.8, 36.7, 36.6, 37.4, 37.9, 36.8, 36.7];

// Liste de admisiones activas con el paciente asociado a cada una
const activas = { "ADM-2026-0004": "PAC-2026-0001", "ADM-2026-0005": "PAC-2026-0003", "ADM-2026-0006": "PAC-2026-0002" };
const admActivas = ["ADM-2026-0004", "ADM-2026-0005", "ADM-2026-0006"];

// Preparo la serie temporal de controles para recorrerla en el ciclo
let i = 0;
let idDoc = 1000;

// Genero los 32 controles del turno Manana repartidos por admision activa
while (i < 32) {
  // El dia avanza cada 6 controles para simular varios dias de seguimiento
  const dia = 20 + Math.floor(i / 6) + 1;
  const adm = admActivas[i % 3];
  // Inserto el control con los valores simulados en la posicion i
  try {
    c.signos_vitales.insertOne({
      _id: ++idDoc,
      pacienteId: activas[adm],
      admisionId: adm,
      fecha: ISODate("2026-09-" + String(dia).padStart(2, "0") + "T08:00:00Z"),
      turno: "Manana",
      taSistolica: sistolica[i],
      taDiastolica: diastolica[i],
      fc: cardiaca[i],
      fr: respiratoria[i],
      spo2: saturacion[i],
      temperatura: temperatura[i]
    });
  } catch (e) {
    print("FALLO Manana i=" + i + ": " + e.message);
  }
  // Avanzo el indice del ciclo
  i++;
}

// Genero los 10 controles del turno Noche
while (i < 42) {
  // Noche: recorro los mismos dias de seguimiento con valores alternados
  const dia = 26 - Math.floor((42 - i) / 2);
  const adm = admActivas[(i - 32) % 3];
  try {
    c.signos_vitales.insertOne({
      _id: ++idDoc,
      pacienteId: activas[adm],
      admisionId: adm,
      fecha: ISODate("2026-09-" + String(dia).padStart(2, "0") + "T22:00:00Z"),
      turno: "Noche",
      taSistolica: sistolica[(i + 3) % 32],
      taDiastolica: diastolica[(i + 3) % 32],
      fc: cardiaca[(i + 3) % 32],
      fr: respiratoria[(i + 3) % 32],
      spo2: saturacion[(i + 3) % 32],
      temperatura: temperatura[(i + 3) % 32]
    });
  } catch (e) {
    print("FALLO Noche i=" + i + ": " + e.message);
  }
  i++;
}

// Genero 1 control del turno Tarde
c.signos_vitales.insertOne({
  _id: ++idDoc,
  pacienteId: activas["ADM-2026-0006"],
  admisionId: "ADM-2026-0006",
  fecha: ISODate("2026-09-26T14:00:00Z"),
  turno: "Tarde",
  taSistolica: 104,
  taDiastolica: 70,
  fc: 118,
  fr: 18,
  spo2: 97,
  temperatura: 36.8
});

// ---------------------------------------------------------------------
// RESUMEN de la carga para dejar evidencia en la salida
// ---------------------------------------------------------------------
print("pacientes: " + c.pacientes.countDocuments());
print("profesionales: " + c.profesionales.countDocuments());
print("admisiones: " + c.admisiones.countDocuments());
print("signos_vitales: " + c.signos_vitales.countDocuments());
