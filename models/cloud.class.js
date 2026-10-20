class Cloud extends MovableObject{

    constructor(){
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');

        this.x = 0 + Math.random() * 500;
        this.y = 0 + Math.random() * 200;
        this.width = 400;
        this.height = 250;
    }

}