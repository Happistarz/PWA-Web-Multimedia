document.documentElement.style.setProperty('--cell-count', CELL_COUNT);

var trackController = new TrackController();

/**
 * KICK
 */
const kick = new Tone.MembraneSynth({
	envelope: {
		sustain: 0,
		attack: 0.02,
		decay: 0.8,
	},
	octaves: 10,
	pitchDecay: 0.01,
}).toDestination();

trackController.addTrack(
	new Track(kick, time => kick.triggerAttackRelease('C2', '8n', time)),
);

/**
 * SNARE
 */
const snare = new Tone.NoiseSynth({
	volume: -10,
	envelope: {
		attack: 0.01,
		decay: 0.25,
		sustain: 0,
	},
}).toDestination();

trackController.addTrack(new Track(snare, time => snare.triggerAttack(time)));

/**
 * PIANO
 */
const keys = new Tone.PolySynth(Tone.Synth, {
	volume: -8,
	oscillator: {
		partials: [1, 2, 1],
	},
}).toDestination();

trackController.addTrack(
	new Track(keys, time => keys.triggerAttackRelease('C4', '8n', time)),
);

/**
 * BASS
 */
const bass = new Tone.MonoSynth({
	volume: -10,
	envelope: {
		attack: 0.1,
		decay: 0.3,
		release: 2,
	},
	filterEnvelope: {
		attack: 0.001,
		decay: 0.01,
		sustain: 0.5,
		baseFrequency: 200,
		octaves: 2.6,
	},
}).toDestination();

trackController.addTrack(
	new Track(bass, time => bass.triggerAttackRelease('C2', '8n', time)),
);

// Init all registered tracks
trackController.init();
