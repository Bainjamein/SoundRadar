let audioContext;
let analyser;
let microphone;
let javascriptNode;

window.onload = function () {
  // Initialisation de l'audio
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function () {
      // Analyse du son
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      let average = getAverageVolume(dataArray);

      // Mise à jour de l'interface utilisateur
      const level = document.querySelector("#level");
      level.innerHTML = average;

      const bar = document.querySelector(".bar");
      bar.style.width = `${average}%`;

      // Mise à jour de létat de la barre par rapporau norme du travail
      if (average >= 65) {
        bar.classList.remove("medium", "low");
        bar.classList.add("high");
      } else if (average >= 25) {
        bar.classList.remove("high", "low");
        bar.classList.add("medium");
      } else {
        bar.classList.remove("high", "medium");
        bar.classList.add("low");
      }

      // Detection du volume trop élevé
      const threshold = 65;
      const alert = document.querySelector(".alert");
      if (average > threshold) {
        alert.style.display = "block";
      } else {
        alert.style.display = "none";
      }
    };
  });
};

function getAverageVolume(dataArray) {
  let values = 0;
  let average;
  const length = dataArray.length;
  for (let i = 0; i < length; i++) {
    values += dataArray[i];
  }
  average = values / length;
  return average.toFixed(2);
}
