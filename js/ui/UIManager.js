class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;

        // Health Bar
        this.healthBarBg = scene.add.graphics().setScrollFactor(0);
        this.healthBar = scene.add.graphics().setScrollFactor(0);
        this.drawHealthBar(100);

        // Score Text
        this.scoreText = scene.add.text(20, 50, 'SCORE: 0', {
            fontFamily: GameConfig.ui.fontFamily,
            fontSize: '24px',
            color: '#f1c40f',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);

        // Game Over Container (Hidden initially)
        this.gameOverContainer = scene.add.container(scene.cameras.main.width / 2, scene.cameras.main.height / 2).setScrollFactor(0).setVisible(false);

        const bg = scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.8);
        const title = scene.add.text(0, -40, 'GAME OVER', { fontSize: '48px', color: '#e74c3c', fontStyle: 'bold' }).setOrigin(0.5);
        const restartBtn = scene.add.text(0, 40, 'TAP TO RESTART', { fontSize: '24px', color: '#2ecc71' }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => scene.scene.restart());

        this.gameOverContainer.add([bg, title, restartBtn]);
        this.gameOverContainer.setDepth(1000); // Ensure it's on top of everything
    }

    updateHealth(current, max) {
        this.drawHealthBar(current / max);
    }

    drawHealthBar(percentage) {
        const x = 20;
        const y = 20;
        const width = 200;
        const height = 20;

        this.healthBarBg.clear();
        this.healthBarBg.fillStyle(0x222222);
        this.healthBarBg.fillRect(x, y, width, height);

        this.healthBar.clear();
        if (percentage > 0.6) this.healthBar.fillStyle(0x2ecc71);
        else if (percentage > 0.3) this.healthBar.fillStyle(0xf1c40f);
        else this.healthBar.fillStyle(0xe74c3c);

        this.healthBar.fillRect(x, y, width * Math.max(0, percentage), height);
    }

    addScore(points) {
        this.score += points;
        this.scoreText.setText(`SCORE: ${this.score}`);

        // Simple score popup effect
        this.scene.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    showGameOver() {
        this.gameOverContainer.setVisible(true);
        this.gameOverContainer.setAlpha(0);

        this.scene.tweens.add({
            targets: this.gameOverContainer,
            alpha: 1,
            duration: 500
        });

        // Add Spacebar restart
        this.scene.input.keyboard.once('keydown-SPACE', () => {
            this.scene.scene.restart();
        });

        // Ensure button is interactive
        const btn = this.gameOverContainer.list[2]; // restartBtn
        btn.setInteractive({ useHandCursor: true });
    }
}
