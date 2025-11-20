class WorldGenerator {
    constructor(scene) {
        this.scene = scene;
        this.width = GameConfig.worldWidth;
        this.height = GameConfig.worldHeight;

        this.streets = scene.physics.add.staticGroup();
        this.obstacles = scene.physics.add.staticGroup(); // Trees, benches
        this.animals = scene.add.group({ runChildUpdate: true });
    }

    generate() {
        this.createStreets();
        this.createParks();
        this.spawnAnimals();
    }

    createStreets() {
        // Create a simple grid of streets
        const blockSize = 400;
        const streetWidth = 100;

        // Horizontal streets
        for (let y = blockSize; y < this.height; y += blockSize) {
            for (let x = 0; x < this.width; x += streetWidth) {
                this.scene.add.image(x + streetWidth / 2, y, 'street').setRotation(Math.PI / 2);
            }
        }

        // Vertical streets
        for (let x = blockSize; x < this.width; x += blockSize) {
            for (let y = 0; y < this.height; y += streetWidth) {
                this.scene.add.image(x, y + streetWidth / 2, 'street');
            }
        }
    }

    createParks() {
        // Fill non-street areas with props
        const blockSize = 400;

        for (let y = 0; y < this.height; y += 50) {
            for (let x = 0; x < this.width; x += 50) {
                // Check if near street (simple distance check to grid lines)
                const distToVStreet = Math.abs(x % blockSize - blockSize);
                const distToHStreet = Math.abs(y % blockSize - blockSize);
                const distToVStreet2 = x % blockSize;
                const distToHStreet2 = y % blockSize;

                const minStreetDist = Math.min(distToVStreet, distToHStreet, distToVStreet2, distToHStreet2);

                // Don't place on streets (street width is ~100, so 50 radius)
                if (minStreetDist > 60) {
                    // Random placement
                    if (Math.random() < 0.02) {
                        const tree = this.obstacles.create(x, y, 'tree');
                        tree.setCircle(20, 12, 12); // Circular hitbox for tree trunk
                        tree.refreshBody();
                    } else if (Math.random() < 0.01) {
                        this.obstacles.create(x, y, 'bench').refreshBody();
                    }
                }
            }
        }
    }

    spawnAnimals() {
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(100, this.width - 100);
            const y = Phaser.Math.Between(100, this.height - 100);

            const dog = this.scene.physics.add.sprite(x, y, 'dog');
            dog.setCollideWorldBounds(true);
            this.animals.add(dog);

            // Simple wander behavior
            this.scene.time.addEvent({
                delay: 2000,
                loop: true,
                callback: () => {
                    if (dog.active) {
                        const dirX = Phaser.Math.Between(-1, 1);
                        const dirY = Phaser.Math.Between(-1, 1);
                        dog.setVelocity(dirX * 50, dirY * 50);

                        if (dirX !== 0) dog.setFlipX(dirX < 0);
                    }
                }
            });
        }
    }
}
