class MovableObject extends DrawableObject {
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  groundLevel = 130;
  lastHit = 0;
  lastAnimationTime = 0;
  energy = 100;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  applyGravity() {
    addGameTask(
      this,
      () => {
        if (this.isAboveGround() || this.speedY > 0 || this.energy <= 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        } else {
          if (!(this instanceof ThrowableObject)) {
            this.y = this.groundLevel;
            this.speedY = 0;
          }
        }
      },
      15,
    );
  }

  isAboveGround() {
    if (this instanceof Boss) {
      return this.y < 50;
    }
    if (this instanceof ThrowableObject) {
      return true;
    } else if (this instanceof Character && this.energy <= 0) {
      return true;
    } else {
      return this.y < this.groundLevel;
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit() {
    if (sounds.HURT) sounds.HURT.play();
    this.energy -= 10;
    if (this.energy < 0) {
      this.energy = 0;
      this.speedY = 25; // Death jump effect
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 750;
  }

  isDead() {
    return this.energy === 0;
  }

  moveLeft() {
    if (!world.gameWon) {
      this.x -= this.speed;      
  }
}

  moveRight() {
    if (!world.gameWon) {
    this.x += this.speed;
  }
}

  playAnimation(images, fps = 10) {
    if (!world.gameWon) {
    let now = Date.now();
    let frameDuration = 1000 / fps;
    if (now - this.lastAnimationTime < frameDuration) {
      return;
    }
    this.lastAnimationTime = now;
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 20;
      if (sounds.JUMP) sounds.JUMP.play();
      if (sounds.WALK) sounds.WALK.stop();
    }
  }
}