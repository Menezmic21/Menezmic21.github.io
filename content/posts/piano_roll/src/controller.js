import { View } from "./view.js"
import { initComponents } from "./view/components.js";

/* CUSTOM TYPES */

/* CUSTOM CLASS */

/**
 * A class for managing the connection between model and view. This class serves as the adapter in MVA.
 *
 * @class Controller
 * @typedef {Controller}
 */
export class Controller {
  view;

    constructor() {
        this.view = new View();
    }

    /**
     * Initializes the Controller - sets up components, error displays, and event listeners.
     *
     * @public
     */
    initialize() {
        initComponents();
    }
}
