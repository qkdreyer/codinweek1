var game = new Phaser.Game(460, 320, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('player', 'assets/dude.png', 32, 48);
    game.load.image('missile', 'assets/games/invaders/enemy-bullet.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32); 
    game.load.image('statusBarFrame', 'assets/players/statusbarframe.png');
    game.load.image('statusBar', 'assets/players/statusbar.png');
    game.load.spritesheet('dragon', 'assets/dragon.png', 96, 64); 
}

var layer;
var cursors;
var scoreText;
var score = 0;
var player;
var players = {};
var ennemies = {};

function create() {

    //MAP
    var mapInstance = map.init();

    //PHYSICS
    physics.init(mapInstance);

    layer.resizeWorld();

    //SPRITES
    player = new Player();
    player.init();

    //COLLISIONS

    //SCORE
    scoreText = game.add.text(16, 46, 'score: 0', { fontSize: '32px', fill: '#000' });

    //CAMERA
    game.camera.follow(player.sprite);
    scoreText.fixedToCamera = true;

    //CONTROl
    control.initMoveButton();

    cursors = game.input.keyboard.createCursorKeys();
	 
    //ENNEMIS
    var ennemy = new Ennemy();
    ennemy.init('baddie', 400, 170, 'left');
    ennemies['baddie1'] = ennemy;
    
    ennemy = new Ennemy();
    ennemy.init('dragon', 800, 50, 'left');
    ennemies['dragon1'] = ennemy;
   
   
    // Start Client Connection to Server
    var socketResult = socket.init();
    if (socketResult == false) players[1] = player;
}

function update() {

    
    physics.update();


    if (cursors.up.isDown || control.moveButton == 'up')
    {
        if (player.sprite.body.onFloor())
        {
            player.sprite.body.velocity.y = -200;
        }
    }

    if (cursors.left.isDown  || control.moveButton == 'left')
    {
        player.sprite.body.velocity.x = -150;
        player.sprite.animations.play('left');
        player.direction = 'left';
    }
    else if (cursors.right.isDown  || control.moveButton == 'right')
    {
        player.sprite.body.velocity.x = 150;
        player.sprite.animations.play('right');
        player.direction = 'right';
    }
    else
    {
        player.sprite.animations.stop();
    }

    player.update();

    for (var ennemyId in ennemies)
	{ 
		ennemies[ennemyId].update();
	}

    if (socket.io && player.doSync())
    {
        socket.sync(player);
    } 
    
}

function render() {

    // game.debug.body(player);
    //
    //game.debug.bodyInfo(player, 32, 320);

}

