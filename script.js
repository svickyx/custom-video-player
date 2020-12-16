const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const VolumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const playerSpeed = document.querySelector('.player-speed');
const fullscreenBtn = document.querySelector('.fullscreen')


// show play button when video is paused or video is finished
function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play')
}

// Play & Pause ----------------------------------- //
function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
    } else {
        video.pause();
        showPlayIcon();
    }
}

// everytime the video is ended, show play icon
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

// calculate the current and duration time and show in minutes + seconds
// return the minutes and seconds(tenary operator to define if the seconds is less than 9, add '0' before it)
function displayTimeInMinutes(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`
    return `${minutes}:${seconds}`;
}

// update the progress bar width, by changing the css width property of the progress bar
// change the currentTime and duration text using the displayTimeInMinutes function and put the right number in the right position
function updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${displayTimeInMinutes(video.currentTime)} /`;
    duration.textContent = `${displayTimeInMinutes(video.duration)}`;
}

// set the progressRange to be able to change the width of the progress bar and change the currentTime text(in order to jump to whenever the video i want)
// after we click on the progressRange, this event has two useful element: offsetX and offsetWidth
// offsetX is where we actually click in the progress range
// offsetWidth is the total width of the progress range
// so to get the position of where we click, just use offsetX / offsetWidth
// the newTime is a number like 0.264604810996563, so to set the progress width, it need to change to percentage
// to change the currentTime text, use the newTime * video.duration(0.264604810996563 * 30s)

function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}


// Volume Controls --------------------------- //
// the default volume is 1, so we set the lastVolume to be 1 at the beginning
let lastVolume = 1;

function changeVolume(e) {
    let currentVolume = e.offsetX / volumeRange.offsetWidth;
    if (currentVolume > 0.9) {
        currentVolume = 1;
    };
    if (currentVolume < 0.1) {
        currentVolume = 0;
    }
    volumeBar.style.width = `${currentVolume * 100}%`;
    video.volume = currentVolume;
    // change the volume icon according to the volume number
    // 0 < currentVolume < 0.5 < currentVolume < 1, because there are three range, it's easy to remove all the class at first, and put the right one on each range
    VolumeIcon.className = '';
    if (currentVolume === 0) {
        VolumeIcon.classList.add('fas', 'fa-volume-mute');
    } else if (currentVolume > 0 && currentVolume < 0.5) {
        VolumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (currentVolume > 0.5) {
        VolumeIcon.classList.add('fas', 'fa-volume-up');
    }
    lastVolume = currentVolume;
    // set the lastVolume to be the currentVolume to be prepared for mute and unmute function
}

function toggleMute() {
    VolumeIcon.className = '';
    // if the video has volume, video.volume is not 0, then remember the lastVolume, and set the video.volume to be 0 and the width to be 0
    if (video.volume) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeBar.style.width = 0;
        VolumeIcon.classList.add('fas', 'fa-volume-mute');
        VolumeIcon.setAttribute('title', 'Unmute');
    } else {
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        if (lastVolume > 0 && lastVolume < 0.5) {
            VolumeIcon.classList.add('fas', 'fa-volume-down');
        }
        if (lastVolume > 0.5) {
            VolumeIcon.classList.add('fas', 'fa-volume-up');
        }
        VolumeIcon.setAttribute('title', 'Mute');
    }
}


// Change Playback Speed -------------------- //
// just set the video speed to the selected speed that user choose

function changeSpeed() {
    video.playbackRate = playerSpeed.value;
}


// Fullscreen ------------------------------- //
// remember to pass a para into the function

/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
    video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
    video.classList.remove('video-fullscreen');
}

// define the fullscreen to false at the beginning
// if the video is not fullscreen, then run openFullscreen function(the whole player), and then revise the fullscreen to true
// else, if the video is fullscreen, run closeFullscreen, and change fullscreen to false
let fullscreen = false;
function toggleFullscreen() {
    !fullscreen ? openFullscreen(player) : closeFullscreen();
    fullscreen = !fullscreen;
}


// add Eventlistener
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
VolumeIcon.addEventListener('click', toggleMute);
playerSpeed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);
