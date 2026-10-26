class ThrowableObject extends MovableObject {

    constructor(x, y){
        super().loadImage('assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.x = x;
        this.y = y;
        this.height = 100;
        this.widthc = 50;
        this.throw(100, 150);
    }

     IMAGES_BOTTLE = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/5_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/6_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/7_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/8_bottle_rotation.png",
     ]

     throw(x, y) {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
     }
}