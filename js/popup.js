
chrome.tabs.getSelected(null, function(tab){
  chrome.tabs.sendMessage(tab.id, {title:''}, function(response) {
  });
  document.querySelector('body').style.width = (tab.width*0.6) + 'px';
  document.querySelector('body').style.minHeight = (tab.height*0.6) + 'px';
});

(function(){

/**
 * Make Json Data.
 */
function getDataJson(str) {
  // Set Config.
  let dataFix = '';
  let keyList = [];
  let keyListLength = 0;
  let dataList = [];

  let columnLast = 5;

  // テキストデータを配列に変換
  let _d = String(str).replace(/\"([^\t]*)\"/g, '$1');
  console.log(_d);
  _d = _d.split(/\n/);
  console.log(_d);
  dataList = _d.map((item)=>{
    return item.split(/\t/);
  });

  // キー情報をセット
  keyList = dataList[0];
  dataList.shift();
  keyListLength = keyList.length;

  // jsonデータの生成
  dataFix += '{\"items\":[';
  dataList.map((item,index)=>{
    dataFix += '{';
    item.map((itm,ind)=>{
      dataFix += '\"' + keyList[ind] + '\"';
      dataFix += ':\"' + itm.replace(/\n/g,'<br>') + '\"';
      if(ind != item.length-1) dataFix += ',';
    });
    dataFix += '}';
    if(index != dataList.length-1) dataFix += ',';
  });

  dataFix += '],';
  dataFix += '\"total\":'+dataList.length+',';
  dataFix += '\"update\":\"'+new Date()+'\"'
  dataFix += '}';

  if(dataList.length){
    let jsonBefore = JSON.parse(dataFix);
    let json = JSON.stringify(jsonBefore, null, "  ");
    return json
  } else {
    return ''
  }
}

/**
 * localStorage.
 */
let saveData = (val)=>{
  if(!val || val === null || val === undefined || val === '' || typeof val === 'function') return false
  localStorage.setItem('sc_text_data', val);
};

let getData = ()=>{
  let _r = localStorage.getItem('sc_text_data');
  return _r;
};

document.querySelector('#inputPaste').focus();

document.querySelector('form').inputPaste.value = getData();

window.addEventListener("paste", function(event){
  setTimeout(function(e){
    document.querySelector('form').inputPaste.value = e.target.value;
    saveData(document.querySelector('form').inputPaste.value);
  }, 100, event);
});

/**
 * Download.
 */
let elemBtnEncode = document.querySelector('.btn-build');
elemBtnEncode.addEventListener('click', (e) => {
  let text = document.querySelector('form').inputPaste.value;

  let content = getDataJson(text);
  let blob = new Blob([ content ], { "type" : "application/json"});
  document.getElementById("download").href = window.URL.createObjectURL(blob);
});

}());
