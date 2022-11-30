class Player {
  constructor(id, color, name) {
    this.id = id;
    this.x = 800 / 2;
    this.y = 520 / 2;
    this.hp = 100;
    this.attack = 4;
    this.speed = 2;
    this.bulletNum = 6;
    this.img = new Image();
    this.color = color;
    this.dir = "right";
    if (this.color == "blue") {
      this.dir = "left";
    }
    this.name = name;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getHp() {
    return this.hp;
  }
  subHp(a) {
    this.hp -= a;
  }
  setHp(hp) {
    this.hp = hp;
  }
  getAttack() {
    return this.attack;
  }
  setAttack(attack) {
    this.attack = attack;
  }
  getSpeed() {
    return this.speed;
  }
  setSpeed(speed) {
    this.speed *= speed;
  }
  getBulletNum() {
    return this.bulletNum;
  }
  subBulletNum(number) {
    this.bulletNum -= number;
  }
  setBulletNum(number) {
    this.bulletNum = number;
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
  constructor(id, key, dir, x, y, color) {
    this.id = id;
    this.key = key;
    this.x = x;
    this.y = y + 32;
    this.dir = dir;
    this.color = color;
    this.radius = 4;
  }
  bulletUpdate(dir) {
    if (dir == "left") {
      this.x -= 8;
    } else {
      this.x += 8;
    }
  }
  getKey() {
    return this.key;
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
