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
    // NA

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