/**
 * HEAT — Google Apps Script
 * Recebe POST JSON do app e escreve nas abas "Erros" e "Tarefas".
 * Retorna { success: true, count: N } ou { success: false, error: "..." }
 */

const SHEET_ERRORS = 'Erros';
const SHEET_TASKS  = 'Tarefas';

const HEADERS_ERRORS = [
  'Data', 'Avaliador', 'Projeto', 'Aplicação', 'Conjunto de Heurísticas',
  'Erro Nº', 'Fase', 'ID da Tarefa', 'Nome da Tarefa', 'Heurísticas',
  'Classificação', 'Severidade', 'Especificidade',
  'Tipo de Localização', 'Localização', 'Descrição', 'Recomendação',
];

const HEADERS_TASKS = [
  'Tarefa Nº', 'ID da Tarefa', 'Nome da Tarefa',
  'Duração', 'Concluída', 'Erros registrados',
];

function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const payload = JSON.parse(e.postData.contents);
    const ss      = SpreadsheetApp.getActiveSpreadsheet();

    // ── Aba de Erros ──────────────────────────────────────────────────
    const errSheet = getOrCreateSheet(ss, SHEET_ERRORS, HEADERS_ERRORS);
    const errors   = payload.errors || [];
    const errRows  = errors.map(row => HEADERS_ERRORS.map(h => row[h] ?? ''));
    if (errRows.length) errSheet.getRange(errSheet.getLastRow() + 1, 1, errRows.length, HEADERS_ERRORS.length).setValues(errRows);

    // ── Aba de Tarefas ────────────────────────────────────────────────
    const taskSheet = getOrCreateSheet(ss, SHEET_TASKS, HEADERS_TASKS);
    const tasks     = payload.tasks || [];
    const taskRows  = tasks.map(row => HEADERS_TASKS.map(h => row[h] ?? ''));
    if (taskRows.length) taskSheet.getRange(taskSheet.getLastRow() + 1, 1, taskRows.length, HEADERS_TASKS.length).setValues(taskRows);

    output.setContent(JSON.stringify({ success: true, count: errRows.length }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.message }));
  }

  return output;
}

/** Retorna a aba existente ou cria uma nova com cabeçalhos. */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Necessário para que o Apps Script aceite requisições externas sem autenticação OAuth. */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ status: 'HEAT endpoint online' }))
    .setMimeType(ContentService.MimeType.JSON);
}