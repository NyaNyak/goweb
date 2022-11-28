class Player {
  constructor(id, color) {
    this.id = id;
    this.x = 800 / 2;
    this.y = 520 / 2;
    this.img = new Image();
    this.color = color;
    this.dir = "right";
    if (this.color == "blue") {
      this.dir = "left";
    }
  }
  setImage(img, color, dir) {
    if (color == "red") {
      if (dir == "left") img.src = "/resource/player1_left.png";
      else this.img.src = "/resource/player1_right.png";
    } else {
      if (dir == "left") img.src = "/resource/player2_left.png";
      else this.img.src = "/resource/player2_right.png";
    }
  }
}

class Bullet {
  constructor(id, dir, x, y, color) {
    this.id = id;
    this.x = x;
    this.y = y + 32;
    this.dir = dir;
    this.color = color;
    this.radius = 4;
  }
  bulletUpdate(dir) {
    if (dir == "left") {
      this.x -= 3.5;
    } else {
      this.x += 3.5;
    }
  }
  getId() {
    return this.id;
  }
  getX() {
    return this.x;
  }
  setX(x) {
    this.x = x;
  }
  getY() {
    return this.y;
  }
  setY(y) {
    this.y = y;
  }
  getDir() {
    return this.dir;
  }
  setDir(dir) {
    this.dir = dir;
  }
  getRadius() {
    return this.radius;
  }
  setRadius() {
    this.radius = radius;
  }
  getColor() {
    return this.color;
  }
}
