export let sessionID;
export let countdown;
export let startTime;
export let endTime;
export let sessionActive = false; // Track session status
let ball;
let timerEvent;
let mainScene;

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image('back', 'assets/cloudWithSea.png');
    this.load.audio('clock', 'assets/audio/oldClock.mp3');
    this.load.image('ball', 'assets/ball.png');
  }

  create() {
    mainScene = this; // Reference to the current scene

    this.add.image(0, 0, 'back').setOrigin(0, 0);
    this.clockSound = this.sound.add('clock');

    ball = this.physics.add.image(500, 600, 'ball').setCollideWorldBounds(true).setBounce(1, 1);
    ball.setDisplaySize(100, 100);

    // Set world bounds to the entire screen size
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height, true, true, true, true);

    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  startSession() {
    sessionActive = true;
    sessionID = Phaser.Math.Between(1000, 9999).toString();
    countdown = Phaser.Math.Between(70, 120);
    startTime = new Date().toLocaleTimeString();
    this.clockSound.play({ loop: true });

    const velocityX = Phaser.Math.Between(-600, 600);
    const velocityY = Phaser.Math.Between(-600, 600);
    ball.setVelocity(velocityX, velocityY);

    timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateCountdown,
      callbackScope: this,
      loop: true
    });

    updateDOMSessionInfo();
  }

  updateCountdown() {
    if (countdown > 0) {
      countdown--;
      document.getElementById('counterValue').innerText = countdown;
    } else {
      this.endSession();
    }
  }

  endSession() {
    endTime = new Date().toLocaleTimeString();
    this.clockSound.stop();
    timerEvent.remove();
    ball.setVelocity(0, 0);
    sessionActive = false;

    document.getElementById('endTime').innerText = endTime;

    this.events.emit('sessionEnd');
  }

  handleVisibilityChange() {
    // Do nothing; the game should continue running as usual
  }

  update(time, delta) {
    // Remove or modify this method if not needed anymore
  }
}

const config = {
  type: Phaser.CANVAS,
  width: 1000,
  height: 610,
  scene: MainScene,
  parent: 'gameContainer',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  disableVisibilityChange: false,
};

const game = new Phaser.Game(config);

game.events.on('ready', () => {
  game.scene.scenes[0].events.on('sessionEnd', () => {
    updateSessionList(); 
  });
});

export function startPhaserSession() {
  mainScene.startSession();
}

function updateDOMSessionInfo() {
  document.getElementById('sessionId').innerText = sessionID;
  document.getElementById('startTime').innerText = startTime;
  document.getElementById('counterValue').innerText = countdown;
}

export function updateSessionList() {
  const sessionList = document.getElementById('sessionList');
  sessionList.innerHTML = '';
  sessionData.push({ sessionID, startTime, endTime });
  sessionData.forEach(session => {
    const li = document.createElement('li');
  });
}

const sessionData = [];

document.getElementById('startSessionBtn').addEventListener('click', () => {
  if (!sessionActive) {
    startPhaserSession();
  }
});
