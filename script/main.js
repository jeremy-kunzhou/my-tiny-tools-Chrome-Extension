$("#button-link-qrcode").click(() => {
  changeToQR()
});

function changeToQR() {
  clearSelection();
  $("#qrcode-panel").removeClass("hidden");
  $("#button-link-qrcode").addClass("active");
  changeSection(1)
}

$("#button-link-timer").click(() => {
  changeToTimer()
});

function changeToTimer() {
  clearSelection();
  $("#timer-panel").removeClass("hidden");
  $("#button-link-timer").addClass("active");
  changeSection(2)
}

function clearSelection() {
  $("#qrcode-panel").addClass("hidden");
  $("#timer-panel").addClass("hidden");
  $("#button-link-qrcode").removeClass("active");
  $("#button-link-timer").removeClass("active");
}

function changeSection(section) {
  sendMessageToBackground({ section }, 'changeSection')
}

//initial check; needed when user close and popup again while countdown or Pause is active.
chrome.runtime.sendMessage({ type: "initialCheck" }, function (response) {
  display(timeTransfer(response.time))
  changeModeStyle(response.mode)
  updateTickRecord(response.tickRecord)
  if (response.section == 1) {
    changeToQR()
  } else if (response.section == 2) {
    changeToTimer()
  }
  $("#qr-content").val(response.qrContent);
  if (response.qrContent) {
    genQR(response.qrContent)
  }
});