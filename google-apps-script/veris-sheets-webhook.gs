const SPREADSHEET_ID = '10IpT8vGiYo21YD1oHhThbI73RVAj8MrTKUs5cZTQjKk';
const SHEET_NAME = 'Клієнти';

const RISK_COLORS = {
  'НИЗЬКИЙ': '#D9EAD3',
  'СЕРЕДНІЙ': '#FFF2CC',
  'ВИСОКИЙ': '#FCE5CD',
  'ДУЖЕ ВИСОКИЙ': '#F4CCCC'
};

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}');
    if (!Array.isArray(payload.row)) {
      return jsonResponse({ ok: false, error: 'Missing row array' }, 400);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: `Sheet not found: ${SHEET_NAME}` }, 404);
    }

    sheet.appendRow(payload.row);

    const rowIndex = sheet.getLastRow();
    const risk = String(payload.row[26] || '').trim().toUpperCase();
    const background = RISK_COLORS[risk] || '#FFFFFF';
    sheet.getRange(rowIndex, 1, 1, payload.row.length).setBackground(background);

    return jsonResponse({ ok: true, rowIndex });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message }, 500);
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: 'Veris Google Sheets webhook',
    spreadsheetId: SPREADSHEET_ID,
    sheetName: SHEET_NAME
  }, 200);
}

function jsonResponse(body, status) {
  return ContentService
    .createTextOutput(JSON.stringify({ status, ...body }))
    .setMimeType(ContentService.MimeType.JSON);
}
