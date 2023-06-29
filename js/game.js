const config = {
    type: Phaser.AUTO,
    width: 912,
    height: 712,
    scene: [MenuScene, BattleScene]
};

const game = new Phaser.Game(config);