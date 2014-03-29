var game = new Phaser.Game(460, 320, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32); 
    game.load.image('statusBarFrame', 'assets/players/statusbarframe.png');
    game.load.image('statusBar', 'assets/players/statusbar.png');
}

var layer;
var cursors;
var scoreText;
var score = 0;
var player;
var players = {};

function create() {

    //MAP
    var mapInstance = map.init();

    //PHYSICS
    physics.init(mapInstance);

    //layer.debug = true;
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
    ennemy.init();
   
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


    if (socket.io) socket.sync(player.sprite);
     
    if (ennemy.sprite.x > 410)
    {
    	ennemy.sprite.body.velocity.x = -85;
    }
    if (ennemy.sprite.x < 10)
    {
    	ennemy.sprite.body.velocity.x = 85;
    }
}

function render() {

    // game.debug.body(player);
    //
    //game.debug.bodyInfo(player, 32, 320);

}

