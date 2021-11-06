class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    print() {
        console.log(this.x, this.y);
    }
    apply(vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    }
    setBoth(values) {
        this.x = values[0];
        this.y = values[1];
    }
}

class Force extends Vector {
    constructor(x, y, heading) {
        super(x, y);
        this.heading = heading; // 0 = right, 90 = up
    }
    setHeading(heading) {
        this.heading = heading;
    }

    updateByHeading(heading) {
        len = Math.sqrt(this.x * this.heading.x + this.y * this.heading.y); // distance formula
        this.x = Math.cos(heading);
        this.y = Math.sin(heading);
        newLen = Math.sqrt(this.x * this.heading.x + this.y * this.heading.y);
        this.x = this.x * len/newLen;
        this.y = this.y * len/newLen;
    }
}

class Thing {
    constructor(pt, color, f) { // w, h, radius, etc per child
        this.pt = pt;
        this.v = new Vector(0, 0);
        this.f = f; // forces
        this.color = color;
        this.width = 3;
        this.active = true;
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

    update() {
        for (var i = 0; i < this.f.length; i++) { // for every force, update the vel
            this.v.apply(this.f[i])
        }
        this.pt.apply(this.v);
    }

    // draw to be per child
    // draw() {
    //     context.strokeStyle = this.color;
    //     context.fillStyle = this.color;
    //     context.lineWidth = this.width;
    //     context.beginPath();
    //     context.rect(this.pt.x, this.pt.y, this.w, this.h);
    //     if (this.active) {
    //         context.fill();
    //     }
    //     context.stroke();
    // }
}

class Ship extends Thing {
    constructor(pt, w, h, heading, color, f) {
        super(pt, color, f);
        this.w = w;
        this.h = h;
        this.heading = heading;
        console.log(this.f);
    }
    checkMove() {
        if (left) {
            heading = this.heading + 1;
        }
        if (right) {
            heading = this.heading - 1;
        }
        for (var i = 0; i < this.f.length; i++) {
            console.log(this.f[0]);
            this.f[i].setHeading(this.heading);
            this.f[i].updateByHeading();
        }
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
        }
}
