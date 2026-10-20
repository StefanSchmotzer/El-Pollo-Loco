class Cloud extends MovableObject{

    constructor(){
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');

        this.x = 0 + Math.random() * 500;
        this.y = -10 + Math.random() * 100;
        this.width = 250 + Math.random() * 450;
        this.height = 150 + Math.random() * 300;
        this.animate();
    }



    animate() {
        setInterval(() => {
            this.x -= 0.05;
        }, 1000/60);
    }

}