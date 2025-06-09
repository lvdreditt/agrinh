let enemies = [];
let towers = [];
let pollution = 0;
let energia = 100;
let gameOverFlag = false;
let wave = 1;

function setup() {
  createCanvas(800, 400);
  frameRate(60);
  setInterval(spawnEnemy, 2000);
}

function draw() {
  background(200, 255, 200);
  drawHUD();

  if (gameOverFlag) return;

  // Atualiza inimigos
  for (let enemy of enemies) {
    enemy.move();
    enemy.show();
    if (enemy.x > width - 20) {
      pollution += 10;
      enemy.dead = true;
    }
  }

  enemies = enemies.filter(e => !e.dead);

  // Torres atiram
  for (let tower of towers) {
    tower.show();
    tower.shoot(enemies);
  }//aperta em cima dos inimigos para plantar o repolho

  // Vitória / Derrota
  if (pollution >= 100) {
    gameOverFlag = true;
    showMessage("😵 Poluição fora de controle!");
  } else if (frameCount > 60 * 60) {
    gameOverFlag = true;
    showMessage("🌱 Você defendeu a floresta!");
  }

  // Energia se regenera
  if (frameCount % 60 === 0) energia = min(energia + 5, 100);
}

function mousePressed() {
  if (energia >= 30 && mouseY < height - 50) {
    towers.push(new Tower(mouseX, mouseY));
    energia -= 30;
  }
}

function drawHUD() {
  fill(0);
  rect(0, height - 50, width, 50);
  fill(255);
  textSize(16);
  text(`💨 Poluição: ${pollution}/100`, 100, height - 25);
  text(`⚡ Energia: ${energia}`, width / 2, height - 25);
  text(`🌊 Onda: ${wave}`, width - 100, height - 25);
}

function spawnEnemy() {
  if (!gameOverFlag) {
    enemies.push(new Enemy());
    if (frameCount % 600 === 0) wave++;
  }
}

function showMessage(msg) {
  fill(0, 200, 0);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(msg, width / 2, height / 2);
}

// Classes

class Enemy {
  constructor() {
    this.x = 0;
    this.y = random(50, height - 100);
    this.speed = random(1, 2 + wave * 0.2);
    this.dead = false;
    this.hp = 100;
  }

  move() {
    this.x += this.speed;
  }

  show() {
    fill(80);
    rect(this.x, this.y, 20, 20);
    fill(255, 0, 0);
    rect(this.x, this.y - 5, this.hp / 2, 3);
    textSize(12);
    text("🏭", this.x + 10, this.y + 10);
  }

  hit(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) this.dead = true;
  }
}

class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lastShot = 0;
  }

  show() {
    fill(34, 139, 34);
    ellipse(this.x, this.y, 30);
    textSize(14);
    text("🌳", this.x, this.y + 4);
  }

  shoot(enemies) {
    if (millis() - this.lastShot > 1000) {
      for (let enemy of enemies) {
        let d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d < 100) {
          enemy.hit(30);
          this.lastShot = millis();
          break;
        }
      }
    }
  }
}
