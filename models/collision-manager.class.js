class CollisionManager {
  constructor(world) {
    this.world = world;
  }
  checkAll() {
    this.checkEnemyCollisions();
    this.checkItemCollisions();
    this.checkProjectileCollisions();
  }

  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.isColliding(enemy)) {
        if (enemy instanceof Boss) {
          this.handleBossCollision();
        } else {
          this.handleChickenCollision(enemy);
        }
      }
    });
  }

  checkItemCollisions() {
    this.checkCoinCollisions();
    this.checkPickBottle();
  }

  checkProjectileCollisions() {
    this.world.throwableObjects.forEach((bottle) => {
      this.world.level.enemies.forEach((enemy) => {
        if (bottle.isCollidingSwept(enemy) && !bottle.hasSplashed) {
          if (enemy instanceof Boss) {
            bottle.splash();
            enemy.hit();
            this.world.bossStatusBar.setPercentage(enemy.energy);
          } else if (!enemy.isDead) {
            bottle.splash();
            this.executeEnemyKill(enemy, false);
          }
        }
      });
    });
  }

  handleBossCollision() {
    if (!this.world.character.isHurt() && !this.world.character.isDead()) {
      this.world.character.hit();
      this.world.statusBar.setPercentage(this.world.character.energy);
    }
  }

  handleChickenCollision(enemy) {
    const char = this.world.character;
    if (char.isAboveGround() && char.speedY <= 0 && !enemy.isDead) {
      this.executeEnemyKill(enemy, true);
    } else if (!enemy.isDead && !char.isAboveGround()) {
      if (!char.isHurt() && !char.isDead()) {
        char.hit();
        this.world.statusBar.setPercentage(char.energy);
      }
    }
  }

  executeEnemyKill(enemy, shouldJump) {
    enemy.isDead = true;
    if (shouldJump) {
      this.world.character.speedY = 12;
    }
    
    if (enemy instanceof Chickensmall) {
      sounds.CHICK_DEAD.play();
    } else {
      sounds.DEAD.play();
    }

    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(enemy);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 500);
  }

  checkCoinCollisions() {
    this.world.level.coins.forEach((coin, index) => {
      if (this.world.character.isColliding(coin)) {
        this.world.character.collectCoin();
        sounds.COIN.play();
        this.world.coinsStatusBar.setPercentage(this.world.character.coinsCount);
        this.world.level.coins.splice(index, 1);
      }
    });
  }

  checkPickBottle() {
    this.world.level.bottles.forEach((bottle, index) => {
      if (this.world.character.isColliding(bottle)) {
        if (this.world.character.bottleCount < 100) {
          this.world.character.collectBottle();
          this.world.level.bottles.splice(index, 1);
          this.world.bottleStatusBar.setPercentage(this.world.character.bottleCount);
          sounds.BOTTLE.play();
        }
      }
    });
  }
}