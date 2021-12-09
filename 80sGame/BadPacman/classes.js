class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    apply(vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    }
}

class HitBox {
    constructor(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
        this.width = 3;
    }
    checkCollide(boxOther) {
        if (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w) {
            if (this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h) {
                return true;
            }
        }
        return false;
    }
    outOfBounds() {
        if (this.pt.x < 0 || this.pt.x + this.w > canvas.width) {
            return true;
        }
        return false;
    }
    draw(color) {
        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.stroke();
    }
}

class Thing {
    constructor(pt, color, w, h) {
        this.pt = pt;
        this.color = color;
        this.w = w;
        this.h = h;
        this.width = 1;
        this.active = true;
        this.hb = new HitBox(pt, w, h);
    }

    off() {
        this.active = false;
    }
    on() {
        this.active = true;
    }
    toggle() {
        this.active = !this.active;
    }

    draw() {
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        if (this.active) {
            context.fill();
        }
        context.stroke();

        context.strokeStyle = "#ffffff";
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.stroke();

    }
    updateHB() {
        this.hb = new HitBox(this.pt, this.w, this.h);
    }
}

class Tile extends Thing {
    constructor(pt, w, h, a, b) {
        var color = "#0000ff";
        super(pt, color, w, h);
        this.a = a;
        this.b = b;
    }
}

class Player extends Thing {
    constructor(pt, w, h, ms, a, b) {
        var color = "#00ff00";
        super(pt, color, w, h);
        this.ms = ms;
        this.a = a;
        this.b = b;
        this.oldDir = " ";
    }
    move() {
        var pos = [this.pt.x, this.pt.y];
        if (true) {
            if (this.oldDir != dir) {
                switch (dir) {
                    case "w":
                        this.pt.y -= this.ms/moveWait;
                        break;
                    case "s":
                        this.pt.y += this.ms/moveWait;
                        break;
                    case "a":
                        this.pt.x -= this.ms/moveWait;
                        break;
                    case "d":
                        this.pt.x += this.ms/moveWait;
                        break
                }
                var failed = false;
                for (var i = 0; i < tiles.length; i++) {
                    if (tiles[i].hb.checkCollide(player.hb)) {
                        failed = true;
                        tiles[i].off();
                        console.log("a");
                    }
                }
                if (failed) {
                    // this.pt.x = pos[0];
                    // this.pt.y = pos[1];
                    dir = this.oldDir;
                }
                else {
                    this.oldDir = dir;
                }
            }
        }
    }
}