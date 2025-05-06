/* CUSTOM EVENTS */
// NA

/* CUSTOM TYPES */
// NA

/* CUSTOM COMPONENT */

/**
 * A web component to display the piano roll.
 *
 * @class PianoRollCanvas
 * @typedef {PianoRollCanvas}
 * @extends {HTMLElement}
 */
export class PianoRollCanvas extends HTMLElement {
    static template;

    /**
     * PianoRollCanvas initializer: Must be called before the component is defined but after the DOM has been loaded.
     *
     * @param {PianoRollCanvas} template
     */
    static initialize(template) {
        PianoRollCanvas.template = template;
    }

    // Web component boilerplate
    shadow;
    controller = null;

    // Private references to subcomponents that will NOT be added/removed from the DOM after initilization
    canvasWidth = 0;
    canvasHeight = 0;
    noteCanvasWidth = 0;
    noteCanvasHeight = 0;
    keysCanvasWidth = 0;
    keysCanvasHeight = 0;
    lowestNote = 21; // 21;
    highestNote = 108;
    playingNotes = new Array(this.highestNote - this.lowestNote).fill(false);

    /**
     * Creates an instance of PianoRollCanvas.
     */
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });

        // Append the template content to the shadow root
        this.shadow.append(PianoRollCanvas.template.content.cloneNode(true));

        // Ensure all elements are present and of the correct types
    }

    /**
     * Register event handlers.
     *
     * @type {EnvironmentsItem} - this
     * @type {HTMLElement} environmentsClose - the button to delete an environment
     */
    connectedCallback() {
        this.controller = new AbortController();
        const options = { signal: this.controller.signal };

        /**
         * The canvas which notes are drawn to
         * @type {Element}
         */
        this.noteCanvas = this.shadow.querySelector(".note-canvas");
        this.keysCanvas = this.shadow.querySelector(".keys-canvas");

        this.noteContext = this.noteCanvas.getContext("2d");
        this.keysContext = this.keysCanvas.getContext("2d");

        // Inital Resize
        this.resize(this.canvasWidth, this.canvasHeight);
    }

    /**
     * Remove event listeners.
     */
    disconnectedCallback() {
        // Remove all event listeners
        this.controller?.abort();
        this.controller = null;
    }

    resize(offsetWidth, offsetHeight) {
        this.canvasWidth = offsetWidth;
        this.canvasHeight = offsetHeight;

        this.noteCanvasWidth = this.canvasWidth;
        this.noteCanvasHeight = Math.floor(this.canvasHeight * 0.9);
        
        this.keysCanvasWidth = this.canvasWidth;
        this.keysCanvasHeight = this.canvasHeight - this.noteCanvasHeight;

        // Set the canvas's width and height
        this.noteContext.canvas.width = this.noteCanvasWidth;
        this.noteContext.canvas.height = this.noteCanvasHeight;

        this.keysContext.canvas.width = this.keysCanvasWidth;
        this.keysContext.canvas.height = this.keysCanvasHeight;
        
        this.drawPianoKeyboard();
    };

    clearNoteCanvas() {
        this.noteContext.clearRect(0, 0, this.noteCanvas.width, this.noteCanvas.height);
        this.playingNotes = new Array(this.highestNote - this.lowestNote).fill(false);
    }

    /**
     * Helper function to determine if a given MIDI note is a white key.  (Unchanged)
     *
     * @param {number} note - The MIDI note number.
     * @returns {boolean} True if the note is a white key, false otherwise.
     */
    isWhiteKey(note) {
        const noteNumber = note % 12;
        // White keys are C, D, E, F, G, A, B
        return noteNumber === 0 || noteNumber === 2 || noteNumber === 4 || noteNumber === 5 || noteNumber === 7 || noteNumber === 9 || noteNumber === 11;
    }

    /**
     * Calculates the number of white keys between two MIDI notes (inclusive), optimized.
     *
     * @param {number} startNote - The MIDI note number of the starting note.
     * @param {number} endNote - The MIDI note number of the ending note.
     * @returns {number} The number of white keys between the two notes (inclusive).
     *
     * @example
     * // Returns 4
     * countWhiteKeysOptimized(60, 64);
     *
     * @example
     * // Returns 0
     * countWhiteKeysOptimized(61, 63);
     */
    countWhiteKeys(startNote, endNote) {
        // Ensure startNote is less than or equal to endNote
        if (startNote > endNote) {
            [startNote, endNote] = [endNote, startNote]; // Swap the values
        }

        const startOct = Math.floor(startNote / 12);
        const endOct = Math.floor(endNote / 12);
        const octDiff = endOct - startOct;
        const startInOctId = startNote % 12;
        const endInOctId = endNote % 12;

        const numWhiteFromC = [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7];

        return 7 * octDiff + numWhiteFromC[endInOctId] - numWhiteFromC[startInOctId] + 1;
    }

    drawNote(startWindowTicks, endWindowTicks, ticks, note) {
        const width = this.noteCanvasWidth;
        const height = this.noteCanvasHeight;

        // console.log("notesCanvas", [width, height]);

        const totalWhiteKeys = this.countWhiteKeys(this.lowestNote, this.highestNote);
        const whiteKeyWidth = width / totalWhiteKeys;
        const blackKeyWidth = whiteKeyWidth * 0.6;
        const note_length = Math.floor(height * note.durationTicks / (endWindowTicks - startWindowTicks));

        // console.log("noteConsts", [totalWhiteKeys, whiteKeyWidth, blackKeyWidth, note_length]);

        const white_index = this.countWhiteKeys(this.lowestNote, note.midi);

        const note_y = height - Math.floor(height * (note.ticks - startWindowTicks) / (endWindowTicks - startWindowTicks));

        // console.log("drawNote", [startWindowTicks, endWindowTicks, ticks, note]);

        // If the note is currently being played
        if (note.ticks <= ticks) {
            this.playingNotes[note.midi] = true;
        }

        this.noteContext.beginPath();
        const style = window.getComputedStyle(document.documentElement);

        // If the note is white
        if (this.isWhiteKey(note.midi)) {
            // Compute the location
            const note_x = Math.round((white_index-1) * whiteKeyWidth);
            const next_note_x = Math.round(white_index * whiteKeyWidth);
            const roundedWhiteKeyWidth = next_note_x - note_x;

            // console.log("drawNoteDims", [note_x, note_y, roundedWhiteKeyWidth, note_length]);

            this.noteContext.fillStyle = style.getPropertyValue('--left-hand-color');
            this.noteContext.roundRect(note_x,  note_y, roundedWhiteKeyWidth, -note_length, Math.floor(roundedWhiteKeyWidth/4));
            
        // If the note is black
        } else {
            // Compute the location
            const white_note_x = Math.round(white_index * whiteKeyWidth);
            const note_x = Math.floor(white_note_x - blackKeyWidth / 2);

            this.noteContext.fillStyle = style.getPropertyValue('--right-hand-color');
            this.noteContext.roundRect(note_x, note_y, Math.floor(blackKeyWidth), -note_length, Math.floor(blackKeyWidth/4));
        }

        this.noteContext.fill();
    }

    drawWhiteKeys() {
        const width = this.keysCanvasWidth;
        const height = this.keysCanvasHeight;

        const totalWhiteKeys = this.countWhiteKeys(this.lowestNote, this.highestNote);
        const whiteKeyWidth = width / totalWhiteKeys;

        let white_index = 0;
        const style = window.getComputedStyle(document.documentElement);

        // Draw the white keys
        // For each note
        for (let note = this.lowestNote; note <= this.highestNote; note++) {
            // If the key is white
            if (this.isWhiteKey(note)) {
                // Compute the location
                const key_x = Math.round(white_index * whiteKeyWidth);
                const next_key_x = Math.round((white_index+1) * whiteKeyWidth);
                const roundedWhiteKeyWidth = next_key_x - key_x;

                // Draw the key
                this.keysContext.fillStyle = "rgb(255, 255, 255)";
                if (this.playingNotes[note]) {
                    this.keysContext.fillStyle = style.getPropertyValue('--left-hand-color');
                }
                this.keysContext.fillRect(key_x, 0, roundedWhiteKeyWidth, height);

                // Draw the key outline
                this.keysContext.strokeStyle = "rgb(0, 0, 0)";
                this.keysContext.strokeRect(key_x, 0, roundedWhiteKeyWidth, height);

                // Increment the number of white keys drawn
                white_index++;
            }
        }
    }

    drawBlackKeys() {
        const width = this.keysCanvasWidth;
        const height = this.keysCanvasHeight;

        const totalWhiteKeys = this.countWhiteKeys(this.lowestNote, this.highestNote);
        const whiteKeyWidth = width / totalWhiteKeys;

        const blackKeyWidth = whiteKeyWidth * 0.6;
        const blackKeyHeight = Math.floor(height * 0.6);

        let white_index = 0;
        const style = window.getComputedStyle(document.documentElement);

        // Draw the black keys
        // For each note
        for (let note = this.lowestNote; note <= this.highestNote; note++) {
            // Compute the location
            const white_key_x = Math.round(white_index * whiteKeyWidth);

            // If the key is white
            if (this.isWhiteKey(note)) {
                // If middle C
                if (note == 60) {
                    // Compute the location
                    const key_x = Math.floor(white_key_x + whiteKeyWidth / 2);

                    // Draw the middle C marker
                    this.keysContext.beginPath();
                    this.keysContext.arc(key_x, Math.floor((blackKeyHeight + height) / 2), 5, 0, Math.PI * 2);
                    this.keysContext.fillStyle = style.getPropertyValue('--accent-color');
                    this.keysContext.fill();
                }

                // Increment the number of white keys drawn
                white_index++;

            // If the key is black
            } else {
                // Compute the location
                const key_x = Math.floor(white_key_x - blackKeyWidth / 2);

                // Draw the key
                this.keysContext.fillStyle = "rgb(0, 0, 0)";
                if (this.playingNotes[note]) {
                    this.keysContext.fillStyle = style.getPropertyValue('--right-hand-color');
                }
                this.keysContext.fillRect(key_x, 0, Math.floor(blackKeyWidth), blackKeyHeight);
            }
        }
    }

    // TODO: Lazy updates
    drawPianoKeyboard() { // MIDI note numbers,  A2 = 45, C4 = 60
        this.drawWhiteKeys();
        this.drawBlackKeys();
        this.drawBorder();
        // this.drawLines();
    }

    drawBorder() {
        const width = this.keysCanvasWidth;
        const height = this.keysCanvasHeight;

        const style = window.getComputedStyle(document.documentElement);
        this.keysContext.fillStyle = style.getPropertyValue("--darken-secondary-color");
        this.keysContext.fillRect(0, 0, width, Math.floor(5 * height / 100));
    }

    drawLines() {
        const width = this.noteCanvasWidth;
        const height = this.noteCanvasHeight;

        const totalWhiteKeys = this.countWhiteKeys(this.lowestNote, this.highestNote);
        const whiteKeyWidth = width / totalWhiteKeys;

        let white_index = 0;
        this.noteContext.strokeStyle = "rgb(74, 74, 74)";

        for (let note = this.lowestNote; note <= this.highestNote; note++) {
            const noteInOctId = note % 12;
            if (noteInOctId == 0 || noteInOctId == 5) {
                // Compute the location
                const white_key_x = Math.round(white_index * whiteKeyWidth);

                this.noteContext.beginPath();
                this.noteContext.moveTo(white_key_x, 0);
                this.noteContext.lineTo(white_key_x, height);
                this.noteContext.stroke();
            }

            if (this.isWhiteKey(note)) {
                white_index++;
            }
        }
    }
}