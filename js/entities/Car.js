class Car extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y, 'car');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.direction = direction; // 'left' or 'right'
        this.speed = 300;
        this.damage = 100; // Instant kill for most

        // Setup physics
        this.setImmovable(true);
        this.body.allowGravity = false;

        // Set velocity and orientation based on direction
        if (direction === 'right') {
            this.setVelocityX(this.speed);
            this.setFlipX(false); // Facing right by default
        } else {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        }
    }

    update() {
        // Despawn if out of bounds
        if (this.x < -100 || this.x > GameConfig.worldWidth + 100) {
            this.destroy();
        }
    }
}
