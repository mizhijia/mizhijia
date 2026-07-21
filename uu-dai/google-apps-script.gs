const SHEET_NAME = 'Đăng ký ưu đãi';
const SPREADSHEET_TITLE = 'Soojee - Khách đăng ký ưu đãi';

function setup() {
  const spreadsheet = SpreadsheetApp.create(SPREADSHEET_TITLE);
  const sheet = spreadsheet.getActiveSheet();
  sheet.setName(SHEET_NAME);
  sheet.appendRow(['Thời gian', 'Tên khách hàng', 'Số điện thoại', 'Tỉnh / Thành phố', 'Sản phẩm quan tâm', 'Trạng thái']);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#19345c').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, 6);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId());
  Logger.log(spreadsheet.getUrl());
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const name = String(data.name || '').trim();
  const phone = String(data.phone || '').trim();
  const province = String(data.province || '').trim();
  const product = String(data.product || '').trim();

  if (!name || !phone || !province || !product) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, message: 'Thiếu thông tin bắt buộc.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  getLeadSheet_().appendRow([new Date(), name, phone, province, product, 'Mới']);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('请先运行 setup 函数创建客户登记表。');
  return SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
}
