class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBodySize(32, 32);
        this.setOffset(0, 16); // Hitbox at feet

        // Stats
        this.speed = GameConfig.player.speed;
        this.health = GameConfig.player.maxHealth;
        this.maxHealth = GameConfig.player.maxHealth;

        // State
        this.isAttacking = false;
        this.lastAttackTime = 0;
        this.facingDir = { x: 0, y: 1 }; // Default facing down
    }

    update(input, punchPressed, kickPressed) {
        if (this.health <= 0) return;

        // Handle Combat
        if (!this.isAttacking) {
            if (punchPressed && this.canAttack('punch')) {
                this.attack('punch');
            } else if (kickPressed && this.canAttack('kick')) {
                this.attack('kick');
            } else {
                this.handleMovement(input);
            }
        }
    }

    handleMovement(input) {
        if (input.x !== 0 || input.y !== 0) {
            this.setVelocity(input.x * this.speed, input.y * this.speed);
            this.facingDir = { x: input.x, y: input.y };

            // Rotate sprite based on movement (simple visual feedback)
            const angle = Math.atan2(input.y, input.x);
            this.setRotation(angle + Math.PI / 2); // Adjust for sprite orientation
        } else {
            this.setVelocity(0, 0);
        }
    }

    canAttack(type) {
        const now = this.scene.time.now;
        const cooldown = type === 'punch' ? GameConfig.combat.punchCooldown : GameConfig.combat.kickCooldown;
        return now - this.lastAttackTime > cooldown;
    }

    attack(type) {
        this.isAttacking = true;
        this.lastAttackTime = this.scene.time.now;
        this.setVelocity(0, 0);

        // Visual feedback
        const color = type === 'punch' ? 0xffff00 : 0xff0000;
        this.setTint(color);

        // Create hitbox
        const damage = type === 'punch' ? GameConfig.combat.punchDamage : GameConfig.combat.kickDamage;

        // Calculate hitbox position based on rotation
        const reach = 40;
        const hitboxX = this.x + Math.cos(this.rotation - Math.PI / 2) * reach;
        const hitboxY = this.y + Math.sin(this.rotation - Math.PI / 2) * reach;

        // Show attack effect
        const effect = this.scene.add.sprite(hitboxX, hitboxY, 'punch_effect');
        this.scene.tweens.add({
            targets: effect,
            alpha: 0,
            duration: 200,
            onComplete: () => effect.destroy()
        });

        // Notify combat system (to be implemented)
        if (this.scene.combatSystem) {
            this.scene.combatSystem.checkAttack(this, { x: hitboxX, y: hitboxY }, damage);
        }

        // Reset state after short delay
        this.scene.time.delayedCall(300, () => {
            this.isAttacking = false;
            this.clearTint();
        });
    }

    takeDamage(amount) {
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.cameras.main.shake(100, 0.01);

        this.scene.time.delayedCall(200, () => {
            this.clearTint();
            if (this.health <= 0) {
                this.die();
            }
        });
    }

    die() {
        this.setTint(0x555555);
        this.setVelocity(0, 0);
        // Game Over logic here
        console.log('Player Died');
    }
}
