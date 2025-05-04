export class Note {
    context;

    // Animation variables
    dy = 10; // Vertical velocity

    constructor(canvas, context, x, canvas_height, width, height, fillStyle, start_time) {
        this.canvas = canvas;
        this.context = context;
        this.x = x;
        this.canvas_height = canvas_height;
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
        this.start_time = start_time;
    }

    draw(time) {
        // Draw the note
        this.context.fillStyle = this.fillStyle;
        const secondsToTraverse = 5;
        const note_y = Math.floor(this.canvas_height * ((time - this.start_time) / secondsToTraverse));
        this.context.fillRect(this.x, note_y, this.width, this.height);

        // If note fell off the edge
        // TODO: Kill the note
    }
}