class Track {
	constructor(instrument, playFunction) {
		this.instrument = instrument;
		this.playFunction = playFunction;

		this.notes = Array(16).fill(false);
	}

	play() {
		this.playFunction();
	}
}
