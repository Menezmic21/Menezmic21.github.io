import { FullScreenSpan } from "./components/full_screen_span.js";
import { PianoRollContainer } from "./components/piano_roll_container.js";

/**
 * Template IDs.
 *
 * @param environmentsColumnTemplateId - Id of environment column template.
 */
const pianoRollContainerTemplateId = "#piano-roll-container-template";

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
  PianoRollContainer.initialize(getTemplate(pianoRollContainerTemplateId));

  // Define the customElements
  customElements.define('full-screen-span', FullScreenSpan);
  customElements.define("piano-roll-container", PianoRollContainer);
}

export { FullScreenSpan, PianoRollContainer };
