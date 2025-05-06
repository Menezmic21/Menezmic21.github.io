import * as noUiSlider from 'nouislider';
import * as Tone from "tone";

/* CUSTOM EVENTS */

/**
 * Fullscreen Button Clicked.
 *
 * @type {"fullscreen"}
 */
export const FULLSCREEN = "fullscreen";

/**
 * Play Button Clicked.
 *
 * @type {"play"}
 */
export const PLAY = "play";

/**
 * Pause Button Clicked.
 *
 * @type {"pause"}
 */
export const PAUSE = "pause";

/**
 * File Selected.
 *
 * @type {"fileSelect"}
 */
export const FILE_SELECT = "fileSelect";

/**
 * Slider Updated.
 *
 * @type {"sliderUpdate"}
 */
export const SLIDER_UPDATE = "sliderUpdate";

/**
 * Start Slider Updated.
 *
 * @type {"sliderUpdate"}
 */
export const START_SLIDER_UPDATE = "startSliderUpdate";

/**
 * End Slider Updated.
 *
 * @type {"sliderUpdate"}
 */
export const END_SLIDER_UPDATE = "endSliderUpdate";

/**
 * Set BPM.
 *
 * @type {"setBPM"}
 */
export const SET_BPM = "setBPM";

/* CUSTOM CLASS */

/**
 * Part of the view responsible for the UI components.
 *
 * @class UIBar
 * @typedef {UIBar}
 */
export class UIBar extends HTMLElement {
    static template;

    /**
     * UIBar initializer: Must be called before the component is defined but after the DOM has been loaded.
     *
     * @param {UIBar} template
     */
    static initialize(template) {
        UIBar.template = template;
    }

    // Web component boilerplate
    shadow;
    controller = null;

    // Private references to subcomponents that will NOT be added/removed from the DOM after initilization
    innerContainer;
    slider;
    sliderInstance;
    fullscreenButton;
    tempoButton;
    tempoDisplay;

    // class vars
    isPlaying = false;

