class Cloud extends MovableObject {

IMAGES_WALKING = [
      'assets/img/5_background/layers/4_clouds/1.png',
      'assets/img/5_background/layers/4_clouds/2.png',
      'assets/img/5_background/layers/4_clouds/1.png'
   ];



    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.y = -40 + Math.random() * 60;
        this.x = 100 + Math.random() * 4000;
        this.width = 250 + Math.random() * 450;
        this.height = 150 + Math.random() * 300;
        this.speed = 0.01 + Math.random() * 0.75;
        this.animate();
   }



    animate() {
        this.moveLeft();
    }


}