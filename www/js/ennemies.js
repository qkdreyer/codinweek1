

function Ennemy()     
{
	this.sprite = null;
    this.stats = {
        maxHp: 0,
        hp:0,
        power: 0
    };
    this.statusBar = {
        sprite: null,
        maxWidth: 0
    };
    this.missile = null;
    this.direction = null;
    this.attackTimer = false;
    this.velocity = 0;


}

Ennemy.handle_server_data = function(ennemies_data) {
    for (var e in ennemies_data) {
        var ennemy_data = ennemies_data[e];
        var ennemy_id = ennemy_data.id;
        
        if (!ennemies[ennemy_id]) {
            ennemies[ennemy_id] = new Ennemy();
        }
        ennemies[ennemy_id].render(ennemy_data);
    }
}

//Liste des types d'ennemis existants, avec leurs propriétés 
//(définissant les images utilisés dans le sprite, la vitesse de déplacement, la vitesse de changement d'image, les hp,
//s'il est capable de tirer, et s'il vole)

var ennemyTypes = {
	'baddie':{velocity:100, leftImages:[0,1], imageSpeed:5, rightImages:[2,3], hp:20, shooter:0, flyer:0 },
	'dragon':{velocity:130, leftImages:[7, 8, 9, 10, 11, 12], imageSpeed:10, rightImages:[1, 2, 3, 4, 5, 6], hp:80, shooter:1, flyer:1}
};

//création d'ennemi avec paramètres: 
//- type d'ennemi 
//(définissant les images utilisés dans le sprite, la vitesse de déplacement, la vitesse de changement d'image, les hp,
//s'il est capable de tirer, et s'il vole)
Ennemy.prototype.init = function(ennemyType, x, y, direction) 
{
    	 
    this.sprite = game.add.sprite(x, y, ennemyType);
    this.miniStatus = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { font: 'bold 10px Arial' });
	
    //  Our two animations, walking left and right.
    this.sprite.animations.add('left', ennemyTypes[ennemyType].leftImages, ennemyTypes[ennemyType].imageSpeed, true);
    this.sprite.animations.add('right', ennemyTypes[ennemyType].rightImages, ennemyTypes[ennemyType].imageSpeed, true);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE); 
    
    //Don't leave the world zone when collides
	if (ennemyTypes[ennemyType].flyer == 1)
	{    
    	this.sprite.body.allowGravity = false;
	}
	else
	{
	    this.sprite.body.collideWorldBounds = true;	
	}
    this.stats.hp = 20;
    this.stats.maxHp = this.stats.hp;

    this.statusBar.sprite = game.add.sprite(x, x-40, 'statusBar');
    var statusBarFrame = game.add.sprite(x, x-40, 'statusBarFrame');
    this.statusBar.maxWidth = 0.95*statusBarFrame.width;
    this.statusBar.sprite.width = this.statusBar.maxWidth;

	if (ennemyTypes[ennemyType].shooter == 1)
	{    
		this.missile = new Missile(this);
	}


    statusBarFrame.fixedToCamera = true;
    this.statusBar.sprite.fixedToCamera = true;
    this.direction = direction;
    this.sprite.animations.play(direction);
    
    if (direction = 'left')
    {
    	this.sprite.body.velocity.x = -ennemyTypes[ennemyType].velocity;
    }
    else
    {
    	this.sprite.body.velocity.x = ennemyTypes[ennemyType].velocity;    	
    }
};

Ennemy.prototype.setAttackTimer = function(){
    var self = this;
    if (!this.attackTimer) {
        this.attackTimer = true;
        setInterval(function(){
            self.attackTimer = false;
        },3000);
    }
};

Ennemy.prototype.lostHp = function()
{
    if (this.stats.hp <= 0) 
    {
    	this.die();
    }
    else
    {
        if (this.stats.hp <= this.stats.maxHp/2 && this.stats.hp > this.stats.maxHp/4)
        {
            this.miniStatus.setStyle({font: 'bold 13px Arial', fill: 'orange'});
            this.miniStatus.y-=5;
        }
        else if (this.stats.hp <= this.stats.maxHp/2)
        {
            this.miniStatus.setStyle({font: 'bold 15px Arial', fill: 'red'});
            this.miniStatus.y-=5;
        }
    }

};


Ennemy.prototype.die = function() 
{
    this.stats.hp = 0;
    this.miniStatus.text.kill();
    //this.statusBar.sprite.width = 0;
	this.sprite.kill();
};

Ennemy.prototype.miniStatusBarPosition = function() {
    this.miniStatus.x = this.sprite.x+10;
    this.miniStatus.y = this.sprite.y-15;
    this.miniStatus.text = this.stats.hp;
};

Ennemy.prototype.update = function()
{

    this.miniStatusBarPosition();

    if (this.sprite.x > 410)
    {
        this.sprite.body.velocity.x = -100;
        this.sprite.animations.play('left');
    }
 
    if (this.sprite.x < 10)
    {
        this.sprite.body.velocity.x = 100;
        this.sprite.animations.play('right');
    }

    if (this.hp <= 0) {
        this.kill();
    }
};

Ennemy.prototype.render = function(ennemy_data)
{
    if (!this.sprite) 
    {
        this.sprite = game.add.sprite(ennemy_data.x, ennemy_data.y, ennemy_data.key);
    } 
    else 
    {
        this.sprite.x = ennemy_data.x;
        this.sprite.y = ennemy_data.y;
    }
    this.stats.hp = ennemy_data.hp;
    this.lostHp();
    this.miniStatus = player_data.miniStatus;

};

