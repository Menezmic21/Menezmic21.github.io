/* CUSTOM CLASS */

/**
 * The part of the view responsible for a fullscreenable container.
 *
 * @class FullScreenSpan
 * @typedef {FullScreenSpan}
 */
export class FullScreenSpan extends HTMLElement {
    // Web component boilerplate
    controller = null;
    innerContainer = null;

    PianoRollCanvas = null;
    uiBar = null;

    /**
     * Creates an instance of fullScreenSpan.
     */
    constructor() {
        super();
    }

    /**
     * Register event handlers.
     */
    connectedCallback() {
        this.controller = new AbortController();
        const options = { signal: this.controller.signal };

        this.innerContainer = this.querySelector(".full-screen-span");

        // inital resize
        customElements.whenDefined('piano-roll-canvas').then(() => {
            customElements.whenDefined('ui-bar').then(() => {
                this.PianoRollCanvas = this.querySelector("piano-roll-canvas");
                this.uiBar = this.querySelector("ui-bar");

                this.PianoRollCanvas.canvasWidth = this.offsetWidth;
                this.PianoRollCanvas.canvasHeight = this.offsetHeight - this.uiBar.offsetHeight; // TODO: Change this to vary with flex direction

                console.log("This Dims: ", [this.offsetWidth, this.offsetHeight]);
                console.log("UI Dims: ", [this.uiBar.offsetWidth, this.uiBar.offsetHeight]);
                console.log("Canvas Dims: ", [this.PianoRollCanvas.canvasWidth, this.PianoRollCanvas.canvasHeight]);

                this.PianoRollCanvas.resize(this.PianoRollCanvas.canvasWidth, this.PianoRollCanvas.canvasHeight);

                this.uiBar.fullscreenButton.addEventListener('click', () => { // Arrow function here
                    if (!document.fullscreenElement) {
                        if (this.requestFullscreen) {
                            this.requestFullscreen();
                        } else if (this.webkitRequestFullscreen) { /* Safari */
                            this.webkitRequestFullscreen();
                        } else if (this.msRequestFullscreen) { /* IE11 */
                            this.msRequestFullscreen();
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.webkitExitFullscreen) { /* Safari */
                            document.webkitExitFullscreen();
                        } else if (document.msExitFullscreen) { /* IE11 */
                            document.msExitFullscreen();
                        }
                    }
        
                    const resizeObserver = new ResizeObserver(entries => {
                        // Loop through the observed entries (in case multiple elements are observed)
                        for (let entry of entries) {
                          // Access the new dimensions
                          const width = entry.contentRect.width;
                          const height = entry.contentRect.height - this.uiBar.offsetHeight; // TODO: Change this to vary with flex direction
                      
                          // Your event handling logic here
                        //   console.log(`Span size changed: width=${width}, height=${height}`);
                          this.PianoRollCanvas.resize(width, height);
                        }
                    });
            
                    resizeObserver.observe(this.innerContainer);
                });
            });
        });
    
        /* Register event handlers */
    
        // Optionally add a class for fullscreen styling
        this.addEventListener('fullscreenchange', () => { // Arrow function here
            if (document.fullscreenElement) {
                this.innerContainer.classList.add('fullscreen');
            } else {
                this.innerContainer.classList.remove('fullscreen');
            }
        });
        this.addEventListener('webkitfullscreenchange', () => { // Arrow function here
            if (document.webkitFullscreenElement) {
                this.innerContainer.classList.add('fullscreen');
            } else {
                this.innerContainer.classList.remove('fullscreen');
            }
        });
        this.addEventListener('msfullscreenchange', () => { // Arrow function here
            if (document.msFullscreenElement) {
                this.innerContainer.classList.add('fullscreen');
            } else {
                this.innerContainer.classList.remove('fullscreen');
            }
        });
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