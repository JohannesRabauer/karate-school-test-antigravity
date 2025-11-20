class VirtualJoystick {
    constructor(scene, x, y) {
        this.scene = scene;
        this.baseX = x;
        this.baseY = y;
        this.radius = 50;

        this.active = false;
        this.force = { x: 0, y: 0 };

        // UI Elements
        this.base = scene.add.circle(x, y, this.radius, 0x888888, 0.5).setScrollFactor(0).setInteractive();
        this.thumb = scene.add.circle(x, y, 25, 0xcccccc, 0.8).setScrollFactor(0);

        this.scene.input.on('pointerdown', this.onTouchStart, this);
        this.scene.input.on('pointermove', this.onTouchMove, this);
        this.scene.input.on('pointerup', this.onTouchEnd, this);
    }

    onTouchStart(pointer) {
        // Check if touch is on left side of screen (area for joystick)
        if (pointer.x < this.scene.cameras.main.width / 2) {
            this.active = true;
            this.base.setPosition(pointer.x, pointer.y);
            this.thumb.setPosition(pointer.x, pointer.y);
            this.baseX = pointer.x;
            this.baseY = pointer.y;
            this.base.setVisible(true);
            this.thumb.setVisible(true);
        }
    }

    onTouchMove(pointer) {
        if (!this.active) return;

        const dx = pointer.x - this.baseX;
        const dy = pointer.y - this.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = this.radius;

        if (dist < maxDist) {
            this.thumb.setPosition(pointer.x, pointer.y);
            this.force.x = dx / maxDist;
            this.force.y = dy / maxDist;
        } else {
            const ratio = maxDist / dist;
            this.thumb.setPosition(this.baseX + dx * ratio, this.baseY + dy * ratio);
            this.force.x = (dx * ratio) / maxDist;
            this.force.y = (dy * ratio) / maxDist;
        }
    }

    onTouchEnd(pointer) {
        if (this.active) {
            this.active = false;
            this.force = { x: 0, y: 0 };
            this.base.setVisible(true); // Keep visible or hide? Let's keep visible at default pos
            this.thumb.setPosition(this.base.x, this.base.y);

            // Reset to default position if desired, or keep where last touched
            this.base.setPosition(100, this.scene.cameras.main.height - 100);
            this.thumb.setPosition(100, this.scene.cameras.main.height - 100);
        }
    }
}
