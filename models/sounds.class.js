class Sound {
  constructor(src, volume = 1, loop = false) {
    this.audio = new Audio(src);
    this.audio.volume = volume;
    this.audio.loop = loop;
  }

  play() {
    if (typeof music !== 'undefined' && music && this.audio.paused) {
      this.audio.play().catch((e) => {});
    }
  }
  playFromStart() {
    this.audio.currentTime = 0;
    if (typeof music !== 'undefined' && music) {
      this.audio.play().catch((e) => {});
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  pause() {
    this.audio.pause();
  }
}

class Sounds {
  constructor() {
    this.WALK = new Sound('assets/audio/walk.mp3', 0.6, true);
    this.JUMP = new Sound('assets/audio/jump.mp3', 1, false);
    this.THROW = new Sound('assets/audio/throw_bottle.mp3', 1, false);
    this.SPLASH = new Sound('assets/audio/844636__set214__glass-shatter.wav', 1, false);
    this.HURT = new Sound('assets/audio/hurt.mp3', 1, false);
    this.DEAD = new Sound('assets/audio/enemy-hurt.mp3', 1, false);
    this.COIN = new Sound('assets/audio/coin.mp3', 0.1, false);
    this.MUSIC = new Sound('assets/audio/pwlpl-moonlit-dreamy-ranchera-ballad-slow-68-mariachi-romance-596244.mp3', 0.2, true);
    this.BOSS_MUSIC = new Sound('assets/audio/davidgallie-final-boss-483043.mp3', 0.5, true);
    this.SCARED_BOSS = new Sound('assets/audio/scared-rooster.mp3', 0.7, true);
    this.BOTTLE = new Sound('assets/audio/bottle.mp3', 0.3, false);
    this.CHICK_DEAD = new Sound('assets/audio/chicken-dead.mp3', 0.3, false);
    this.WIN = new Sound('assets/audio/win.mp3', 0.8, false);
    this.LOSE = new Sound('assets/audio/lose.mp3', 1, false);
  }

  stopAll() {
    Object.keys(this).forEach(key => {
      if (this[key] instanceof Sound) {
        this[key].stop();
      }
    });
  }
}