
var ennemy =
{

    sprite: null,
    stats: {
        hp: 0
    },
    statusBar: null,

    init: function(){
        this.sprite = game.add.sprite(400, 170, 'baddie'); 
        //  Our two animations, walking left and right.
        this.sprite.animations.add('left', [0, 1], 5,true);
        this.sprite.animations.add('right', [2, 3], 5, true);
 
       //game.physics.enable(this.sprite);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE); 
 
        //Don't leave the world zone when collides
        this.sprite.body.collideWorldBounds = true;
        
		this.sprite.body.velocity.x=-100;
        ennemy.sprite.animations.play('left');
		

    //  Here we add a new animation called 'run'
    //  We haven't specified any frames because it's using every frame in the texture atlas
    //this.sprite.animations.add('run');

    //  And this starts the animation playing by using its key ("run")
    //  15 is the frame rate (15fps)
    //  true means it will loop when it finishes
    //this.sprite.animations.play('run', 5, true);
/*
        this.stats.hp = 100;
        this.statusBar = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { fontSize: '32px', fill: '#000' });
  */  }
 /*
    ,

    lostHp: function(qtyHp){
        this.stats.hp -= qtyHp;
    },

    statusBarPosition: function(){
        this.statusBar.x = this.sprite.x;
        this.statusBar.y = this.sprite.y;
        this.statusBar.text = this.stats.hp;
    }
 */
}

/*
var ennemies =
{
    
    init: function() {
    	
		console.log('testmanu');
		createEnnemy();
    }
};

function createEnnemy()
{
	
	
    //  This sprite is using a texture atlas for all of its animation data
    bot = game.add.sprite(750, 500, 'bot');
    
    //console.log(game.physics);
    
    game.physics.enable(bot, Phaser.Physics.ARCADE);
    //game.physics.enable(bot, Phaser.Physics.ARCADE);
	
	//bot.body.velocity.x=-85;

    //  Here we add a new animation called 'run'
    //  We haven't specified any frames because it's using every frame in the texture atlas
    //bot.animations.add('run');

    //  And this starts the animation playing by using its key ("run")
    //  15 is the frame rate (15fps)
    //  true means it will loop when it finishes
    //bot.animations.play('run', 5, true);

}
*/
