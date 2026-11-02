let canvas;
let world;
let keyboard = new Keys();
let sounds = new Sounds();
let isKeyDown = {};
let gameTasks = [];
let gamePaused = true;
let gameRunning = false;
let music = localStorage.getItem("music") === "true";

window.addEventListener("keydown", (e) => {
  if (!isKeyDown[e.code]) handleKeyDown(e.code);
  isKeyDown[e.code] = true;
});

function handleKeyDown(code) {
  if (!world || !gameRunning) return;

  if (!world.gameWon) {
    if (code === "Space") keyboard.JUMP_ONCE = true;
    if (code === "KeyD") keyboard.THROW_ONCE = true;
    if (code === "ArrowLeft") keyboard.LEFT = true;
    if (code === "ArrowRight") keyboard.RIGHT = true;
    if (code === "KeyF") toggleFullscreen();
    if (code === "KeyS") toggleSound();
    if (code === "KeyP") togglePause();
    if (code === "KeyL") showLyrics();
  }
}

window.addEventListener("keyup", (e) => {
  isKeyDown[e.code] = false;
  if (e.code === "ArrowLeft") keyboard.LEFT = false;
  if (e.code === "ArrowRight") keyboard.RIGHT = false;
});

function init() {
  const musicBtn = document.getElementById("music");
  if (musicBtn) {
    musicBtn.classList.toggle("music-on", music);
    musicBtn.classList.toggle("music-off", !music);
  }
  bindTouchEvents();
}

function startGame() {
  gameRunning = true;
  hideAllOverlays();
  removeTasksOfObject(world);
  initLevel();
  resetGameState();

  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, sounds);
  world.startGame();

  if (music) sounds.MUSIC.playFromStart();
}

function toggleSound() {
  music = !music;
  localStorage.setItem("music", music);

  if (!music) {
    stopAllGameSounds();
  } else if (!gamePaused && world) {
    const track = world.bossFirstContact
      ? sounds.BOSS_MUSIC
      : sounds.MUSIC;
    track.play();
  }
  init();
}

function stopAllGameSounds() {
  Object.keys(sounds).forEach((key) => {
    const sound = sounds[key];
    if (sound && typeof sound.stop === "function") {
      sound.stop();
    }
  });
}

function toggleFullscreen() {
  const container = document.getElementById("game");
  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => console.warn(err));
  } else {
    document.exitFullscreen();
  }
}

setInterval(() => {
  if (gamePaused) return;

  gameTasks.forEach((task) => {
    const now = performance.now();
    if (now - task.lastRun >= task.interval) {
      task.action();
      task.lastRun = now;
    }
  });
}, 1000 / 60);

function addGameTask(owner, action, interval) {
  gameTasks.push({ owner, action, interval, lastRun: 0 });
}

function removeTasksOfObject(owner) {
  gameTasks = gameTasks.filter((task) => task.owner !== owner);
}

function bindTouchEvents() {
  const bindBtn = (id, key) => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });

    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  };

  bindBtn("btnLeft", "LEFT");
  bindBtn("btnRight", "RIGHT");
  bindBtn("btnJump", "JUMP_ONCE");
  bindBtn("btnThrow", "THROW_ONCE");
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("load", checkOrientation);

function checkOrientation() {
  if (gameRunning) {
    gamePaused = window.innerHeight > window.innerWidth;
  }
}

function hideAllOverlays() {
  const overlays = ["startScreen", "winScreen", "loseScreen", "lyrics", "menu"];
  overlays.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
  });
  document.getElementById("playButtons")?.classList.remove("d-none");
}

function resetGameState() {
  gamePaused = false;
  gameTasks = [];
}

function showLyrics() {
  document.getElementById("lyrics").classList.remove("d-none");
}

function togglePause() {
  gamePaused = !gamePaused;

  if (gamePaused) {
    stopAllGameSounds();
  } else if (music) {
    const track = world?.bossFirstContact
      ? sounds.BOSS_MUSIC
      : sounds.MUSIC;
    track.play();
  }

  document
    .getElementById("btnPause")
    ?.classList.toggle("gamePaused", gamePaused);
}

function impressum() {
  document.getElementById("impressum").classList.remove("d-none");
  document.getElementById("menu").classList.add("d-none");
}

function hide() {
  document.getElementById("impressum").classList.add("d-none");
  document.getElementById("lyrics").classList.add("d-none");

  if (!gameRunning || gamePaused) {
    document.getElementById("menu").classList.remove("d-none");
  } else {
    document.getElementById("menu").classList.add("d-none");
  }
}