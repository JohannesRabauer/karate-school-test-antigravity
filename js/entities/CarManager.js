class CarManager {
    constructor(scene) {
        this.scene = scene;
        this.cars = scene.add.group({
            classType: Car,
            runChildUpdate: true
        });

        // Find street Y positions from WorldGenerator
        // Streets are 100px high. We want cars to drive in the middle or lanes.
        // Assuming simple grid for now, let's just pick some Y coords that look like streets
        // In WorldGenerator, streets are placed. We can scan for them or just use random Ys for now
        // Better: Use fixed lanes based on the grid size (100)

        this.spawnTimer = 0;
        this.spawnInterval = 2000; // Spawn every 2 seconds
    }

    update(time, delta) {
        this.spawnTimer += delta;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnCar();
        }
    }

    spawnCar() {
        // Pick a random Y that aligns with the grid (streets are 100px tall)
        // Grid starts at 0. Center of a street would be Y + 50.
        const gridY = Phaser.Math.Between(0, Math.floor(GameConfig.worldHeight / 100) - 1);
        const y = gridY * 100 + 50;

        // Random direction
        const direction = Math.random() < 0.5 ? 'left' : 'right';

        let x;
        if (direction === 'right') {
            x = -50; // Start off-screen left
        } else {
            x = GameConfig.worldWidth + 50; // Start off-screen right
        }

        // Create car
        // Only spawn if there isn't already a car too close (simple check)
        const car = new Car(this.scene, x, y, direction);
        this.cars.add(car);
    }
}
