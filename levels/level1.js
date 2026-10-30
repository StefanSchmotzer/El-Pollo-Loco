let level1;

function initLevel() {
  level1 = new Level(
    createEnemyLevel(12),
    createCloudLevel(10),
    createBackgroundLevel(6),
    createCoinsLevel(6),
    createBottleLevel(13)
  );
}

function createEnemyLevel(count) {
  const enemies = [new Boss()];
  for (let i = 0; i < count; i++) {
    const x = 800 + (i * 200) + (Math.random() * 200);
    enemies.push(getRandomEnemy(x));
  }
  return enemies;
}

function getRandomEnemy(x) {
  if (Math.random() > 0.5) {
    return new Chicken(x);
  }
  return new Chickensmall(x);
}