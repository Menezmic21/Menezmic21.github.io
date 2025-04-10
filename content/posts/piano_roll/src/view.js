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
    fullScreenSpan;
    pianoRollContainer;

    /**
     * Creates an instance of View.
     */
    constructor() {
        this.fullScreenSpan = document.querySelector('full-screen-span');
        this.pianoRollContainer = document.querySelector('piano-roll-container');
    }
}
