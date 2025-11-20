class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        const config = GameConfig.enemies[type];
        super(scene, x, y, type); // 'bully' or 'thug' texture

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.type = type;
        this.config = config;
        this.speed = config.speed;
        this.health = config.health;
        this.damage = config.damage;

        this.setCollideWorldBounds(true);
        this.setBodySize(32, 32);

        // AI State
        this.state = 'IDLE'; // IDLE, CHASE, ATTACK
        this.target = scene.player;
        this.lastAttackTime = 0;
        this.attackCooldown = 1000;
    }

    update() {
        if (this.health <= 0) return;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

        switch (this.state) {
            case 'IDLE':
                if (dist < this.config.detectRange) {
                    this.state = 'CHASE';
                }
                this.setVelocity(0, 0);
                break;

            case 'CHASE':
                if (dist < this.config.attackRange) {
                    this.state = 'ATTACK';
                } else if (dist > this.config.detectRange * 1.5) {
                    this.state = 'IDLE';
                } else {
                    this.scene.physics.moveToObject(this, this.target, this.speed);
                    this.rotateToTarget();
                }
                break;

            case 'ATTACK':
                if (dist > this.config.attackRange) {
                    this.state = 'CHASE';
                } else {
                    this.setVelocity(0, 0);
                    this.rotateToTarget();
                    this.tryAttack();
                }
                break;
        }
    }

    rotateToTarget() {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.setRotation(angle + Math.PI / 2);
    }

    tryAttack() {
        const now = this.scene.time.now;
        if (now - this.lastAttackTime > this.attackCooldown) {
            this.lastAttackTime = now;

            // Attack visual
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 100,
                yoyo: true
            });

            // Deal damage
            if (this.target.health > 0) {
                this.target.takeDamage(this.damage);
            }
        }
    }

    takeDamage(amount, knockbackDir) {
        this.health -= amount;
        this.setTint(0xffffff);

        // Knockback
        if (knockbackDir) {
            this.setVelocity(knockbackDir.x * GameConfig.combat.knockbackForce, knockbackDir.y * GameConfig.combat.knockbackForce);
        }

        this.scene.time.delayedCall(100, () => {
            this.clearTint();
            if (this.health <= 0) {
                this.die();
            }
        });
    }

    die() {
        this.disableBody(true, true); // Hide and disable physics

        // Add score
        if (this.scene.uiManager) {
            this.scene.uiManager.addScore(this.config.scoreValue);
        }

        // Notify manager to respawn
        if (this.scene.enemyManager) {
            this.scene.enemyManager.onEnemyDeath(this);
        }

        this.destroy();
    }
}
