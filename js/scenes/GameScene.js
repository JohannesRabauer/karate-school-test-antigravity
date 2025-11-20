class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // World Setup
        this.physics.world.setBounds(0, 0, GameConfig.worldWidth, GameConfig.worldHeight);

        // Create simple ground
        this.add.tileSprite(0, 0, GameConfig.worldWidth, GameConfig.worldHeight, 'ground').setOrigin(0, 0);

        // World Generation
        this.worldGen = new WorldGenerator(this);
        this.worldGen.generate();

        // Systems
        this.combatSystem = new CombatSystem(this);
        this.uiManager = new UIManager(this);

        // Player
        this.player = new Player(this, GameConfig.player.startX, GameConfig.player.startY);

        // Enemies
        this.enemyManager = new EnemyManager(this);

        // Camera
        this.cameras.main.setBounds(0, 0, GameConfig.worldWidth, GameConfig.worldHeight);
        this.cameras.main.startFollow(this.player);

        // Input
        this.inputManager = new InputManager(this);

        // Collisions
        this.physics.add.collider(this.player, this.enemyManager.enemies);
        this.physics.add.collider(this.enemyManager.enemies, this.enemyManager.enemies);
        this.physics.add.collider(this.player, this.worldGen.obstacles);
        this.physics.add.collider(this.enemyManager.enemies, this.worldGen.obstacles);

        // Audio
        this.sound.play('music', { loop: true, volume: 0.3 });
    }

    update(time, delta) {
        if (this.player.health <= 0) return;

        // Update Player
        const input = this.inputManager.getMovement();
        const punch = this.inputManager.isPunchPressed();
        const kick = this.inputManager.isKickPressed();

        this.player.update(input, punch, kick);

        // Update UI
        this.uiManager.updateHealth(this.player.health, this.player.maxHealth);

        // Reset input frame
        this.inputManager.resetFrame();
    }
}
