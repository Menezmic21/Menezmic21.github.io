import { Ball } from "./ball.js";
import { Note } from "./note.js";
import * as Tone from "tone";

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
    balls = []
    notes = []
    canvasWidth = 0;
    canvasHeight = 0;
    noteCanvasWidth = 0;
    noteCanvasHeight = 0;
    keysCanvasWidth = 0;
    keysCanvasHeight = 0;
    lowestNote = 0; // 21;
    highestNote = 108;

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

        for (var i = 0; i < 500; i++) {
            this.balls.push(new Ball(this.noteCanvas, this.noteContext));
        }

        // Inital Resize
        this.resize(this.canvasWidth, this.canvasHeight);

        this.animate();
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
        
        this.drawPianoKeyboard(this.keysCanvas, this.keysContext, this.lowestNote, this.highestNote); // Draw keyboard from C3 to C5
    };

    // Animation loop function
    animate() {
        // Clear the canvas
        this.noteContext.clearRect(0, 0, this.noteCanvas.width, this.noteCanvas.height);

        // Draw balls
        // for (var i = 0; i < 500; i++) {
        //     this.balls[i].draw();
        // }

        // Draw notes
        this.notes.forEach((currentValue) => {
            currentValue.draw(Tone.now());
        });

        // Request the next animation frame
        requestAnimationFrame(this.animate.bind(this));
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

        const notes = endNote - startNote + 1;
        const octaves = Math.floor(notes / 12);
        const remainingNotes = notes % 12;

        let whiteKeys = octaves * 7; // 7 white keys per octave

        // Calculate white keys in the remaining notes
        const startOffset = startNote % 12;
        const endOffset = endNote % 12;

        // Handle the edge case where startNote and endNote are in the same octave
        if (octaves === 0) {
            for (let i = startNote; i <= endNote; i++) {
                if (this.isWhiteKey(i)) {
                    whiteKeys++;
                }
            }
            return whiteKeys;
        }
        
        const whiteKeyPositions = [0, 2, 4, 5, 7, 9, 11]; // Positions of white keys in an octave (C=0, D=2, etc.)
        
        let startWhiteKeyIndex = -1;
        let endWhiteKeyIndex = -1;
        
        for(let i = 0; i < whiteKeyPositions.length; i++){
            if(whiteKeyPositions[i] >= startOffset){
                startWhiteKeyIndex = i;
                break;
            }
        }
        for(let i = 0; i < whiteKeyPositions.length; i++){
            if(whiteKeyPositions[i] >= endOffset){
                endWhiteKeyIndex = i;
                break;
            }
        }

        if(startWhiteKeyIndex !== -1){
            whiteKeys += whiteKeyPositions.length - startWhiteKeyIndex;
        }
        if(endWhiteKeyIndex !== -1){
            whiteKeys += endWhiteKeyIndex;
        }
        
        //Need to subtract the white keys of the first and last octave to avoid double counting
        if(startWhiteKeyIndex !== -1){
            whiteKeys -= 7;
        }
        if(endWhiteKeyIndex !== -1){
            whiteKeys -= (endWhiteKeyIndex === 0) ? 0 : 7;
        }
        

        return whiteKeys;
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

    // TODO: Make this global or singleton between here and controller
    secondsToTraverse = 5;

    createNote(time, note) {
        const width = this.noteCanvasWidth;
        const height = this.noteCanvasHeight;
        let new_note;

        const totalWhiteKeys = this.countWhiteKeys(this.lowestNote, this.highestNote);

        // Compute key dimensions
        const whiteKeyWidth = Math.floor(width / totalWhiteKeys);
        const blackKeyWidth = Math.floor(whiteKeyWidth * 0.6);
        const white_index = this.countWhiteKeys(this.lowestNote, note.midi);
        const key_height = Math.floor(height * note.duration / this.secondsToTraverse);

        console.log("height", [height]);

        // If the note is white
        if (this.isWhiteKey(note.midi)) {
            // Compute the location
            const key_x = white_index * whiteKeyWidth;

            console.log("create note time", [Tone.now(), time]);

            new_note = new Note(this.noteCanvas, this.noteContext, key_x, height, whiteKeyWidth, -key_height, "rgb(230, 224, 136)", time);
            
        // If the note is black
        } else {
            // Compute the location
            const key_x = white_index * whiteKeyWidth - Math.floor(blackKeyWidth / 2);

            new_note = new Note(this.noteCanvas, this.noteContext, key_x, height, blackKeyWidth, -key_height, "rgb(185, 127, 231)", time);
        }

        // Add the new note to the notes array
        this.notes.push(new_note);
    }

    drawPianoKeyboard(canvas, ctx, lowestNote = 35, highestNote = 81) { // MIDI note numbers,  A2 = 45, C4 = 60
        const width = canvas.width;
        const height = canvas.height;

        const totalWhiteKeys = this.countWhiteKeys(lowestNote, highestNote);

        // Compute key dimensions
        const whiteKeyWidth = Math.floor(width / totalWhiteKeys);
        const blackKeyWidth = Math.floor(whiteKeyWidth * 0.6);
        const whiteKeyHeight = Math.floor(height);
        const blackKeyHeight = Math.floor(whiteKeyHeight * 0.6);

        // Draw the white keys
        // For each note
        for (let white_index = 0; white_index <= totalWhiteKeys; white_index++) {
            // Compute the location
            const key_x = white_index * whiteKeyWidth;

            // Draw the key
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(key_x, 0, whiteKeyWidth, whiteKeyHeight);
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.strokeRect(key_x, 0, whiteKeyWidth, whiteKeyHeight);
        }

        let white_index = 0;

        // Draw the black keys
        // For each note
        for (let note = lowestNote; note <= highestNote; note++) {
            // If the key is white
            if (this.isWhiteKey(note)) {
                // If middle C
                if (note == 60) {
                    // Compute the location
                    const key_x = white_index * whiteKeyWidth + Math.floor(whiteKeyWidth / 2);

                    ctx.beginPath();
                    ctx.arc(key_x, blackKeyHeight, 5, 0, Math.PI * 2);
                    ctx.fillStyle = "rgb(181, 60, 0)";
                    ctx.fill();
                }

                // Increment the number of white keys drawn
                white_index++

            // If the key is black
            } else {
                // Compute the location
                const key_x = white_index * whiteKeyWidth - Math.floor(blackKeyWidth / 2);

                // Draw the key
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillRect(key_x, 0, blackKeyWidth, blackKeyHeight);
            }
        }
    }
}