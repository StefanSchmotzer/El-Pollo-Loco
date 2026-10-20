class Chickensmall extends MovableObject{

    height = 40;
    width = 40;
    y = 380;

     constructor(){
        super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');

        this.x = 200 + Math.random() * 500;
     }

}