class Chickensmall extends MovableObject {

   height = 40;
   width = 40;
   y = 380;


   IMAGES_WALKING = [
      'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
   ];

   constructor() {
      super().loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING)
      this.x = 200 + Math.random() * 500;
      this.speed = 0.05 + Math.random() * 0.75;

      this.animate();
   }


   animate() {
      this.moveLeft();
      setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
      }, 10);

   }
}