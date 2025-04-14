import { Ball } from "./ball.js";

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
    canvasWidth = 0;
    canvasHeight = 0;
    noteCanvasWidth = 0;
    noteCanvasHeight = 0;
    keysCanvasWidth = 0;
    keysCanvasHeight = 0;

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
        
        this.drawPianoKeyboard(this.keysCanvas, this.keysContext, 21, 108); // Draw keyboard from C3 to C5
    };

    // Animation loop function
    animate() {
        // Clear the canvas
        this.noteContext.clearRect(0, 0, this.noteCanvas.width, this.noteCanvas.height);

        // Draw balls
        for (var i = 0; i < 500; i++) {
            this.balls[i].draw();
        }

        // Request the next animation frame
        requestAnimationFrame(this.animate.bind(this));
    }

    drawPianoKeyboard(canvas, ctx, lowestNote = 35, highestNote = 81) { // MIDI note numbers,  A2 = 45, C4 = 60
        const width = canvas.width;
        const height = canvas.height;
        const totalKeys = highestNote - lowestNote + 1;
        const whiteKeys = [];
        const blackKeys = [];

        // 1. Calculate key positions and sizes
        let currentX = 0;
        for (let note = lowestNote; note <= highestNote; note++) {
            const isWhiteKey = [0, 2, 4, 5, 7, 9, 11].includes(note % 12);
            const whiteKeyHeight = height;
            const blackKeyHeight = height * 0.6;
            const noteInfo = {
                note: note,
                x: currentX,
                height: isWhiteKey? whiteKeyHeight: blackKeyHeight,
                isWhite: isWhiteKey,
            };

            if (isWhiteKey) {
                whiteKeys.push(noteInfo);
            } else {
                blackKeys.push(noteInfo);
            }
        }
        const totalWhiteKeys = whiteKeys.length;
        const whiteKeyWidth = width/totalWhiteKeys;

        //correct the x values for the white keys.
        let whiteKeyIndex = 0;
        for(let i = 0; i < whiteKeys.length; i++){
            whiteKeys[i].x = whiteKeyIndex * whiteKeyWidth;
            whiteKeyIndex++;
        }

        // 2. Draw white keys
        whiteKeys.forEach(key => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(Math.floor(key.x), 0, Math.floor(whiteKeyWidth), Math.floor(key.height));
            ctx.strokeStyle = '#000';
            ctx.strokeRect(Math.floor(key.x), 0, Math.floor(whiteKeyWidth), Math.floor(key.height));
        });

        // 3. Draw black keys
        blackKeys.forEach(key => {
            ctx.fillStyle = '#000';
            let xPos = whiteKeys.find(wk => wk.note > key.note -1).x - (whiteKeyWidth * 0.7 * 0.5);
            ctx.fillRect(Math.floor(xPos), 0, Math.floor(whiteKeyWidth * 0.7), Math.floor(key.height));
        });
    }
}