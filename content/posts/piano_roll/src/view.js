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

    createNote(time, note) {
        this.pianoRollCanvas.createNote(time, note);
    }
}
