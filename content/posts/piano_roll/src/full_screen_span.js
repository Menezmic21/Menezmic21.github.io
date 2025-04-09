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
    fullScreenSpan = null;

    /**
     * Creates an instance of fullScreenSpan.
     */
    constructor() {
        super();
        this.fullScreenSpan = document.querySelector('.full-screen-span');
    }

    /**
     * Register event handlers.
     */
    connectedCallback() {
        this.controller = new AbortController();
        const options = { signal: this.controller.signal };
    
        /* Register event handlers */
        this.fullScreenSpan.addEventListener('click', () => { // Arrow function here
            if (!document.fullscreenElement) {
                if (this.fullScreenSpan.requestFullscreen) {
                    this.fullScreenSpan.requestFullscreen();
                } else if (this.fullScreenSpan.webkitRequestFullscreen) { /* Safari */
                    this.fullScreenSpan.webkitRequestFullscreen();
                } else if (this.fullScreenSpan.msRequestFullscreen) { /* IE11 */
                    this.fullScreenSpan.msRequestFullscreen();
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
        });
    
        // Optionally add a class for fullscreen styling
        this.fullScreenSpan.addEventListener('fullscreenchange', () => { // Arrow function here
            if (document.fullscreenElement) {
                this.fullScreenSpan.classList.add('fullscreen');
            } else {
                this.fullScreenSpan.classList.remove('fullscreen');
            }
        });
        this.fullScreenSpan.addEventListener('webkitfullscreenchange', () => { // Arrow function here
            if (document.webkitFullscreenElement) {
                this.fullScreenSpan.classList.add('fullscreen');
            } else {
                this.fullScreenSpan.classList.remove('fullscreen');
            }
        });
        this.fullScreenSpan.addEventListener('msfullscreenchange', () => { // Arrow function here
            if (document.msFullscreenElement) {
                this.fullScreenSpan.classList.add('fullscreen');
            } else {
                this.fullScreenSpan.classList.remove('fullscreen');
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