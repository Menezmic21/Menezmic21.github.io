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

    /**
     * Creates an instance of PianoRollCanvas.
     */
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });

        // Append the template content to the shadow root
        this.shadow.append(PianoRollCanvas.template.content.cloneNode(true));

        // Ensure all elements are present and of the correct types
        // Verify innerContainer
        const innerContainer = this.shadow.querySelector(".piano-roll-canvas");
        if (!(innerContainer instanceof HTMLElement)) {
            throw new Error("innerContainer not found");
        }
        this.innerContainer = innerContainer;
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
        this.canvas = document.createElement("canvas");
        this.canvas.id = "ScoreCanvas";
        this.innerContainer.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d");

        for (var i = 0; i < 500; i++) {
            this.balls.push(new Ball(this.canvas, this.context));
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

        // Set the canvas's width and height
        this.context.canvas.width = this.canvasWidth;
        this.context.canvas.height = this.canvasHeight;
        // this.drawHouse();
    };

    // Animation loop function
    animate() {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw balls
        for (var i = 0; i < 500; i++) {
            this.balls[i].draw();
        }

        // Request the next animation frame
        requestAnimationFrame(this.animate.bind(this));
    }
}