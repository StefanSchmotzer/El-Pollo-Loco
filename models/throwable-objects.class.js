class ThrowableObject extends MovableObject {
  height = 80;
  width = 80;
  hasSplashed = false;

  IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/5_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/6_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/7_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/8_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, otherDirection) {
    super().loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.lastX = x;
    this.lastY = y;

    this.otherDirection = otherDirection;
    this.throw();
    this.offset = {
      top: 30,
      bottom: 30,
      left: 15,
      right: 15,
    };
  }

  throw() {
    this.speedY = 15;
    if (sounds.THROW) sounds.THROW.play();
    this.applyGravity();
    this.startFlightMovement();
    this.startRotation();
  }

  startFlightMovement() {
    this.accelerationInterval = setInterval(() => {
      this.lastX = this.x;
      this.lastY = this.y;
      this.x += this.otherDirection ? -15 : 15;
    }, 15);
  }

  startRotation() {
    this.rotationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE);
    }, 75);
  }

  splash() {
    if (this.hasSplashed) return;
    this.hasSplashed = true;
    this.stopFlightLogic();
    this.playSplashSequence();
  }

  stopFlightLogic() {
    if (sounds.SPLASH) sounds.SPLASH.play();
    this.speedY = 0;
    clearInterval(this.accelerationInterval);
    clearInterval(this.rotationInterval);
  }

  playSplashSequence() {
    this.loadImage(this.IMAGES_SPLASH[0]);
    this.splashFrameCount = 0;
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
      this.checkSplashEnd();
    }, 50);
  }

  checkSplashEnd() {
    this.splashFrameCount++;
    if (this.splashFrameCount >= this.IMAGES_SPLASH.length) {
      clearInterval(this.splashInterval);
      this.opacity = 0;
    }
  }

  isCollidingSwept(enemy) {
    const minX = Math.min(this.lastX, this.x);
    const maxX = Math.max(this.lastX + this.width, this.x + this.width);

    const minY = Math.min(this.lastY, this.y);
    const maxY = Math.max(this.lastY + this.height, this.y + this.height);

    return (
      maxX > enemy.x + enemy.offset.left &&
      minX < enemy.x + enemy.width - enemy.offset.right &&
      maxY > enemy.y + enemy.offset.top &&
      minY < enemy.y + enemy.height - enemy.offset.bottom
    );
  }
}