    /**
     * Creates an instance of UIBar.
     */
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });

        // Append the template content to the shadow root
        this.shadow.append(UIBar.template.content.cloneNode(true));

        // Ensure all elements are present and of the correct types
        // Verify innerContainer
        const innerContainer = this.shadow.querySelector(".ui-bar");
        if (!(innerContainer instanceof HTMLElement)) {
            throw new Error("innerContainer not found");
        }
        this.innerContainer = innerContainer;

        // Verify fullscreenButton
        const fullscreenButton = this.shadow.querySelector(".fullscreen");
        if (!(fullscreenButton instanceof HTMLElement)) {
            throw new Error("fullscreenButton not found");
        }
        this.fullscreenButton = fullscreenButton;

        // Verify playButton
        const playButton = this.shadow.querySelector(".play");
        if (!(playButton instanceof HTMLElement)) {
            throw new Error("playButton not found");
        }
        this.playButton = playButton;

        // Verify fileButton
        const fileButton = this.shadow.querySelector(".filename-display");
        if (!(fileButton instanceof HTMLElement)) {
            throw new Error("fileButton not found");
        }
        this.fileButton = fileButton;

        // Verify hiddenFileButton
        const hiddenFileButton = this.shadow.querySelector(".midi-file-input");
        if (!(hiddenFileButton instanceof HTMLElement)) {
            throw new Error("hiddenFileButton not found");
        }
        this.hiddenFileButton = hiddenFileButton;

        // Verify tempoButton
        const tempoButton = this.shadow.querySelector(".metronome");
        if (!(tempoButton instanceof HTMLElement)) {
            throw new Error("tempoButton not found");
        }
        this.tempoButton = tempoButton;

        // Verify tempoDisplay
        const tempoDisplay = this.shadow.querySelector(".tempo-display");
        if (!(tempoDisplay instanceof HTMLElement)) {
            throw new Error("tempoDisplay not found");
        }
        this.tempoDisplay = tempoDisplay;

        // TODO: Move tempo modal into its own component

        // Verify tempoModal
        const tempoModal = this.shadow.querySelector(".tempo-modal");
        if (!(tempoModal instanceof HTMLElement)) {
            throw new Error("tempoModal not found");
        }
        this.tempoModal = tempoModal;

        // Verify bpmInput
        const bpmInput = this.shadow.querySelector("#bpm-input");
        if (!(bpmInput instanceof HTMLElement)) {
            throw new Error("bpmInput not found");
        }
        this.bpmInput = bpmInput;

        // Verify setBpmButton
        const setBpmButton = this.shadow.querySelector('input[type="submit"]');
        if (!(setBpmButton instanceof HTMLElement)) {
            throw new Error("setBpmButton not found");
        }
        this.setBpmButton = setBpmButton;
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

        this.slider = this.shadow.querySelector('.timeline-slider');
            
        this.sliderInstance = noUiSlider.create(this.slider, {
            start: [ 0, 2 ], // Handle start position
            margin: 1, // Handles must be more than '1' apart
            connect: true, // Display a colored bar between the handles
            // direction: 'rtl', // Put '0' at the bottom of the slider
            orientation: 'horizontal', // Orient the slider vertically
            behaviour: 'tap-drag', // Move handle on tap, bar is draggable
            range: { // Slider can select '0' to '100'
                'min': 0,
                'max': 100
            },
        });

        this.fullscreenButton.addEventListener('click', () => {
            const event = new CustomEvent(FULLSCREEN, {
                detail: {},
                bubbles: true,
                composed: true,
            });
      
            this.dispatchEvent(event);
        });

        this.playButton.addEventListener('click', () => {
            // If playing
            if (this.isPlaying) {
                // Tone.Transport.stop();
                this.playButton.setAttribute('icon', 'mdi:play');
                this.isPlaying = false;

                const event = new CustomEvent(PAUSE, {
                    detail: {},
                    bubbles: true,
                    composed: true,
                });
          
                this.dispatchEvent(event);

            // If paused
            } else {
                // Tone.Transport.start();
                this.playButton.setAttribute('icon', 'mdi:pause');
                this.isPlaying = true;

                const event = new CustomEvent(PLAY, {
                    detail: {},
                    bubbles: true,
                    composed: true,
                });
          
                this.dispatchEvent(event);
            }
        });

        this.fileButton.addEventListener('click', () => {
            this.hiddenFileButton.click(); // Programmatically click the hidden file input
        });

        this.hiddenFileButton.addEventListener('change', (event) => {
            const file = event.target.files[0];
            console.log("file select", [file.name]);
            this.fileButton.innerText = file.name;

            const new_event = new CustomEvent(FILE_SELECT, {
                detail: {midiFile: file},
                bubbles: true,
                composed: true,
            });
      
            this.dispatchEvent(new_event);
        });

        this.slider.noUiSlider.on('slide', (values, handle, unencoded, tap, positions) => {
            console.log("sliding");
            const new_event = new CustomEvent(SLIDER_UPDATE, {
                detail: {values: values},
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(new_event);
        });

        this.slider.noUiSlider.on('start', () => {
            console.log("start sliding");
            const new_event = new CustomEvent(START_SLIDER_UPDATE, {
                detail: {},
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(new_event);
        });
        
        this.slider.noUiSlider.on('end', () => {
            console.log("stop sliding");
            const new_event = new CustomEvent(END_SLIDER_UPDATE, {
                detail: {},
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(new_event);
        });

        this.tempoButton.addEventListener('click', () => {
            this.tempoModal.style.display = "block";
        });

        // Close modal when clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target != this) {
                this.closeTempoModal();
            }
        });

        this.setBpmButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default form submission (page refresh)

            const bpmValue = this.bpmInput.value;

            // Call your function here, passing the BPM value
            this.processBPM(bpmValue);

            this.closeTempoModal();
        });
    }

    setSlider(start, end) {
        this.sliderInstance.set([start, end]);
    }

    setBPM(bpm) {
        this.tempoDisplay.innerText = Math.round(bpm);

        const new_event = new CustomEvent(SET_BPM, {
            detail: {bpm: bpm},
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(new_event);
    }

    closeTempoModal() {
        this.tempoModal.style.display = "none";
    }

    // TODO: Move this functionality to the controller
    // Your function to process the BPM value
    processBPM(bpm) {
        console.log('BPM value entered:', bpm);
        // Add your logic here to use the BPM value,
        // for example, updating Tone.js transport BPM:
        if (Tone && Tone.getTransport()) {
            Tone.getTransport().bpm.value = parseFloat(bpm);
            this.setBPM(bpm);
            console.log('Tone.Transport.bpm updated to:', Tone.getTransport().bpm.value);
        } else {
            console.warn('Tone.js not initialized or Transport not available.');
        }
        // You might also want to update your view or controller here
    }

    /**
     * Remove event listeners.
     */
    disconnectedCallback() {
        // Remove all event listeners
        this.controller?.abort();
        this.controller = null;
    }
}