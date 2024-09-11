console.log('load timer js')

const NOT_START = 0
const RUNNING_NORMAL = 1
const RUNNING_OVERTIME = 2
const PAUSE = 3

function display({ h, m, s }) {
  elementHour.text((h + '').padStart(2, 0))
  elementMinute.text((m + '').padStart(2, 0))
  elementSecond.text((s + '').padStart(2, 0))
}

function timeTransfer(numSecond) {
  if (numSecond <= 0) {
    return {
      h: 0, m: 0, s: 0
    }
  }
  const h = numSecond / 3600 >> 0
  const m = (numSecond % 3600) / 60 >> 0
  const s = numSecond % 60
  return { h, m, s }
}

function changeModeStyle(targetMode) {
  timerWrapper.removeClass('timer-over')
  timerWrapper.removeClass('timer-running')
  timerWrapper.removeClass('timer-pause')
  if (targetMode == PAUSE) {
    timerWrapper.addClass('timer-pause')
  } else if (targetMode == RUNNING_NORMAL) {
    timerWrapper.addClass('timer-running')
  } else if (targetMode == RUNNING_OVERTIME) {
    timerWrapper.addClass('timer-over')
  }
}

function updateTickRecord(arr) {
  tickRecordList.html('')
  arr.forEach(([m, e, e2]) => {
    const { m: min1, s: s1 } = timeTransfer(e)
    const { m: min2, s: s2 } = timeTransfer(e2)
    tickRecordList.append($(`<li class='${m == RUNNING_NORMAL ? "normal" : "overtime"}'>${min1}:${s1} [${min2}:${s2}]</li>`))
  })
}

function startTimer() {
  sendMessageToBackground(null, 'timer')
}

function changeDefault(diff) {
  sendMessageToBackground({ diff }, 'changeDefault', (msg) => {
    display(timeTransfer(msg.time))
  })
}

//receives message from background.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type == 'recordUpdate') {
    updateTickRecord(msg.message.arr)
  } else if (msg.type == 'modeUpdate') {
    changeModeStyle(msg.message.mode)
  } else if (msg.type == 'timeUpdate') {
    display(timeTransfer(msg.message.time))
  }
});

// UI
const elementHour = $('#timer-h')
const elementMinute = $('#timer-m')
const elementSecond = $('#timer-s')
const timerWrapper = $('#timer-wrapper')
const tickRecordList = $('#tick-record-list')



const controlStart = $('#button-timer-start');
const controlPause = $('#button-timer-pause');
const controlReset = $('#button-timer-reset');
const controlInc = $('#button-timer-inc');
const controlDec = $('#button-timer-dec');
const controlInc5 = $('#button-timer-inc-5');
const controlDec5 = $('#button-timer-dec-5');
const tickButton = $('#button-timer-tick');

// add event listener
controlStart.on('click', () => {
  startTimer()
})

controlPause.on('click', () => {
  sendMessageToBackground(null, 'PAUSE')
})

controlReset.on('click', () => {
  sendMessageToBackground(null, 'RESET')
})

controlInc.on('click', () => {
  changeDefault(1)
})

controlDec.on('click', () => {
  changeDefault(-1)
})

controlInc5.on('click', () => {
  changeDefault(5)
})

controlDec5.on('click', () => {
  changeDefault(-5)
})


tickButton.on('click', () => {
  sendMessageToBackground(null, 'TICK', (msg) => {
    updateTickRecord(msg.tickRecord)
  })
})