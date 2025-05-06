/* CUSTOM EVENTS */

/* CUSTOM TYPES */

/* CUSTOM CLASS */

/**
 * The entry point for the view all things related.
 *
 * @class View
 * @typedef {View}
 */
export class View {
    uiBar;
    pianoRollCanvas;

    /**
     * Creates an instance of View.
     */
    constructor() {
        this.uiBar = document.querySelector('ui-bar');
        this.pianoRollCanvas = document.querySelector('piano-roll-canvas');
    }

    drawNote(startWindowTime, endWindowTime, time, note) {
        this.pianoRollCanvas.drawNote(startWindowTime, endWindowTime, time, note);
    }

    clearNoteCanvas() {
        this.pianoRollCanvas.clearNoteCanvas();
    }

    drawPianoKeyboard() {
        this.pianoRollCanvas.drawPianoKeyboard();
    }

    setSlider(start, end) {
        this.uiBar.setSlider(start, end);
    }

    setBPM(bpm) {
        this.uiBar.setBPM(bpm);
    }

    updatePlayButton(isPlaying) {
        this.uiBar.updatePlayButton(isPlaying);
    }
}
