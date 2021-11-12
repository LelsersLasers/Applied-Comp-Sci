class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    print() {
        console.log("(" + this.x + ", " + this.y + ")");
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

class HitBox {
    constructor(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
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
    constructor(pt, color, w, h) { // w, h, radius, etc per child
        this.pt = pt;
        this.color = color;
        this.w = w;
        this.h = h;
        this.width = 3;
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
    }
    updateHB() {
        this.hb = new HitBox(this.pt, this.w, this.h);
    }
}

class Player extends Thing {
    constructor(pt, color, w, h, ms) {
        super(pt, color, w, h);
        this.ms = ms;
    }
    move() {
        if (this.active && frame > moveLockWait) {
            if (up) {
                for (var i = 0; i < cars.length; i++) {
                    cars[i].pt.y += this.ms;
                    // cars[i].updateHB();
                }
                for (var i = 0; i < bar.length; i++) {
                    bar[i].toggle();
                }
                score += 1;
                if (score > topScore) {
                    topScore = score;
                }
            }
            else if (down) {
                for (var i = 0; i < cars.length; i++) {
                    cars[i].pt.y -= this.ms;
                    // cars[i].updateHB();
                }
                for (var i = 0; i < bar.length; i++) {
                    bar[i].toggle();
                }
                score -= 1;
            }
            else if (left) {
                this.pt.x -= this.ms;
            }
            else if (right) {
                this.pt.x += this.ms;
            }
            if (up || down || left || right) {
                frame = 0;
            }
        }
    }
}

class Car extends Thing {
    constructor(pt, color, w, h, ms) {
        super(pt, color, w, h);
        this.ms = ms;
        this.offScreen = false;
        this.deathMessage = "Road Kill";
    }
    update() {
        this.pt.x += this.ms;
        if (this.pt.x < 0 || this.pt.x > canvas.width - this.w) {
            this.ms = this.ms * -1;
            this.ms = this.ms * 1.01;
        }
        if (this.pt.y > canvas.height && !this.offScreen) {
            // this.pt.y = this.pt.y - (1.5 * carHeight) * 10; // 10 cars, no break
            // this.ms = this.ms * 1.05;
            var pos = new Vector(getRandomInt(0, canvas.width - carWidth), this.pt.y - (1.5 * carHeight) * 10);
            cars.push(new Car(pos, "#ff0000", carWidth, carHeight, this.ms * 1.05));
            this.offScreen = true;
        }
    }
}


class Block extends Thing {
    constructor(pt, color, color2, w, h) {
        super(pt, color, w, h);
        this.color2 = color2;
    }
    draw() {
        // context.strokeStyle = this.color;
        context.fillStyle = this.active ? this.color2 : this.color;
        context.lineWidth = this.width;
        context.beginPath();
        context.rect(this.pt.x, this.pt.y, this.w, this.h);
        context.fill();
    }
}

class Water extends Thing {
    constructor(pt, color, w, h) {
        super(pt, color, w, h);
        this.offScreen = false;
        this.deathMessage = "Drowned";
    }

    update() {
        if (this.pt.y > canvas.height && !this.offScreen) {
            // var w = getRandomInt(carHeight * 0.75, carHeight * 2);
            // badX = true;
            // while (badX) {
            //     x = getRandomInt(0, canvas.width - carWidth);
            //     if (x < startPos.x + carWidth && startPos.x < x + w) {}
            //     else {
            //         badX = false;
            //     }
            // }
            // pos = new Vector(x, startPos.y); // i think pos gets passed as a reference??
            // cars.push(new Water(pos, "#0000ff", w, carHeight));
            // waters.push(new Water(pos, "#0000ff", w, carHeight));
            var w = getRandomInt(carHeight * 0.75, carHeight * 2);
            var y = this.pt.y - (1.5 * carHeight) * 10
            badX = true;
            while (badX) {
                x = getRandomInt(0, canvas.width - w);
                var tempHB = new HitBox(new Vector(x,y));
                for (var i = 0; i < cars.length; i++) {
                    if (tempHB.checkCollide(cars[i].hb)) {}
                    else {
                        badX = false;
                    }
                }
            }
            var pos = new Vector(x, y);
            cars.push(new Water(pos, "#0000ff", w, carHeight));
            waters.push(new Water(pos, "#0000ff", w, carHeight));
            this.offScreen = true;
        }
    }
}

class Lake {
    constructor(ws) {
        this.ws = ws;
    }
    
    form() {
        this.ws = [];
        // at most can be 1/2 of total width
        topW = getRandomInt(carHeight * 0.75, carHeight * 2);
        totalH = getRandomInt(3, 6);
        for (var i = 0; i < totalH; i++) {
            
        }
    }

    moveUp(ms) {
        for (var i = 0; i < ws.length; i++) {
            this.ws.pt.y += ms;
        }
    }
    moveDown(ms) {
        for (var i = 0; i < ws.length; i++) {
            this.ws.pt.y -= ms;
        }
    }
}