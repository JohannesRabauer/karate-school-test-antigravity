class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            punch: Phaser.Input.Keyboard.KeyCodes.J,
            kick: Phaser.Input.Keyboard.KeyCodes.K,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.virtualJoystick = null;
        this.actionButtons = {};

        // Check if mobile
        this.isMobile = !scene.sys.game.device.os.desktop;

        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    setupMobileControls() {
        this.virtualJoystick = new VirtualJoystick(this.scene, 100, this.scene.cameras.main.height - 100);

        // Action buttons
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        this.createActionButton(width - 120, height - 80, 'PUNCH', 0xe74c3c, 'punch');
        this.createActionButton(width - 50, height - 120, 'KICK', 0x3498db, 'kick');
    }

    createActionButton(x, y, label, color, action) {
        const radius = 35;
        const btn = this.scene.add.circle(x, y, radius, color).setScrollFactor(0).setInteractive();
        const text = this.scene.add.text(x, y, label, { fontSize: '12px', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);

        btn.on('pointerdown', () => {
            this.actionButtons[action] = true;
            btn.setAlpha(0.7);
        });

        btn.on('pointerup', () => {
            this.actionButtons[action] = false;
            btn.setAlpha(1);
        });

        btn.on('pointerout', () => {
            this.actionButtons[action] = false;
            btn.setAlpha(1);
        });
    }

    getMovement() {
        const move = { x: 0, y: 0 };

        // Keyboard
        if (this.cursors.left.isDown || this.wasd.left.isDown) move.x = -1;
        else if (this.cursors.right.isDown || this.wasd.right.isDown) move.x = 1;

        if (this.cursors.up.isDown || this.wasd.up.isDown) move.y = -1;
        else if (this.cursors.down.isDown || this.wasd.down.isDown) move.y = 1;

        // Virtual Joystick override
        if (this.virtualJoystick && this.virtualJoystick.active) {
            move.x = this.virtualJoystick.force.x;
            move.y = this.virtualJoystick.force.y;
        }

        // Normalize vector
        if (move.x !== 0 || move.y !== 0) {
            const length = Math.sqrt(move.x * move.x + move.y * move.y);
            if (length > 1) { // Only normalize if length > 1 (for keyboard diagonal) or joystick full tilt
                move.x /= length;
                move.y /= length;
            }
        }

        return move;
    }

    isPunchPressed() {
        return Phaser.Input.Keyboard.JustDown(this.wasd.punch) ||
            Phaser.Input.Keyboard.JustDown(this.wasd.space) ||
            this.actionButtons['punch']; // Note: for mobile we might want JustDown equivalent logic in update
    }

    isKickPressed() {
        return Phaser.Input.Keyboard.JustDown(this.wasd.kick) ||
            this.actionButtons['kick'];
    }

    // Reset mobile button states after frame (to simulate JustDown)
    resetFrame() {
        if (this.isMobile) {
            this.actionButtons['punch'] = false;
            this.actionButtons['kick'] = false;
        }
    }
}
