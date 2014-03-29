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
var players = {};

function create() {

    //MAP
    var mapInstance = map.init();

    //PHYSICS
    physics.init(mapInstance);

    //layer.debug = true;
    layer.resizeWorld();

    //SPRITES
    player.init();

    //COLLISIONS

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

    starIsMoving = false;

    // Start Client Connection to Server
    socket.init();
}

function update() {

    physics.update();

    

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) == true)
    {
        if (!starIsMoving)
        { 
            //star = stars.create(player.x+20, player.y+20, 'star');
            star = game.add.sprite(player.sprite.x+20, player.sprite.y+20, 'star');
            game.physics.enable(star);
            //star.body.velocity.x = 1;
            star.body.bounce.y = 0.7;
            star.body.bounce.x = 0.6;
            star.body.velocity.x = 300;
            star.body.gravity.y = 100;
        }
                 

        starIsMoving = true;
        //star.body.bounce.x = 0.7 + Math.random() * 0.2;
        //star.body.gravity.y = 50;

    }

    //Réduction de la vitesse
    if (starIsMoving)
    {
        if (star.body.velocity.x > 0)
        {
            star.body.velocity.x = parseInt(--star.body.velocity.x, 10);
        }
        else if (star.body.velocity.x < 0)
        {
            star.body.velocity.x = parseInt(++star.body.velocity.x, 10);
        }
        else
        {
            star.kill();
            starIsMoving = false;
        }
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

    if (socket.io) socket.sync(player.sprite);
}

function render() {

    // game.debug.body(player);
    //
    //game.debug.bodyInfo(player, 32, 320);

}

