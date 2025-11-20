class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Title
        this.add.text(width / 2, height / 3, 'KARATE SCHOOL FIGHTER', {
            fontFamily: GameConfig.ui.fontFamily,
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#e74c3c',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Instructions
        const instructions = [
            'PC Controls:',
            'WASD / Arrows to Move',
            'SPACE / J to Punch',
            'K to Kick',
            '',
            'Mobile Controls:',
            'Left Stick to Move',
            'Tap Buttons to Attack'
        ];

        this.add.text(width / 2, height / 2, instructions, {
            fontFamily: GameConfig.ui.fontFamily,
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Start Button
        const startBtn = this.add.text(width / 2, height * 0.8, 'TAP TO START', {
            fontFamily: GameConfig.ui.fontFamily,
            fontSize: '32px',
            color: '#2ecc71',
            backgroundColor: '#222222',
            padding: { x: 20, y: 10 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.startGame())
            .on('pointerover', () => startBtn.setStyle({ fill: '#27ae60' }))
            .on('pointerout', () => startBtn.setStyle({ fill: '#2ecc71' }));

        // Blink effect for start button
        this.tweens.add({
            targets: startBtn,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    startGame() {
        this.scene.start('GameScene');
    }
}
