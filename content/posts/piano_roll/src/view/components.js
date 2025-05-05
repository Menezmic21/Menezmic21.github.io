import { FullScreenSpan } from "./components/full_screen_span.js";
import { PianoRollCanvas } from "./components/full_screen_span/piano_roll_canvas.js";
import { UIBar } from "./components/full_screen_span/ui_bar.js";

/**
 * Template IDs.
 *
 * @param pianoRollCanvasTemplateId - Id of piano roll.
 * @param uiBarTemplateId - Id of the ui bar.
 */
const pianoRollCanvasTemplateId = "#piano-roll-canvas-template";
const uiBarTemplateId = "#ui-bar-template";

/**
 * Get a template element from the document by ID.
 *
 * @param {string} id
 * @returns {HTMLTemplateElement}
 */
function getTemplate(id) {
  const template = document.querySelector(id);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`Error: ${id} is not a template`);
  }
  return template;
}

/**
 * Initialize the components.
 *
 * This function must be called after the DOM has loaded,
 * but before any components are created.
 */
export function initComponents() {
  // Initilize the custom components
  PianoRollCanvas.initialize(getTemplate(pianoRollCanvasTemplateId));
  UIBar.initialize(getTemplate(uiBarTemplateId));

  // Define the customElements
  customElements.define("full-screen-span", FullScreenSpan);
  customElements.define("piano-roll-canvas", PianoRollCanvas);
  customElements.define("ui-bar", UIBar);
}

export { FullScreenSpan, PianoRollCanvas, UIBar };
