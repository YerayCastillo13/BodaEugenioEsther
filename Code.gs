/**
 * Apps Script para "Invitados a boda" — recibe las confirmaciones del
 * formulario de la web y las añade como una fila nueva en "Hoja 1".
 *
 * Columnas esperadas (en este orden, fila 1 = cabecera):
 * A: Fecha | B: Nombre | C: Asistencia | D: Acompañantes | E: Alergias | F: Notas
 */

var SHEET_NAME = "Hoja 1";

// Seguridad: setValues() interpreta como FÓRMULA cualquier texto que empiece
// por = + - @, y el formulario es público. Sin esto, alguien podría escribir
// p.ej. =IMPORTXML(...) en "Notas" y ejecutarlo en tu hoja. Se antepone un
// apóstrofo para que se guarde siempre como texto, y se limita la longitud.
function sanitize(value, maxLen) {
  var s = String(value || "").trim().substring(0, maxLen || 300);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  // Bloqueo: si dos invitados envían a la vez, ambos podían calcular la misma
  // "primera fila vacía" y uno pisaba al otro.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = JSON.parse(e.postData.contents);

    var nombre = sanitize(data.nombre, 120);
    var asistencia = data.asiste === "Sí" ? "Aceptada" : "Rechazada";
    var acompanantes = parseAcompanantes(data.acompanante);
    var alergias = sanitize(data.restricciones, 300);
    var notas = sanitize(data.notas, 500);
    var fecha = new Date();

    if (!nombre) {
      return jsonResponse({ ok: false, error: "Falta el nombre" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "No se encontró la hoja '" + SHEET_NAME + "'" });
    }

    var targetRow = findFirstEmptyRow(sheet);
    sheet.getRange(targetRow, 1, 1, 6).setValues([[fecha, nombre, asistencia, acompanantes, alergias, notas]]);
    SpreadsheetApp.flush();

    return jsonResponse({ ok: true, row: targetRow });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// Busca la primera fila realmente vacía a partir de la 2 (la 1 es cabecera),
// comprobando solo si hay TEXTO en la columna B (Nombre). No usamos
// getLastRow()/appendRow() porque en esta hoja hay formato (bordes, color...)
// aplicado a varias filas sin contenido, y Sheets las cuenta como "ocupadas"
// aunque estén vacías de verdad. Leemos un bloque amplio fijo (500 filas) y
// nos quedamos con la primera cuya columna B no tenga texto.
function findFirstEmptyRow(sheet) {
  var BLOCK = 500;
  var values = sheet.getRange(2, 2, BLOCK, 1).getValues(); // columna B, filas 2..501
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === "") {
      return i + 2; // +2 porque el bloque empieza en la fila 2
    }
  }
  // Si las 500 primeras filas estuvieran todas ocupadas (caso extremo),
  // añadimos justo después del final real de contenido.
  return sheet.getLastRow() + 1;
}

function parseAcompanantes(value) {
  if (value === undefined || value === null || value === "") return "";
  var n = Number(value);
  return (isNaN(n) || n < 0 || n > 20) ? "" : Math.floor(n);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función de prueba: ejecútala manualmente desde el editor (botón ▶) para
// comprobar que escribe en la fila correcta.
function test() {
  doPost({
    postData: {
      contents: JSON.stringify({
        nombre: "Prueba Test",
        asiste: "Sí",
        acompanante: "2",
        restricciones: "Sin gluten",
        notas: "Fila de prueba, se puede borrar"
      })
    }
  });
}

// DIAGNÓSTICO: ejecuta esto manualmente (botón ▶, selecciona "diagnostico")
// y mira el resultado en Ver → Registros (o Ejecuciones) para ver exactamente
// qué contiene cada celda de las filas 2 a 6 (incluyendo caracteres
// invisibles), y así saber por qué esas filas cuentan como "ocupadas".
function diagnostico() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var range = sheet.getRange(1, 1, 6, 6).getValues();
  for (var r = 0; r < range.length; r++) {
    for (var c = 0; c < range[r].length; c++) {
      var val = range[r][c];
      Logger.log(
        "Fila " + (r + 1) + ", Col " + (c + 1) + ": [" + val + "] " +
        "(longitud=" + String(val).length + ", vacía=" + (String(val).trim() === "") + ")"
      );
    }
  }
  Logger.log("getLastRow() dice: " + sheet.getLastRow());
}
