import { FullScreenSpan } from "./full_screen_span.js";

/**
 * Initial entry to point of the application.
 *
 * Initializes the components, handles authentication, and sets up the event
 * listeners for workspace and channel interactions.
 */
async function main() {
    // Register the custom element
    customElements.define('full-screen-span', FullScreenSpan);
    const fullscreenspan = new FullScreenSpan();
}
  
/* Register event handler to run after the page is fully loaded. */
document.addEventListener("DOMContentLoaded", () => {
    main().catch((error) => {
        console.log("Error caught in main.ts:", ["Error: ", error]);
    });
});