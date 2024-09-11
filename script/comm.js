//Sends message to background.js
function sendMessageToBackground(message, type, response = null) {
  let obj = {
    message,
    type,
  };
  chrome.runtime.sendMessage(obj, response);
}