class CombatSystem {
    constructor(scene) {
        this.scene = scene;
    }

    checkAttack(attacker, hitPos, damage) {
        const enemies = this.scene.enemyManager.getEnemies();
        const hitRadius = GameConfig.combat.hitboxSize;

        enemies.forEach(enemy => {
            if (enemy.active && enemy.health > 0) {
                const dist = Phaser.Math.Distance.Between(hitPos.x, hitPos.y, enemy.x, enemy.y);

                if (dist < hitRadius + enemy.width / 2) {
                    // Calculate knockback direction
                    const angle = Phaser.Math.Angle.Between(attacker.x, attacker.y, enemy.x, enemy.y);
                    const knockbackDir = {
                        x: Math.cos(angle),
                        y: Math.sin(angle)
                    };

                    enemy.takeDamage(damage, knockbackDir);

                    // Hit effect
                    this.createHitEffect(enemy.x, enemy.y);
                }
            }
        });
    }

    createHitEffect(x, y) {
        const particles = this.scene.add.particles(x, y, 'punch_effect', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 200,
            quantity: 5
        });

        this.scene.time.delayedCall(200, () => {
            particles.destroy();
        });
    }
}
