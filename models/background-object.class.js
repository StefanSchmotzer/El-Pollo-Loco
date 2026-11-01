
class Background extends MovableObject {
  x = 0;
  y = 0;
  height = 480;
  width = 720;
  speedModifier;

  constructor(imgPath, x, speedModifier) {
    super();
    this.loadImage(imgPath);
    this.x = x;
    this.speedModifier = speedModifier;
  }
}

function getLayerConfigs() {
  return [
    { path: "air.png", speed: 0.4 },
    { path: "3_third_layer/1.png", speed: 0.5, altPath: "3_third_layer/2.png" },
    { path: "2_second_layer/1.png", speed: 0.75, altPath: "2_second_layer/2.png" },
    { path: "1_first_layer/1.png", speed: 1.0, altPath: "1_first_layer/2.png" },
  ];
}

function resolveLayerPath(config, index) {
  const isEven = index % 2 === 0;
  const fileName = (isEven || !config.altPath) ? config.path : config.altPath;
  return `assets/img/5_background/layers/${fileName}`;
}


function addLayersForScreen(layers, xOffset, index) {
  getLayerConfigs().forEach((config) => {
    const path = resolveLayerPath(config, index);
    layers.push(new Background(path, xOffset, config.speed));
  });
}

function createBackgroundLevel(levelLengthInScreens) {
  const backgroundLayers = [];
  const screenWidth = 719;
  for (let i = 0; i < levelLengthInScreens; i++) {
    addLayersForScreen(backgroundLayers, i * screenWidth, i);
  }
  return backgroundLayers;
}