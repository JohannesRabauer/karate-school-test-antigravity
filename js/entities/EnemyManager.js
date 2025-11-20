class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = scene.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.spawnInitialEnemies();
    }

    spawnInitialEnemies() {
        // Spawn some bullies
        for (let i = 0; i < 3; i++) {
            this.spawnEnemy('bully');
        }

        // Spawn a thug
        this.spawnEnemy('thug');
    }

    spawnEnemy(type) {
        // Random position away from player
        const x = Phaser.Math.Between(100, GameConfig.worldWidth - 100);
        const y = Phaser.Math.Between(100, GameConfig.worldHeight - 100);

        // Ensure not too close to player
        if (Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y) < 400) {
            return this.spawnEnemy(type); // Retry
        }

        const enemy = new Enemy(this.scene, x, y, type);
        this.enemies.add(enemy);
    }

    getEnemies() {
        return this.enemies.getChildren();
    }
}
