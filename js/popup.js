
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

  let _d = '';
  let _d_ary = [];

  // 行頭の不可視文字を削除
  _d = String(str).replace(/\s*/, '');

  // テキストデータを配列に変換
  _d = _d.replace(/\"([^\t]*)\"/g, '__1__$1__2__');
  _d = _d.split(/\n/);

  let _t = '';
  let _t_flg = false;
  _d.map((item)=>{
    if(/__1__/.test(item)){
      _t_flg = true;
    }

    if(_t_flg){
      if(/__1__/.test(item)){
        _t += item.replace('__1__','');
      } else {
        _t += '\n'+item.replace('__2__','');

        if(/__2__/.test(item)){
          _t_flg = false;
          _d_ary.push(_t);
          _t = '';
        }
      }
    } else {
      _d_ary.push(item);
    }

  });

  // タブで配列に変換
  dataList = _d_ary.map((item)=>{
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
});

let APP = new Vue({
  el: '#app',
  data: {
    dateObj: new Date(),
    date: '',
    inputPaste: getData(),
    link: {
      download: 'data.json',
      href: {
        json: '#'
      }
    }
  },
  watch: {
    inputPaste(str){
      saveData(str);
    }
  },
  created: function(){
    this.date = this.dateObj.getFullYear()+'_'+this.dateObj.getMonth()+'_'+this.dateObj.getDate();
    setTimeout(()=>{
      document.querySelector('#inputPaste').focus();
      document.querySelector('#inputPaste').select();
    }, 300);
  },
  methods: {
    getRandomStr: function(_length = 10){
      let random = function(start, end){
        return Math.floor(Math.random() * (end - start + 1)) + start;
      };
      let _chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789';
      let _r = '';
      for (let i = 0; i < _length; ++i) {
        _r += _chars[random(0, 61)];
      }
      return _r;
    },
    setDownloadFileName: function(){
      this.link.download = this.date+'_'+this.getRandomStr(10)+'.json';
    },
    actionMakeFile: function(mode, e){
      this.setDownloadFileName();

      let content = getDataJson(this.inputPaste);
      if(this.inputPaste.length == 0 || this.inputPaste == '' || content === null || content === ''){
        e.preventDefault();
        return false;
      }

      let blob = new Blob([ content ], { "type" : "application/json"});
      this.link.href.json = window.URL.createObjectURL(blob);
    }
  }
})

}());

