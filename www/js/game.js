var game = new Phaser.Game(460, 320, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('star', 'assets/star.png');
}

var layer;
var cursors;
var scoreText;
var score = 0;
var starIsMoving;
var star;

function create() {

    //MAP
    var mapInstance = map.init();

    //PHYSICS
    physics.init();

    //layer.debug = true;
    layer.resizeWorld();

    //SPRITES
    player.init();

    //COLLISIONS
    collisions.initialize(mapInstance);

    //SCORE
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //CAMERA
    game.camera.follow(player.sprite);
    scoreText.fixedToCamera = true;

    //CONTROl
    control.initMoveButton();

    cursors = game.input.keyboard.createCursorKeys();

    //Adds a star
    //stars = game.add.group();

    var starIsMoving = false;

}

function update() {

    physics.update();

    player.sprite.body.velocity.x = 0;

    
    

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) == true)
    {
        /*if (starIsMoving)
        {
            star.kill();
        }*/

        if (!starIsMoving)
        { 
            //star = stars.create(player.x+20, player.y+20, 'star');
            star = game.add.sprite(player.sprite.x+20, player.sprite.y+20, 'star');
            game.physics.enable(star);
            star.body.velocity.x = 0;
        }
                 

        starIsMoving = true;
        //star.body.bounce.x = 0.7 + Math.random() * 0.2;
        //star.body.gravity.y = 50;

    }

    if (starIsMoving)
    {
        star.x+=0.5;
    }


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
    }
    else if (cursors.right.isDown  || control.moveButton == 'right')
    {
        player.sprite.body.velocity.x = 150;
        player.sprite.animations.play('right');
    }
    else
    {
        player.sprite.animations.stop();
    }

    player.statusBarPosition();

    if (socket.io) sync(player);
}

function render() {

    // game.debug.body(player);
    //
    //game.debug.bodyInfo(player, 32, 320);

}

function sync(player) {

    // Retrieves current player position
    var x_int = parseInt(player.x, 10);
    var y_int = parseInt(player.y, 10);

    // Compare current to last player position
    if ((player.x_int != x_int || player.y_int != y_int))
    {
        // If it differs, notify server
        socket.io.emit('client_moved', {x: player.x, y: player.y});
    }

    // Updates last player position
    player.x_int = x_int;
    player.y_int = y_int;
}
