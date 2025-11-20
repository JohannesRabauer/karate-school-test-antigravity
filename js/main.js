// Main game initialization
window.onload = function () {
    const config = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: GameConfig.width,
        height: GameConfig.height,
        backgroundColor: GameConfig.backgroundColor,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }, // Top-down game, no gravity
                debug: false // Set to true to see hitboxes
            }
        },
        scene: [
            BootScene,
            MenuScene,
            GameScene
        ],
        pixelArt: false,
        antialias: true
    };

    const game = new Phaser.Game(config);

    // Handle window resize if needed
    window.addEventListener('resize', () => {
        game.scale.refresh();
    });
};
