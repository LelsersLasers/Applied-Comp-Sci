#include <iostream>
#include <cstdlib>
#include <cmath>

# define WIDTH 900
# define HEIGHT 700

class Vector {
public:
    double x, y;
    Vector() {
        this->x = -1;
        this->y = -1;
    }
    Vector(double x, double y) {
        this->x = x;
        this->y = x;
    }
    void apply(Vector other) {
        this->x = other.x;
        this->y = other.y;
    }
    void scale(double len) {
        double currentLen = sqrt(x * x + y * y);
        this->x = x * (len/currentLen);
        this->y = y * (len/currentLen);
    }
};

class HitBox {
public:
    Vector pt;
    double w, h;
    HitBox(Vector pt, double w, double h) {
        this->pt = pt;
        this->w = w;
        this->h = h;
    }
    bool checkCollide(HitBox other) {
        return (
            this->pt.x < other.pt.x + other.w
            && other.pt.x < this->pt.x + this->w
            && this->pt.y < other.pt.y + other.h
            && other.pt.y < this->pt.y + this->h
        );
    }
    bool outOfBounds() {
        return (this->pt.x < 0 || this->pt.x + this->w > WIDTH);
    }
};

int main() {
    std::cout << "this at least ran" << std::endl;

    

    return 0;
}