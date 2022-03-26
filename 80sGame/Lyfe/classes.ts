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
    subtract(vOther: Vector): Vector {
        return new Vector(this.x - vOther.x, this.y - vOther.y);
    }
    scale(len: number) {
        let currentLen: number = this.calcLen();
        this.x = this.x * (len/currentLen);
        this.y = this.y * (len/currentLen);
    }
    scalar(s: number) {
        this.x *= s;
        this.y *= s;
    }
    calcLen(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
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
    calcCenter(): Vector {
        return new Vector(this.pt.x + this.w/2, this.pt.y + this.h/2);
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

class Drawable extends Thing {
    name: string;
    color: string;
    constructor(pt: Vector, w: number, h: number, name: string, color: string) {
        super(pt, w, h);
        this.name = name;
        this.color = color;
    }
    draw() {
        super.draw(this.color);
    }
}

class Moveable extends Drawable {
    ms: number;
    hp: number;
    damage: number;
    constructor(pt: Vector, w: number, h: number, name: string, color: string, ms: number, hp: number, damage: number) {
        super(pt, w, h, name, color);
        this.ms = ms;
        this.hp = hp;
        this.damage = damage;
    }
    checkHit(target: Moveable): boolean {
        if (this.checkCollide(target)) {
            tar
            return true;
        }
        return false;
    }
}

class Player extends Moveable {
    constructor(pt: Vector, w: number, h: number, color: string, ms: number, hp: number, damage: number) {
        super(pt, w, h, "Player", color, ms, hp, damage);
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
}

class Enemy extends Moveable {
    target: Player;
    constructor(target: Player, pt: Vector, w: number, h: number, color: string, ms: number, hp: number, damage: number) {
        super(pt, w, h, "Enemy", color, ms, hp, damage);
        this.target = target;
    }
    update() {
        let dif = this.calcCenter().subtract(this.target.calcCenter());
        if (dif.calcLen() > 0) {
            if (Math.abs(dif.x) > Math.abs(dif.y)) {
                this.pt.x -= dif.x/Math.abs(dif.x) * this.ms;
            }
            else {
                this.pt.y -= dif.y/Math.abs(dif.y) * this.ms;
            }
        }
    }
}