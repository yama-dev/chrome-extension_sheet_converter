
chrome.tabs.getSelected(null, function(tab){  
  chrome.tabs.sendMessage(tab.id, {title:''}, function(response) {
    const url = tab.url;
    const text = response.text;
    const count = response.count;
    console.log(text);
  });
});

let elemBtnEncode = document.querySelector('.btn-build');
elemBtnEncode.addEventListener('click', (e) => {
  alert('build');
});

