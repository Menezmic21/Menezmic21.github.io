import { Controller } from "./controller.js";

/**
 * Initial entry to point of the application.
 *
 * Initializes the components, handles authentication, and sets up the event
 * listeners for workspace and channel interactions.
 */
async function main() {
    const controller = new Controller();
    controller.initialize();
}
  
/* Register event handler to run after the page is fully loaded. */
document.addEventListener("DOMContentLoaded", () => {
    main().catch((error) => {
        console.log("Error caught in main.ts:", ["Error: ", error]);
    });
});