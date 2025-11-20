class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Generate placeholder textures
        this.generateTextures();
    }

    create() {
        this.scene.start('MenuScene');
    }

    generateTextures() {
        // Player Texture (Blue Rect)
        // const playerGraphics = this.make.graphics().fillStyle(GameConfig.player.color).fillRect(0, 0, 32, 48);
        // playerGraphics.generateTexture('player', 32, 48);
        this.generatePlayerSprites();

        // Bully Texture (Red Rect)
        const bullyGraphics = this.make.graphics().fillStyle(GameConfig.enemies.bully.color).fillRect(0, 0, 32, 48);
        bullyGraphics.generateTexture('bully', 32, 48);

        // Thug Texture (Purple Rect)
        const thugGraphics = this.make.graphics().fillStyle(GameConfig.enemies.thug.color).fillRect(0, 0, 40, 52);
        thugGraphics.generateTexture('thug', 40, 52);

        // Ground Tile (Concrete)
        const groundGraphics = this.make.graphics().fillStyle(0x7f8c8d).fillRect(0, 0, 64, 64);
        groundGraphics.generateTexture('ground', 64, 64);

        // Wall Texture (Brick)
        const wallGraphics = this.make.graphics().fillStyle(0xc0392b).fillRect(0, 0, 64, 64);
        wallGraphics.generateTexture('wall', 64, 64);

        // Punch Effect (White Flash)
        const punchGraphics = this.make.graphics().fillStyle(0xffffff).fillCircle(10, 10, 10);
        punchGraphics.generateTexture('punch_effect', 20, 20);

        // -- Environment Textures --

        // Tree (Green Circle with darker outline)
        const treeGraphics = this.make.graphics();
        treeGraphics.fillStyle(0x2ecc71); // Bright green
        treeGraphics.fillCircle(32, 32, 30);
        treeGraphics.lineStyle(4, 0x27ae60);
        treeGraphics.strokeCircle(32, 32, 30);
        treeGraphics.generateTexture('tree', 64, 64);

        // Street (Dark Asphalt)
        const streetGraphics = this.make.graphics();
        streetGraphics.fillStyle(0x34495e); // Dark Blue-Grey
        streetGraphics.fillRect(0, 0, 100, 100);
        // Add lane markings
        streetGraphics.fillStyle(0xf1c40f); // Yellow
        streetGraphics.fillRect(45, 10, 10, 80);
        streetGraphics.generateTexture('street', 100, 100);

        // Bench (Brown Wood)
        const benchGraphics = this.make.graphics();
        benchGraphics.fillStyle(0xd35400); // Burnt Orange/Brown
        benchGraphics.fillRect(0, 0, 60, 20);
        benchGraphics.lineStyle(2, 0xa04000);
        benchGraphics.strokeRect(0, 0, 60, 20);
        benchGraphics.generateTexture('bench', 60, 20);

        // Animal (Small Dog - Beige)
        const dogGraphics = this.make.graphics();
        dogGraphics.fillStyle(0xe67e22); // Orange/Brown
        dogGraphics.fillRect(0, 0, 20, 14);
        // Head
        dogGraphics.fillStyle(0xd35400);
        dogGraphics.fillRect(16, -4, 10, 10);
        dogGraphics.generateTexture('dog', 30, 20);

        // -- Audio Generation --
        const soundGen = new SoundGenerator(this);
        soundGen.init();
    }

    generatePlayerSprites() {
        const colors = {
            skin: 0xffccaa,
            gi: 0xffffff,
            belt: 0x000000,
            hair: 0x5d4037
        };

        // Helper to draw a frame
        const drawFrame = (key, pose) => {
            const g = this.make.graphics();

            // Body dimensions
            const w = 32;
            const h = 48;

            // Head
            g.fillStyle(colors.skin);
            g.fillCircle(w / 2, 10, 8);

            // Hair
            g.fillStyle(colors.hair);
            g.fillCircle(w / 2, 8, 8); // Top

            // Torso (Gi)
            g.fillStyle(colors.gi);
            g.fillRect(w / 2 - 10, 18, 20, 20);

            // Belt
            g.fillStyle(colors.belt);
            g.fillRect(w / 2 - 10, 30, 20, 4);

            // Limbs based on pose
            g.fillStyle(colors.gi); // Pants/Sleeves

            if (pose === 'idle') {
                // Arms down
                g.fillRect(4, 20, 6, 15); // Left Arm
                g.fillRect(22, 20, 6, 15); // Right Arm
                // Legs straight
                g.fillRect(8, 38, 6, 10); // Left Leg
                g.fillRect(18, 38, 6, 10); // Right Leg
            } else if (pose === 'walk1') {
                // Arms swinging
                g.fillRect(4, 18, 6, 15);
                g.fillRect(22, 22, 6, 15);
                // Legs moving
                g.fillRect(8, 36, 6, 12);
                g.fillRect(18, 40, 6, 8);
            } else if (pose === 'walk2') {
                // Arms swinging opposite
                g.fillRect(4, 22, 6, 15);
                g.fillRect(22, 18, 6, 15);
                // Legs moving opposite
                g.fillRect(8, 40, 6, 8);
                g.fillRect(18, 36, 6, 12);
            } else if (pose === 'punch') {
                // Right arm extended
                g.fillRect(4, 20, 6, 15); // Left Arm down
                g.fillRect(22, 15, 12, 6); // Right Arm punch
                g.fillStyle(colors.skin);
                g.fillCircle(36, 18, 4); // Fist
                // Legs wide
                g.fillStyle(colors.gi);
                g.fillRect(6, 38, 6, 10);
                g.fillRect(20, 38, 6, 10);
            } else if (pose === 'kick') {
                // Arms guard
                g.fillRect(4, 18, 6, 12);
                g.fillRect(22, 18, 6, 12);
                // Right leg kick
                g.fillRect(8, 38, 6, 10); // Left Leg plant
                g.fillRect(20, 30, 14, 6); // Right Leg kick
                g.fillStyle(colors.skin);
                g.fillCircle(36, 33, 4); // Foot
            }

            g.generateTexture(key, 48, 48); // Slightly wider for attacks
        };

        drawFrame('player_idle', 'idle');
        drawFrame('player_walk1', 'walk1');
        drawFrame('player_walk2', 'walk2');
        drawFrame('player_punch', 'punch');
        drawFrame('player_kick', 'kick');
    }
}
