var game = new Phaser.Game(460, 320, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('star', 'assets/star.png');
}

var map;
var tileset;
var layer;
var cursors;
var scoreText;
var score = 0;
var starIsMoving;
var star;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';
    map = game.add.tilemap('mario');
    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    layer = map.createLayer('World1');

    //layer.debug = true;

    layer.resizeWorld();

    //SPRITES
    player.init();

    //PHYSICS
    //game.physics.enable(player);
    game.physics.enable(player.sprite);
    game.physics.arcade.gravity.y = 250;

    //COLLISIONS
    collisions.initialize(map);

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
    game.physics.arcade.collide(star, layer);
    game.physics.arcade.collide(player.sprite, layer);

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
}

function render() {

    // game.debug.body(player);
    //
    //game.debug.bodyInfo(player, 32, 320);

}
