let defaultTimeLength = 20
let timeLength = defaultTimeLength * 60;

let tickRecord = []

const NOT_START = 0
const RUNNING_NORMAL = 1
const RUNNING_OVERTIME = 2
const PAUSE = 3

let mode = NOT_START

let intervalHandler = null;

function updateTickRecord(arr) {
  sendMessageToPopup({ arr }, 'recordUpdate')
}

function changeModeStyle(targetMode) {
  mode = targetMode
  sendMessageToPopup({ mode }, 'modeUpdate')
}

function displayTime(time) {
  sendMessageToPopup({ time }, 'timeUpdate')
}

function startTimer() {
  if (mode == NOT_START) {
    tickRecord = []
    updateTickRecord(tickRecord)
  }
  if (mode == NOT_START || mode == PAUSE) {
    changeModeStyle(timeLength > 0 ? RUNNING_NORMAL : RUNNING_OVERTIME)
    intervalHandler = setInterval(() => {
      displayTime(Math.abs(--timeLength))

      if (mode != 3 && timeLength < 0) {
        changeModeStyle(RUNNING_OVERTIME)
      }
    }, 1000)
  }
}

function stop() {
  changeModeStyle(NOT_START)
  clearInterval(intervalHandler)
}

function pause() {
  changeModeStyle(PAUSE)
  clearInterval(intervalHandler)
}

function reset() {
  stop()
  timeLength = defaultTimeLength * 60
  displayTime(timeLength)
}

//Sends message to popup.js
function sendMessageToPopup(message, type) {
  let obj = {
    message,
    type,
  };
  chrome.runtime.sendMessage(obj).catch(e => {
    // if interface hide, there will be a error:
    // Error: Could not establish connection. Receiving end does not exist.
    // so ignore this error
    if (e.message.endsWith('Receiving end does not exist.')) {
      // ignore
    } else {
      console.log(e)
    }
  });
}

let section = 1
let qrContent = ''
//receives message from popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type == 'changeSection') {
    console.log('changeSection', msg)
    section = msg.message.section
  } else if (msg.type == 'qrContent') {
    console.log('qrContent', msg)
    qrContent = msg.message.qrContent
  } else if (msg.type === "timer") {
    startTimer();
  } else if (msg.type === "PAUSE") {
    pause()
  } else if (msg.type === "RESUME") {
    startTimer();
  } else if (msg.type === "RESET") {
    reset()
  } else if (msg.type == "initialCheck") {
    sendResponse({
      section,
      qrContent,
      mode,
      time: timeLength,
      tickRecord
    });
  } else if (msg.type == 'changeDefault') {
    if (mode == NOT_START) {
      defaultTimeLength = Math.max(1, defaultTimeLength + msg.message.diff)
      timeLength = defaultTimeLength * 60
      sendResponse({
        time: timeLength,
      });
    }
  } else if (msg.type == 'TICK') {
    if (mode == RUNNING_NORMAL || mode == RUNNING_OVERTIME) {
      const base = tickRecord.length == 0 ? defaultTimeLength * 60 : tickRecord[tickRecord.length - 1][3]
      tickRecord.push([mode, base - timeLength, defaultTimeLength * 60 - timeLength, timeLength])
      sendResponse({
        tickRecord
      })
    }
  }
});