var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.apply = function (vOther) {
        this.x += vOther.x;
        this.y += vOther.y;
    };
    Vector.prototype.add = function (vOther) {
        return new Vector(this.x + vOther.x, this.y + vOther.y);
    };
    Vector.prototype.scale = function (len) {
        var currentLen = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = this.x * (len / currentLen);
        this.y = this.y * (len / currentLen);
    };
    Vector.prototype.scalar = function (s) {
        this.x *= s;
        this.y *= s;
    };
    return Vector;
}());
var HitBox = /** @class */ (function () {
    function HitBox(pt, w, h) {
        this.pt = pt;
        this.w = w;
        this.h = h;
    }
    HitBox.prototype.checkCollide = function (boxOther) {
        return (this.pt.x < boxOther.pt.x + boxOther.w && boxOther.pt.x < this.pt.x + this.w
            && this.pt.y < boxOther.pt.y + boxOther.h && boxOther.pt.y < this.pt.y + this.h);
    };
    HitBox.prototype.outOfBounds = function () {
        return (this.pt.x < 0 || this.pt.x + this.w > canvas.width);
    };
    HitBox.prototype.draw = function (color) {
        context.strokeStyle = color;
        context.strokeRect(this.pt.x, this.pt.y, this.w, this.h);
    };
    return HitBox;
}());
var Thing = /** @class */ (function (_super) {
    __extends(Thing, _super);
    function Thing(pt, w, h) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.active = true;
        return _this;
    }
    Thing.prototype.draw = function (color) {
        context.fillStyle = color;
        context.fillRect(this.pt.x, this.pt.y, this.w, this.h);
    };
    return Thing;
}(HitBox));
var Drawable = /** @class */ (function (_super) {
    __extends(Drawable, _super);
    function Drawable(pt, w, h, name, color) {
        var _this = _super.call(this, pt, w, h) || this;
        _this.name = name;
        _this.color = color;
        return _this;
    }
    Drawable.prototype.draw = function () {
        _super.prototype.draw.call(this, this.color);
    };
    return Drawable;
}(Thing));
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(name, color, user, active) {
        if (active === void 0) { active = false; }
        var _this = _super.call(this, new Vector(user.pt.x + user.w * 3 / 10, user.pt.y + user.h * 3 / 10), user.w * 2 / 5, user.h * 2 / 5, name, color) || this;
        _this.name = name;
        _this.color = color;
        _this.user = user;
        _this.active = active;
        return _this;
    }
    Item.prototype.update = function () {
        this.pt.x = this.user.pt.x + this.user.w * 3 / 10;
        this.pt.y = this.user.pt.y + this.user.h * 3 / 10;
    };
    Item.prototype.draw = function () {
        if (this.active) {
            this.update();
            _super.prototype.draw.call(this);
        }
    };
    return Item;
}(Drawable));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(pt, w, h, ms, color) {
        var _this = _super.call(this, pt, w, h, "Player", color) || this;
        _this.ms = ms;
        _this.color = color;
        return _this;
    }
    Player.prototype.move = function () {
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
    };
    return Player;
}(Drawable));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Enemy;
}(Thing));
