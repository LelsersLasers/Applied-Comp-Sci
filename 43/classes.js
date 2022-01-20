class Coin {
    constructor() {
        this.x = getRandomInt(4, canvas.width - 4);
        this.w = 8;
        this.y = getRandomInt(4, canvas.width - 4);
        this.color = "#00ff00";
        let a = this.x % 12;
        if (a < 4 || a > 8) {
            this.color = "#ff0000";
            fails++;
        }
    }
    draw() {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.w/2, 0, 2 * Math.PI);
        context.fill();
    }
}

class Line {
    constructor(x) {
        this.x = x;
    }
    draw() {
        context.strokeStyle = "#ffffff";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(this.x, 0);
        context.lineTo(this.x, canvas.height);
        context.stroke();
    }
}