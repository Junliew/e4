
let videoElement = document.getElementById("videoElement");
let playButton = document.getElementById("playButton");
let stopButton = document.getElementById("stopButton");
let progressBar = document.getElementById("progressBar");

videoElement.removeAttribute("controls");

document.getElementById("controlsWrapper").style.display = "flex";

videoElement.addEventListener('loadedmetadata', () => {
  progressBar.setAttribute('max', videoElement.duration);
});

videoElement.addEventListener("playing", () => {
  if (!progressBar.getAttribute('max')){
    progressBar.setAttribute('max', videoElement.duration);
  }
});

videoElement.addEventListener("waiting", () => {
  progressBar.classList.add("timeline-loading");
});
videoElement.addEventListener("canplay", () => {
  progressBar.classList.remove("timeline-loading");
});

videoElement.addEventListener("ended", () => {
  playButton.style.backgroundImage = "url('./icons/play.svg')";
});

function playPause(){
  if (videoElement.paused || videoElement.ended) {
    videoElement.play();
    playButton.style.backgroundImage = "url('./icons/pause.svg')";
  } else {
    videoElement.pause();
    playButton.style.backgroundImage = "url('./icons/play.svg')";
  }
}

playButton.addEventListener('click', playPause);

videoElement.addEventListener('click', playPause);

videoElement.addEventListener('timeupdate', () => {
progressBar.value = videoElement.currentTime;
});

function scrubToTime(e){
  let x = e.clientX - (progressBar.getBoundingClientRect().left + window.scrollX);
  videoElement.currentTime = clampZeroOne(x / progressBar.offsetWidth) * videoElement.duration;
}


progressBar.addEventListener('mousedown', scrubToTime);
progressBar.addEventListener('mousedown', (e) => {
  window.addEventListener('mousemove', scrubToTime);
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', scrubToTime);
  });
});





function clampZeroOne(input){
  return Math.min(Math.max(input, 0), 1);
}

function logEvent(e){
  console.log(e);
}

/*Volume*/
// This is the volume scroller
let volume = document.getElementById("volume");


// Allows user to adjust the volume
volume.addEventListener('mousemove', (e) => {
  videoElement.volume = e.target.value
})

/*Current time and duration*/
let currentTimeElement = document.getElementById("current");
let durationTimeElement = document.getElementById("duration");

const currentTime = () => {
  //Obtain the current minutes and seconds of the video by calculating the duration
  let currentMinutes = Math.floor(videoElement.currentTime / 60)
  let currentSeconds = Math.floor(videoElement.currentTime - currentMinutes * 60)
  let durationMinutes = Math.floor(videoElement.duration / 60)
  let durationSeconds = Math.floor(videoElement.duration - durationMinutes * 60)

  //Adding a 0 if there is less than 10 seconds to make it more tidy
  currentTimeElement.innerHTML = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`
  durationTimeElement.innerHTML = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`
}

// Everytime the time updates, it will update the time displayed
videoElement.addEventListener('timeupdate', currentTime)