
class Character extends MovableObject {
    x = 50;
    y = 20;
    height = 300;
    width = 120;
    speed = 5;
    offset = { top: 150, bottom: 20, left: 50, right: 50 };
    energy = 100;
    coinsCount = 0;
    bottleCount = 0;
    deathTimer = 0;
    animationFrameIndex = 0;
    IMAGES_WALKING = [
        "assets/img/2_character_pepe/2_walk/W-21.png",
        "assets/img/2_character_pepe/2_walk/W-22.png",
        "assets/img/2_character_pepe/2_walk/W-23.png",
        "assets/img/2_character_pepe/2_walk/W-24.png",
        "assets/img/2_character_pepe/2_walk/W-25.png",
        "assets/img/2_character_pepe/2_walk/W-26.png"
    ];
    IMAGES_IDLE = [
        "assets/img/2_character_pepe/1_idle/idle/I-1.png",
        "assets/img/2_character_pepe/1_idle/idle/I-2.png",
        "assets/img/2_character_pepe/1_idle/idle/I-3.png",
        "assets/img/2_character_pepe/1_idle/idle/I-4.png",
        "assets/img/2_character_pepe/1_idle/idle/I-5.png",
        "assets/img/2_character_pepe/1_idle/idle/I-6.png",
        "assets/img/2_character_pepe/1_idle/idle/I-7.png",
        "assets/img/2_character_pepe/1_idle/idle/I-8.png",
        "assets/img/2_character_pepe/1_idle/idle/I-9.png",
        "assets/img/2_character_pepe/1_idle/idle/I-10.png"
    ];
    IMAGES_LONG_IDLE = [
        "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
        "assets/img/2_character_pepe/1_idle/long_idle/I-20.png"
    ];
    IMAGES_JUMPING = [
        "assets/img/2_character_pepe/3_jump/J-31.png",
        "assets/img/2_character_pepe/3_jump/J-32.png",
        "assets/img/2_character_pepe/3_jump/J-33.png",
        "assets/img/2_character_pepe/3_jump/J-34.png",
        "assets/img/2_character_pepe/3_jump/J-35.png",
        "assets/img/2_character_pepe/3_jump/J-36.png",
        "assets/img/2_character_pepe/3_jump/J-37.png",
        "assets/img/2_character_pepe/3_jump/J-38.png",
        "assets/img/2_character_pepe/3_jump/J-39.png"
    ];
    IMAGES_DEAD = [
        "assets/img/2_character_pepe/5_dead/D-51.png",
        "assets/img/2_character_pepe/5_dead/D-52.png",
        "assets/img/2_character_pepe/5_dead/D-53.png",
        "assets/img/2_character_pepe/5_dead/D-54.png",
        "assets/img/2_character_pepe/5_dead/D-55.png",
        "assets/img/2_character_pepe/5_dead/D-56.png",
        "assets/img/2_character_pepe/5_dead/D-58.png",
        'assets/img/2_character_pepe/5_dead/D-58.png'
    ];
    IMAGES_HURT = [
        "assets/img/2_character_pepe/4_hurt/H-41.png",
        "assets/img/2_character_pepe/4_hurt/H-42.png",
        "assets/img/2_character_pepe/4_hurt/H-43.png"
    ];
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadAllImages();
        this.lastKeyPress = Date.now();
        this.applyGravity();
    }
    loadAllImages() {
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
    }
    start() {
        this.animate();
        this.moving();
    }
    collectCoin() {
        this.coinsCount = Math.min(this.coinsCount + 5, 100);
    }
    collectBottle() {
        this.bottleCount = Math.min(this.bottleCount + 10, 100);
    }
    throwBottle() {
        this.bottleCount = Math.max(this.bottleCount - 10, 0);
    }
    animate() {
        addGameTask(this, () => {
            if (!this.world?.keyboard) return;
            this.handleStateAnimations();
        }, 15);
    }
    handleStateAnimations() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT, 5);
        } else if (this.isAboveGround()) {
            this.handleJumpAnimation();
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING, 12);
        } else {
            this.playIdleAnimations();
        }
    }
    playDeathAnimation() {
        this.playAnimation(this.IMAGES_DEAD, 6);
        this.speedY = 0;
        this.acceleration = 0;
        this.deathTimer++;
        if (this.deathTimer > 20) this.y += 6;
    }
    playIdleAnimations() {
        const timer = Date.now() - this.lastKeyPress;
        this.playAnimation(timer > 10000 ? this.IMAGES_LONG_IDLE : this.IMAGES_IDLE, 5);
    }
    hit() {
        super.hit();
        this.resetIdleTimer();
        if (this.world?.statusBar) {
            this.world.statusBar.setPercentage(this.energy);
        }
        if (!this.isDead()) {
            this.speedY = 10;
            this.applyKnockback();
        }
    }
    applyKnockback() {
        const knockbackSpeed = this.otherDirection ? 15 : -15;
        let count = 0;
        const interval = setInterval(() => {
            if (this.x + knockbackSpeed > 50) this.x += knockbackSpeed;
            count++;
            if (count > 5 || this.x < 0) clearInterval(interval);
        }, 15);
    }
    moving() {
        addGameTask(this, () => {
            if (!this.world?.keyboard) return;
            this.manageWalkingSound();
            this.handleMovementInput();
            this.handleJumpInput();
            this.world.camera_x = -this.x + 50;
        }, 15);
    }
    handleMovementInput() {
        if (this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
            this.resetIdleTimer();
        }
        if (this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
            this.resetIdleTimer();
        }
    }
    canMoveRight() {
        return this.world.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x &&
            !this.isDead();
    }
    canMoveLeft() {
        return this.world.keyboard.LEFT &&
            this.x > 55 &&
            !this.isDead();
    }
    handleJumpInput() {
        if (this.world.keyboard.JUMP_ONCE) {
            const canJump = !this.isAboveGround() && !this.isDead();
            this.world.keyboard.JUMP_ONCE = false;
            if (canJump) {
                this.currentImage = 0;
                this.executeJump();
                this.resetIdleTimer();
            }
        }
    }
    executeJump() {
        if (!this.isDead()) {
            this.speedY = 20;
            sounds?.JUMP?.play();
        }
    }
    handleJumpAnimation() {
        if (this.isAboveGround()) {
            if (this.speedY > 0 || this.currentImage < 6) {
                if (this.currentImage < 6) {
                    this.playAnimation(this.IMAGES_JUMPING, 15);
                } else {
                    this.img = this.imageCache[this.IMAGES_JUMPING[5]];
                }
            } else {
                this.playAnimation(this.IMAGES_JUMPING.slice(6), 10);
                if (this.currentImage >= this.IMAGES_JUMPING.length) {
                    this.img = this.imageCache[this.IMAGES_JUMPING[8]];
                }
            }
        }
    }
    manageWalkingSound() {
        if (!sounds?.WALK || !this.world) return;
        const moving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
        const walking = moving && !this.isAboveGround() && !this.isDead() && !gamePaused && !this.world.gameWon;
        walking ? sounds.WALK.play() : sounds.WALK.pause();
    }
    resetIdleTimer() {
        this.lastKeyPress = Date.now();
    }
}