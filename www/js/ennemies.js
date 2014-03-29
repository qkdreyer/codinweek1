

function Ennemy()     
{
	this.sprite = null;
    this.stats = {
        hp: 0,
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

//Liste des types d'ennemis existants, avec leurs propriétés 
//(définissant les images utilisés dans le sprite, la vitesse de déplacement, la vitesse de changement d'image, les hp,
//s'il est capable de tirer, et s'il vole)

var ennemyTypes = {
	'baddie':{velocity:100, leftImages:[0,1], imageSpeed:5, rightImages:[2,3], hp:20, shooter:0, flyer:0 }
};

//création d'ennemi avec paramètres: 
//- type d'ennemi 
//(définissant les images utilisés dans le sprite, la vitesse de déplacement, la vitesse de changement d'image, les hp,
//s'il est capable de tirer, et s'il vole)
Ennemy.prototype.init = function(ennemyType, x, y, direction) 
{
    	 
	
    this.sprite = game.add.sprite(x, y, ennemyType);
    
	
    //  Our two animations, walking left and right.
    this.sprite.animations.add('left', ennemyTypes[ennemyType].leftImages, ennemyTypes[ennemyType].imageSpeed, true);
    this.sprite.animations.add('right', ennemyTypes[ennemyType].rightImages, ennemyTypes[ennemyType].imageSpeed, true);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE); 
    
    //Don't leave the world zone when collides
    this.sprite.body.collideWorldBounds = true;

    this.stats.hp = 20;
    this.stats.maxHp = this.stats.hp;

    this.statusBar.sprite = game.add.sprite(x, x-40, 'statusBar');
    var statusBarFrame = game.add.sprite(x, x-40, 'statusBarFrame');
    this.statusBar.maxWidth = 0.95*statusBarFrame.width;
    this.statusBar.sprite.width = this.statusBar.maxWidth;

	if (ennemyTypes[ennemyType].shooter = 1)
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
    
Ennemy.prototype.lostHp = function(qtyHp) {
    this.stats.hp -= qtyHp;
    if (this.stats.hp <= 0) 
    {
    	this.die();
    }
    //else  this.statusBar.sprite.width = this.statusBar.maxWidth * (this.stats.hp / this.stats.maxHp);
};


Ennemy.prototype.die = function() {
    this.stats.hp = 0;
    //this.statusBar.sprite.width = 0;
	this.sprite.kill();
};

