
// Get Select text.
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  var selectStr = document.getSelection();
  sendResponse({
    text: selectStr.toString(),
    count: selectStr.toString().length
  });
});

/**
 * ファイルを開いたときのイベントハンドラ
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('拡張メニュー');
  menu.addItem('ダウンロード', 'onClickMenu');
  menu.addToUi();
}

/**
 * 拡張メニューをクリック時のイベントハンドラ
 */
function onClickMenu() {
  // dialog.html をもとにHTMLファイルを生成
  // evaluate() は dialog.html 内の GAS を実行するため（ <?= => の箇所）
  var html = HtmlService.createTemplateFromFile("dialog").evaluate();
  
  // 上記HTMLファイルをダイアログ出力
  SpreadsheetApp.getUi().showModalDialog(html,"ファイルダウンロード");
}

/**
 * jsonデータの生成
 */
function getDataJson() {
  // Set Config.
  var dataFix = '';
  var keysArray = [];

  // スプレッドシート上の値を二次元配列の形で取得
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet = sheet.getActiveRange();
  var values = sheet.getValues();
  var columnLast = sheet.getLastColumn();

  // セルのデータを配列に変換
  var dataArray = String(values).split(',');

  for (var j = 0; j < columnLast; ++j) { 
    keysArray.push(dataArray[0]);
    dataArray.shift();
  }

  // jsonデータの生成
  dataFix += '{\"items\":[';
  for (var i = 0; i < dataArray.length; ++i) {

    if(i % columnLast == 0) dataFix += '{';

    dataFix += '\"' + keysArray[i % columnLast] + '\"';
    dataFix += ':\"' + dataArray[i].replace(/\n/g,'<br>') + '\"';

    if(i % columnLast != columnLast-1) dataFix += ',';

    if(i % columnLast == columnLast-1){
      dataFix += '}';
      if(i != dataArray.length-1) dataFix += ',';
    }

  }
  dataFix += '],';
  dataFix += '\"total\":'+dataArray.length+',';
  dataFix += '\"update\":'+new Date();
  dataFix += '}';

  if(dataArray.length){
    var jsonBefore = JSON.parse(dataFix);
    var json = JSON.stringify(jsonBefore, null, "  ");
    return json
  } else {
    return ''
  }
}
