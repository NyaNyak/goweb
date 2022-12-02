class Player {
  constructor(id, color, name) {
    this.id = id;
    this.x = 800 / 2;
    this.y = 520 / 2;
    this.hp = 100;
    this.attack = 2;
    this.speed = 2;
    this.inven = [];
    this.bulletRadius = 4;
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
    this.speed = speed;
  }
  getInven() {
    return this.inven;
  }
  setInven(item) {
    this.inven.push(item);
  }
  getBulletRadius() {
    return this.bulletRadius;
  }
  setBulletRadius(radius) {
    this.bulletRadius = radius;
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

class Item {
  constructor(type, x, y, key) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.key = key;
    this.img = new Image();

    // 4가지 속성
    this.attack = 0;
    this.bullet_radius = 0;
    this.hp_recover = 0;
    this.speed = 0;

    // 0 : 공격력 업
    // 1 : 더블 샷
    // 2 : 회복
    // 3 : 속도 증가
    switch (type) {
      case 0:
        this.img.src = "/resource/attack_power.png";
        this.img.width = 30;
        this.img.height = 50;
        this.attack = 1;
        this.hp_recover = 0;
        this.bullet_radius = 0;
        this.speed = 0;
        break;
      case 1:
        this.img.src = "/resource/double_shot.png";
        this.img.width = 30;
        this.img.height = 50;
        this.bullet_radius = 2;
        this.attack = 0;
        this.hp_recover = 0;
        this.speed = 0;
        break;
      case 2:
        this.img.src = "/resource/recovery.png";
        this.img.width = 50;
        this.img.height = 25;
        this.hp_recover = 30;
        this.bullet_radius = 0;
        this.attack = 0;
        this.speed = 0;
        break;
      case 3:
        this.img.src = "/resource/speed_up.png";
        this.img.width = 40;
        this.img.height = 40;
        this.speed = 2;
        this.attack = 0;
        this.bullet_radius = 0;
        this.hp_recover = 0;
        break;

      default:
        break;
    }
  }
  getType() {
    return this.type;
  }
  setType(type) {
    this.type = type;
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
}

class Bullet {
  constructor(id, key, dir, damage, x, y, color, radius) {
    this.id = id;
    this.key = key;
    this.x = x;
    this.y = y + 32;
    this.dir = dir;
    this.damage = damage;
    this.color = color;
    this.radius = radius;
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
  getDamage() {
    return this.damage;
  }
  setDamage(damage) {
    this.damage = damage;
  }
  getRadius() {
    return this.radius;
  }
  setRadius(radius) {
    this.radius = radius;
  }
  getColor() {
    return this.color;
  }
}
