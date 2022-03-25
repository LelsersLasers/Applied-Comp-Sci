class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    apply(vOther: Vector) {
        this.x += vOther.x;
        this.y += vOther.y;
    }
    add(vOther: Vector): Vector {
        return new Vector(this.x + vOther.x, this.y + vOther.y);
    }
    scale(len: number) {
        let currentLen: number = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x * (len/currentLen);
        this.y = this.y * (len/currentLen);
    }
    scalar(s: number) {
        this.x *= s;
        this.y *= s;
    }
}

class HitBox {
    pt: Vector;
    w: number;
    h: number;
    constructor(pt: Vector, w: number, h: number) {
        this.pt = pt;
        this.w = w;
        this.h = h;
    }
    checkCollide(boxOther: HitBox): boolean {
        return (
          this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w
          && this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h
        );
    }
    outOfBounds(): boolean {
        return (this.pt.x < 0 || this.pt.x + this.w > canvas.width);
    }
    draw(color: string) {
        context.strokeStyle = color;
        context.strokeRect(this.pt.x, this.pt.y, this.w, this.h);
    }
}

class Thing extends HitBox {
    active: boolean = true;
    constructor(pt: Vector, w: number, h: number) {
        super(pt, w, h);
    }
    draw(color: string) {
        context.fillStyle = color;
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
    }
}

class Item extends Thing {
    name: string;
    color: string;
    user: Player;
    constructor(name: string, color: string, user: Player, active: boolean = false) {
        super(
            new Vector(user.pt.x + user.w * 3/10, user.pt.y + user.h * 3/10),
            user.w * 2/5,
            user.h * 2/5
        );
        this.name = name;
        this.color = color;
        this.user = user;
        this.active = active;
    }
    update() {
        this.pt.x = this.user.pt.x + this.user.w * 3/10;
        this.pt.y = this.user.pt.y + this.user.h * 3/10;
    }
    draw() {
        if (this.active) {
            this.update();
            super.draw(this.color);
        }
    }
}

class Player extends Thing {
    lastDir: string = "s";
    ms: number;
    color: string;
    constructor(pt: Vector, w: number, h: number, ms: number, color: string) {
        super(pt, w, h);
        this.ms = ms;
        this.color = color;
    }
    move() {
        if (wDown) {
            this.pt.y -= this.ms;
        }
        else if (sDown) {
            this.pt.y += this.ms;
        }
        else if (dDown) {
            this.pt.x += this.ms;
        }
        else if (aDown) {
            this.pt.x -= this.ms;
        }
    }
    draw() {
        super.draw(this.color);
    }
}

class Enemy extends Thing {
    name: string;
    ms: number;
    color: string;
    hp: number;
    damage: number;
}