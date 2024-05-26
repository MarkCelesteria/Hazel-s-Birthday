document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const canvas = document.querySelector('#confetti');
  let countdown = document.getElementById("countdown");
  const text = document.getElementById('letter').innerText;
  document.getElementById('letter').innerText = '';
  const jsConfetti = new JSConfetti();
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let maxCandle = false;
  let timesUp = false;
  let surprise = false;
  let i = 0;
  let timeLeft = 30;
  let age = 20;

  let countdownTimer = setInterval(function() {
    if (maxCandle) {
      document.querySelector('.timer').style.display = "block";
      document.querySelector('.name').style.display = "none";
      timeLeft--;
      countdown.textContent = timeLeft;
    }

      if(timeLeft <= 0) {
          clearInterval(countdownTimer);
          countdown.textContent = "Time's up!";
          timesUp = true;
      }
  }, 1000);

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
    if (activeCandles === 0) {
      surprise = true;
      playMusic();
      setTimeout(() => jsConfetti.addConfetti(), 0);
      setTimeout(() => confetti({
        particleCount: 250,
        spread: 300,
      }), 0);
      setTimeout(() => jsConfetti.addConfetti(), 500);
      setTimeout(() => confetti({
        particleCount: 250,
        spread: 300,
      }), 500);
      setTimeout(() => jsConfetti.addConfetti(), 1000);
      setTimeout(() => jsConfetti.addConfetti(), 1500);
      setTimeout(() => jsConfetti.addConfetti(), 2000);
      setTimeout(() => typeWriter(), 2500);
      callFunction(5000);
      setTimeout(() => stopMusic(), 90000);
    }
  }

  function callFunction(time) {
    if (time <= 90000) {
      setTimeout(() => scrollToBottom(), time);
      callFunction(time + 1000);
    }
  }

  function addCandle(left, top) {
    if (candles.length >= age) {
      maxCandle = true;
      return;
    }

    if (candles.length >= 0) {
      document.querySelector('.help').style.display = "none";
    }
    const colors = ['#7B020B', '#f488e0', '#02027b', '#027b02', '#717b02', '#ededed', '#12a4a7'];
    const colorsTop = ['#ad030f', '#f798e5', '#0603ad', '#03ad0b', '#8f9c02', '#ffffff', '#14c7ca'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    const randomColorTop = colorsTop[randomIndex];
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";
    candle.style.backgroundColor = randomColor;

    const candleBefore = document.createElement("div");
    candleBefore.style.position = "absolute";
    candleBefore.style.top = "0";
    candleBefore.style.left = "0";
    candleBefore.style.width = "12px";
    candleBefore.style.height = "6px";
    candleBefore.style.borderRadius = "50%";
    candleBefore.style.backgroundColor = randomColorTop;
  
    candle.appendChild(candleBefore);

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; 
  }

  function blowOutCandles() {
    let blownOut = 0;
    if (timesUp) {
      if (!surprise) {
        document.querySelector('.candle-count-display').style.display = "block";
        document.querySelector('.blow').style.display = "block";
      } else {
        document.querySelector('.candle-count-display').style.display = "none";
        document.querySelector('.blow').style.display = "none";
        document.querySelector('.timer').style.display = "none";
        document.querySelector('.birthday').style.display = "block";
      }
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }
    }
    if (blownOut > 0) {
      updateCandleCount();
    }
  }

  function typeWriter() {
    if (i < text.length) {
      document.getElementById('letter').innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }

  function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  function playMusic() {
    var audio = new Audio('Birthday-Song.MP3');
    audio.loop = true;
    audio.play();
  }

  function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});
