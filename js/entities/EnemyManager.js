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
        // Spawn more bullies
        for (let i = 0; i < 8; i++) {
            this.spawnEnemy('bully');
        }

        // Spawn more thugs
        for (let i = 0; i < 4; i++) {
            this.spawnEnemy('thug');
        }
    }

    spawnEnemy(type) {
        // Random position away from player
        const x = Phaser.Math.Between(100, GameConfig.worldWidth - 100);
        const y = Phaser.Math.Between(100, GameConfig.worldHeight - 100);

        // Ensure not too close to player
        if (this.scene.player && Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y) < 400) {
            return this.spawnEnemy(type); // Retry
        }

        const enemy = new Enemy(this.scene, x, y, type);
        this.enemies.add(enemy);

        // Add collision with world obstacles for new enemies
        if (this.scene.worldGen) {
            this.scene.physics.add.collider(enemy, this.scene.worldGen.obstacles);
        }
    }

    onEnemyDeath(enemy) {
        // Respawn after a delay
        this.scene.time.delayedCall(2000, () => {
            // 30% chance to upgrade bully to thug
            const type = (enemy.type === 'bully' && Math.random() < 0.3) ? 'thug' : enemy.type;
            this.spawnEnemy(type);
        });
    }

    getEnemies() {
        return this.enemies.getChildren();
    }
}
