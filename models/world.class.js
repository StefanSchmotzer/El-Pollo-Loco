
class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar;
  bossStatusBar;
  bottleStatusBar;
  coinsStatusBar;
  scaredSoundPlayed = false;
  gameWon = false;
  throwableObjects = [];
  lastThrow = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.statusBar = new StatusBar('health', 10, 0, 100);
    this.bossStatusBar = new StatusBar('boss', 690, 5, 100);
    this.bottleStatusBar = new StatusBar('bottle', 10, 30, 0);
    this.coinsStatusBar = new StatusBar('coin', 10, 60, 0);
    this.collisionManager = new CollisionManager(this);
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  run() {
    addGameTask(this, () => {
      this.collisionManager.checkAll();
      this.checkThrowObject();
      this.checkMeetBoss();
      this.checkGameOver();
    }, 15);
  }

  startGame() {
    this.character.start();
    this.level.enemies.forEach((enemy) => enemy.animate());
    this.level.coins.forEach((coin) => coin.animate());
    this.level.clouds.forEach((cloud) => cloud.animate());
}

  checkThrowObject() {
    let currentTime = new Date().getTime();
    let timeSinceLastThrow = currentTime - this.lastThrow;

    if (this.keyboard.THROW_ONCE) {
      if (timeSinceLastThrow > 1000) {
        if (this.character.bottleCount > 0 && !this.character.isDead()) {
          this.executeThrow(currentTime);
        }
      }
      this.keyboard.THROW_ONCE = false;
    }
  }

  executeThrow(currentTime) {
    let offsetX = this.character.otherDirection ? -10 : 75;
    let bottle = new ThrowableObject(
      this.character.x + offsetX, 
      this.character.y + 100, 
      this.character.otherDirection
    );
    this.throwableObjects.push(bottle);
    this.character.throwBottle();
    this.bottleStatusBar.setPercentage(this.character.bottleCount);
    this.lastThrow = currentTime;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackgroundLayers();
    this.drawWorldObjects();
    this.drawStatusBars();
    this.drawCharacterLayer();

    requestAnimationFrame(() => this.draw());
  }

  drawBackgroundLayers() {
    this.level.backgrounds.forEach((bg) => this.drawWithModifier(bg, bg.speedModifier));
    this.level.clouds.forEach((cloud) => this.drawWithModifier(cloud, cloud.speedModifier || 0.5));
  }

  drawWorldObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleStatusBar);
    this.addToMap(this.coinsStatusBar);
    if (this.bossFirstContact) {
      this.addToMap(this.bossStatusBar);
    }
  }

  drawCharacterLayer() {
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
  }

  drawWithModifier(obj, modifier) {
    this.ctx.translate(this.camera_x * modifier, 0);
    this.addToMap(obj);
    this.ctx.translate(-this.camera_x * modifier, 0);
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    mo.x = mo.x * -1;
    this.ctx.scale(-1, 1);
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  checkMeetBoss() {
    if (gamePaused) return;
    let boss = this.level.enemies.find((e) => e instanceof Boss);
    if (boss) {
      let distance = boss.x - this.character.x;
      if (distance < 720) {
        this.triggerBossFight();
      }
    }
  }

  triggerBossFight() {
    if (!this.scaredSoundPlayed) {
      this.scaredSoundPlayed = true;
      sounds.SCARED_BOSS.play();
    }
    if (!this.bossFirstContact) {
      this.bossFirstContact = true;
      sounds.MUSIC.stop();
      if (music) {
        sounds.BOSS_MUSIC.play();
      }
    }
  }

  checkGameOver() {
    let boss = this.level.enemies.find((e) => e instanceof Boss);
    if (boss && boss.y > 200 && !this.gameWon) {
      this.executeWinSequence();
    }
    if (this.character.energy <= 0 && this.character.y > 350 && !this.gameWon) {
      this.executeLoseSequence();
    }
  }

  executeWinSequence() {
    this.gameWon = true;
    gamePaused = true;
    stopSounds();
    this.level.enemies.forEach(enemy => {
      enemy.speed = 0; 
    });
    if (sounds.WIN) sounds.WIN.play();
    document.getElementById('winScreen').classList.remove('d-none');
    document.getElementById('menu').classList.remove('d-none');
  }

  executeLoseSequence() {
    if (gamePaused) return; 
    this.gameWon = false; 
    gamePaused = true;
    stopSounds();
    if (sounds.LOSE) sounds.LOSE.play();
    document.getElementById('menu').classList.remove('d-none');
    document.getElementById('loseScreen').classList.remove('d-none');
  }
}

function stopSounds() {
  if (sounds) {
    sounds.BOSS_MUSIC.stop();
    sounds.MUSIC.stop();
    sounds.SCARED_BOSS.stop();
    sounds.WALK.stop();
  }
}