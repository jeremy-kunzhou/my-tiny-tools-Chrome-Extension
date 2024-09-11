$("#qr-gen-button").click(() => {
  const qrContent = $("#qr-content").val()
  updateQRContent(qrContent)
  genQR(qrContent)
});

function genQR(content) {
  QRCode.toCanvas(
    document.getElementById("canvas"),
    content,
    function (error) {
      if (error) console.error(error);
      console.log("success!");
    }
  );
}

// gen qr code
$("#qr-clear-button").click(() => {
  $("#qr-content").val("");
  updateQRContent('')
  const canvas = document.getElementById("canvas");
  // const ctx = canvas.getContext("2d");
  // ctx.clearRect(0, 0, 0, 0);
  // canvas.width = canvas.height = 0;
  // ctx.fillRect(0, 0, 0, 0);
  canvas.style.height = "0px";
});

function updateQRContent(qrContent) {
  sendMessageToBackground({ qrContent }, 'qrContent')
}
