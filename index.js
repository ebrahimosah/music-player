const musicPlayer = document.querySelector('.music__player')

const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');

const audioTitle = document.querySelector('.music__title');
const audioImage = document.querySelector('.music__image');

const speedIndicator = document.querySelector('.speed')
const speedNumber = document.querySelector('.speed span');

const progressContainer = document.querySelector('.progress__bar');
const progress = document.querySelector('.progress');

const speedOptions = [1.0,1.5,2.0,0.75]

let speedIndex = 0;


let songs;

let songIndex = 0;



function loadSongs(song){
    console.log(song);
    audioTitle.innerText = song.title;
    audio.src=`${song.audio}`;
    audioImage.style.backgroundImage = `url('${song.cover}')`;
}


async function fetchSongs (){
    await fetch('audio.json')
    .then((response)=>{
        if(!response.ok) throw new Error('error occurred');
        return response.json(); 
    })
    .then((data)=>{
        songs = data.songs;
        loadSongs(songs[songIndex]);
    })
    .catch((error)=>{
        console.log("error occured while fetching:"+error);
    });
}

fetchSongs();


function isPlaying(){
    return  musicPlayer.classList.contains("playing");
}
function playAudio(){
    musicPlayer.classList.add("playing");
    playBtn.querySelector('i').classList.remove("fa-play");
    playBtn.querySelector('i').classList.add("fa-pause");
    //playback rate
    audio.playbackRate = `${speedOptions[speedIndex]}`
    audio.play();
}


function pauseAudio(){
    musicPlayer.classList.remove("playing");
    playBtn.querySelector('i').classList.remove("fa-pause");
    playBtn.querySelector('i').classList.add("fa-play");
    audio.pause();
}



function updateProgressBar(e){
    const { duration, currentTime } = e.srcElement;

    const progressPercent = (currentTime / duration) * 100;

    progress.style.width = `${progressPercent}%`;

    if(currentTime == duration){
        playNext();
    }
}

function updateProgressPlayPosition(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const {duration} = audio;
    audio.currentTime = (clickX/width)*duration;
}

function updateSpeedIndicator(){
    speedIndex += 1;
    if(speedIndex > speedOptions.length -1 ){
        speedIndex = 0;
    }
    speedNumber.textContent = `${speedOptions[speedIndex]}x`
    playAudio()
}

playBtn.addEventListener("click",()=>{
   isPlaying()? pauseAudio() : playAudio();
})

function playNext(){
    songIndex++;
    if(songIndex > songs.length -1) songIndex = 0;
    loadSongs(songs[songIndex]);
    progress.style.width='0%';
    isPlaying() === true? playAudio() : pauseAudio();
}
function playPrev(){
    songIndex--;
    if(songIndex < 0) songIndex = songs.length - 1;
    loadSongs(songs[songIndex]);
    progress.style.width='0%';
    isPlaying() === true? playAudio() : pauseAudio();
}
nextBtn.addEventListener("click",playNext)

prevBtn.addEventListener("click",playPrev);


speedIndicator.addEventListener("click",updateSpeedIndicator)

audio.addEventListener('timeupdate', updateProgressBar)

progressContainer.addEventListener("click", updateProgressPlayPosition)