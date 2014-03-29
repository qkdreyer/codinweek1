/**
 * Created with JetBrains PhpStorm.
 * User: Soahar
 * Date: 29/03/14
 * Time: 14:43
 * To change this template use File | Settings | File Templates.
 */

var player =
{
    sprite: null,
    stats: {
        hp: 0,
        maxHp: 0
    },
    statusBar: {
        sprite: null,
        maxWidth: 0
    },
    missile: null,
    direction: null,
    velocity: 300,

    init: function(){ 
        this.sprite = game.add.sprite(32, 32, 'dude');

        //  Our two animations, walking left and right.
        this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

        game.physics.enable(this.sprite);

        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.linearDamping = 1;
        //Don't leave the world zone when collides
        this.sprite.body.collideWorldBounds = true;

        this.stats.hp = 100;
        this.stats.maxHp = this.stats.hp;

        this.statusBar.sprite = game.add.sprite(10, 10, 'statusBar');
        var statusBarFrame = game.add.sprite(10, 10, 'statusBarFrame');
        this.statusBar.maxWidth = 0.95*statusBarFrame.width;
        this.statusBar.sprite.width = this.statusBar.maxWidth;

        this.missile = missile.init(this);

        statusBarFrame.fixedToCamera = true;
        this.statusBar.sprite.fixedToCamera = true;
        //this.statusBar = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { fontSize: '32px', fill: '#000' });
    },

    add: function(coordinates) {
        var x = coordinates.x;
        var y = coordinates.y;

        console.log('Adding Player', x , y);

        return game.add.sprite(x, y, 'dude');
    },

    lostHp: function(qtyHp){
        this.stats.hp -= qtyHp;
        if (this.stats.hp <= 0) this.die();
        else {
            console.log(this.stats.hp);
            this.statusBar.sprite.width = this.statusBar.maxWidth * (this.stats.hp / this.stats.maxHp);
        }
    },

    isDead: function(){
        return (this.stats.hp == 0);
    },

    die: function(){
        this.stats.hp = 0;
        this.statusBar.sprite.width = 0;

        endText = game.add.text(100, 100, 'U DIE BITCH', { fontSize: '32px', fill: '#000' });
        endText.fixedToCamera = true;
        console.log('U DIE BITCH');
    },

    statusBarPosition: function(){
        this.statusBar.x = this.sprite.x;
        this.statusBar.y = this.sprite.y;
        this.statusBar.text = this.stats.hp;
    },

    update: function()
    {
        if (player.isDead())
        {
            player.sprite.body.velocity.x = 0;
            return;
        }

        game.physics.arcade.collide(this.missile.sprite, layer);
        game.physics.arcade.collide(this.sprite, this.missile.sprite, function(){
            player.lostHp(100);
        });


        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) == true)
        {
            this.startAttack();
        }

        if (this.isMissileActive)
        {
            this.attackMissileHandling();
        }
    },

    //Lance un missile
    startAttack: function ()
    {

        //On ne peut lancer un nouveau missile que si aucun autre n'est en cours de déplacement
        if (!this.isMissileActive)
        { 
            var missileVelocity;
            var missileStartX;
            var missileStartY;

            if (this.direction == 'left')
            {
                missileVelocity = this.velocity*-1;
                missileStartX = this.sprite.x;
                missileStartY = this.sprite.y;
            }
            else if (this.direction == 'right')
            {
                missileVelocity = this.velocity;
                missileStartX = this.sprite.x+20;
                missileStartY = this.sprite.y+20;
            }
            
            this.missileSprite = game.add.sprite(missileStartX, missileStartY, 'star');
            game.physics.enable(this.missileSprite);
            this.missileSprite.body.bounce.y = 0.7;
            this.missileSprite.body.bounce.x = 0.6;
            this.missileSprite.body.velocity.x = missileVelocity;
            this.missileSprite.body.gravity.y = 100;

            this.isMissileActive = true;
        }
                 

        
    },

    //Gère la vitesse du missile
    attackMissileHandling: function()
    {
        if (this.missileSprite.body.velocity.x > 0)
        {
            this.missileSprite.body.velocity.x = parseInt(--this.missileSprite.body.velocity.x, 10);
        }
        else if (this.missileSprite.body.velocity.x < 0)
        {
            this.missileSprite.body.velocity.x = parseInt(++this.missileSprite.body.velocity.x, 10);
        }

        if (this.missileSprite.body.velocity.x === 0 || !map.contains(this.missileSprite.body))
        {
            //Fin du déplacement : l'étoile disparait et on peut à nouveau en lancer une
            this.missileSprite.kill();
            this.isMissileActive = false;
            //console.log("FIN DEPLACEMENT" , this.missileSprite.body.velocity.x, !map.contains(this.missileSprite.body), "coords :", this.missileSprite.body.x, " ", this.missileSprite.body.y);
        }

        missile.update();
    },



}