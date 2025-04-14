export class Ball {
    context;

    // Animation variables
    x = Math.floor(Math.random() * 500);
    y = Math.floor(Math.random() * 200);
    radius = 20;
    dx = Math.floor(Math.random() * 10); // Horizontal velocity
    dy = Math.floor(Math.random() * 10); // Vertical velocity

    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }

    draw() {
        // Draw a circle
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = 'blue';
        this.context.fill();

        // Update circle position
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off canvas edges
        if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
}