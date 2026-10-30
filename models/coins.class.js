class Coins extends MovableObject {
  height = 100;
  width = 100;
  offset = {
    top: 0,
    bottom: 0,
    left: 30,
    right: 30
  };
  
  IMAGES_COINS = [
    'assets/img/8_coin/coin_1.png',
    'assets/img/8_coin/coin_2.png'
  ];

  constructor(x, y) {
    super();
    this.loadImage(this.IMAGES_COINS[0]);
    this.loadImages(this.IMAGES_COINS);
    this.x = x;
    this.y = y;
    this.currentImage = Math.floor(Math.random() * this.IMAGES_COINS.length);
    this.animate();
  }
  animate() {

      addGameTask(this, () => {
        this.playAnimation(this.IMAGES_COINS);
      }, 200); // 200ms Intervall für eine flüssige Drehung
  }
}

function createCoinsLevel(totalPatterns) {
  const allCoins = [];
  for (let i = 0; i < totalPatterns; i++) {
    const x = 200 + (i * 400);
    const type = Math.random();

    if (type < 0.33) {
      allCoins.push(...createCoinRow(x, 300, 4));
    } else if (type < 0.66) {
      allCoins.push(...createCoinBlock(x, 150, 2, 1));
    } else {
      allCoins.push(...createCoinDiagonal(x, 350, 4, -1));
    }
  }
  return allCoins;
}

function createCoinRow(startX, startY, count) {
  const row = [];
  for (let i = 0; i < count; i++) {
    row.push(new Coins(startX + (i * 60), startY));
  }
  return row;
}

function createCoinDiagonal(startX, startY, count, directionY = -1) {
  const diag = [];
  for (let i = 0; i < count; i++) {
    diag.push(new Coins(startX + (i * 60), startY + (i * 40 * directionY)));
  }
  return diag;
}

function createCoinBlock(startX, startY, columns, rows) {
  const block = [];
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      block.push(new Coins(startX + (c * 60), startY + (r * 60)));
    }
  }
  return block;
}