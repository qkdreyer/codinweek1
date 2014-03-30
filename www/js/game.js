var game = new Phaser.Game(460, 320, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create, update: update,
    render: render
});

var layer;
var scoreText;
var score = 0;
var player;
var players = {};
var ennemies = {};

function preload()
{
    game.load.tilemap('mario', 'assets/tilemaps/maps/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.image('star', 'assets/star.png');

    // Player
    game.load.spritesheet('player', 'assets/dude.png', 32, 48);
    game.load.image('statusBarFrame', 'assets/players/statusbarframe.png');
    game.load.image('statusBar', 'assets/players/statusbar.png');
    game.load.image('missile', 'assets/games/invaders/enemy-bullet.png');

    // Monsters
    game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    game.load.spritesheet('dragon', 'assets/dragon.png', 96, 64);
    game.load.spritesheet('shroom', 'assets/shroom.png', 38, 38);

    //Life Bar
    game.load.image('lifeBarFrame', 'assets/lifeBarFrame.png');
    game.load.image('lifeBar', 'assets/lifeBar.png');
}

function create()
{
    //MAP
    var mapInstance = map.init();

    //PHYSICS
    physics.init(mapInstance);

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

    
	 
    //ENNEMIS
    /*var ennemy = new Ennemy();
    ennemy.init('baddie', 400, 170, 'left');
    ennemies['baddie1'] = ennemy;
    
    ennemy = new Ennemy();
    ennemy.init('dragon', 800, 50, 'left');
    ennemies['dragon1'] = ennemy;*/
   
   
    // Start Client Connection to Server
    var socketResult = socket.init();
    if (socketResult == false) players[1] = player;
}

function update()
{    
    physics.update();
    player.update();

    for (var ennemyId in ennemies) {
		ennemies[ennemyId].update();
	}

    if (socket.io && player.doSync())
    {
        socket.sync(player);
    }    
}

function render()
{
    // game.debug.body(player);
    //
    //game.debug.bodyInfo(player, 32, 320);
}
