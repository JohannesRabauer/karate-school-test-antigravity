const GameConfig = {
    // Display settings
    width: 800,
    height: 600,
    backgroundColor: '#333333',
    
    // World settings
    worldWidth: 2000,
    worldHeight: 2000,
    
    // Player stats
    player: {
        speed: 200,
        maxHealth: 100,
        width: 32,
        height: 48,
        color: 0x3498db, // Blue
        startX: 1000,
        startY: 1000
    },
    
    // Combat settings
    combat: {
        punchDamage: 10,
        kickDamage: 25,
        punchCooldown: 400, // ms
        kickCooldown: 800, // ms
        hitboxSize: 40,
        knockbackForce: 300,
        comboWindow: 1000 // ms to chain attacks
    },
    
    // Enemy types
    enemies: {
        bully: {
            name: 'Bully',
            speed: 120,
            health: 30,
            damage: 5,
            color: 0xe74c3c, // Red
            width: 32,
            height: 48,
            scoreValue: 100,
            attackRange: 50,
            detectRange: 300
        },
        thug: {
            name: 'Thug',
            speed: 100,
            health: 60,
            damage: 15,
            color: 0x9b59b6, // Purple
            width: 40,
            height: 52,
            scoreValue: 250,
            attackRange: 60,
            detectRange: 400
        }
    },
    
    // UI settings
    ui: {
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        fontSize: '20px',
        textColor: '#ffffff'
    }
};
