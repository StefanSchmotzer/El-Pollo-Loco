class Cloud extends MovableObject {

IMAGES_WALKING = [
      'assets/img/5_background/layers/4_clouds/1.png'
   ];



    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.y = -40 + Math.random() * 60;
        this.x = 0 + Math.random() * 4000;
        this.width = 250 + Math.random() * 450;
        this.height = 150 + Math.random() * 300;
        this.speed = 0.01 + Math.random() * 0.2;
        this.animate();
   }



    animate() {
        this.moveLeft();
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }


}