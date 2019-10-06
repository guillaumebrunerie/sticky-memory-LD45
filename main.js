var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 900,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [gameScene],
};

game = new Phaser.Game(config);

// var lvlScene = new Phaser.Scene('lvl')
