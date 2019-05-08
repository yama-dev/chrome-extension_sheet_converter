
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  document.execCommand('copy');
  sendResponse({});
});

