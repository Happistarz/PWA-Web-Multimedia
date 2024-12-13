import AudioRecorder from './audioRecorder.js';
import TracksPlayer from './tracksPlayer.js';

const audioContext = new AudioContext();

const audioRecorder = new AudioRecorder();
audioRecorder.createStream();

const tracksPlayer = new TracksPlayer();
tracksPlayer.addTrack(audioContext, 'www/audio/test.mp3');

const audio = new Audio('www/audio/test.mp3');
const audioSource = audioContext.createMediaElementSource(audio);
const volume = audioContext.createGain();
volume.gain.value = 0.2;

audioSource.connect(volume);
audioSource.connect(audioContext.destination);

volume.connect(audioContext.destination);

function play() {
	if (audioContext.state === 'suspended') {
		audioContext.resume();
	}

	audio.play();
}

function pause() {
	audio.pause();
}

function stop() {
	audio.pause();
	audio.currentTime = 0;
}

document.getElementById('play').addEventListener('click', play);
document.getElementById('pause').addEventListener('click', pause);
document.getElementById('stop').addEventListener('click', stop);
