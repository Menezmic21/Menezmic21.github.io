/* CUSTOM CLASS */

/**
 * The entry point for the view all things posts related.
 *
 * @class FullScreenSpan
 * @typedef {FullScreenSpan}
 */
export class FullScreenSpan extends HTMLElement {
    // Web component boilerplate
    controller = null;
    innerContainer = null;

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
        this.pianoRollContainer = this.querySelector("piano-roll-container");
    
        /* Register event handlers */
        this.addEventListener('click', () => { // Arrow function here
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
                  const height = entry.contentRect.height;
              
                  // Your event handling logic here
                //   console.log(`Span size changed: width=${width}, height=${height}`);
                  this.pianoRollContainer.resize(width, height);
                }
            });
    
            resizeObserver.observe(this.innerContainer);
        });
    
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