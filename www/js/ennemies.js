
//Liste des types d'ennemis existants, avec leurs propriétés 
//(définissant les images utilisés dans le sprite, la vitesse de déplacement, la vitesse de changement d'image, les hp,
//s'il est capable de tirer, et s'il vole)

var ennemyTypes = {
    'baddie':{velocity:100, leftImages:[0,1], imageSpeed:5, rightImages:[2,3], hp:20, shooter:0, flyer:0 },
    'dragon':{velocity:130, leftImages:[6, 7, 8, 9, 10, 11], imageSpeed:10, rightImages:[0, 1, 2, 3, 4, 5], hp:80, shooter:1, flyer:1}
};

function Ennemy(ennemy_id, ennemyKey)     
{
    this.id = ennemy_id;
    this.ennemies = game.add.group();
    this.ennemies.enableBody = true;
    this.ennemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.ennemies.createMultiple(1, ennemyKey);

    this.sprite = null;
    this.stats = {
        maxHp: 0,
        hp:0,
        power: 0
    };
    this.missile = null;
    this.direction = null;
    this.attackTimer = false;
    this.velocity = 0;
    this.miniStatus = null;
}

Ennemy.prototype.init = function(ennemyType, x, y, direction) 
{
    this.sprite = this.ennemies.getFirstExists(false);
    this.sprite.reset(x, y);

    this.miniStatus = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { font: 'bold 10px Arial' });
    
    //  Our two animations, walking left and right.
    this.sprite.animations.add('left', ennemyTypes[ennemyType].leftImages, ennemyTypes[ennemyType].imageSpeed, true);
    this.sprite.animations.add('right', ennemyTypes[ennemyType].rightImages, ennemyTypes[ennemyType].imageSpeed, true);
    this.sprite.animations.play(direction);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE); 
    
    this.stats.maxHp = this.stats.hp = 20;
    this.direction = direction;

    if (ennemyTypes[ennemyType].shooter == 1)
    {    
        this.missile = new Missile(this);
    }
};

Ennemy.prototype.kill = function() 
{
    game.physics.destroy(this.sprite);

    this.stats.hp = 0;
    this.miniStatus.text = "";
    this.sprite.kill();
};

Ennemy.prototype.update = function()
{
    this.miniStatusBarPosition();
    this.sprite.animations.play(this.direction);

    if (this.stats.hp <= 0) {
        this.kill();
    }

    var self = this;
    for (var p in players) {
        var player = players[p];
        game.physics.arcade.collide(self.sprite, player.sprite, function() {
            alert('ennemy player collision');
            player.lostHp(20);
            var angle = touchingEvent(self.sprite);
            socket.io.emit('ennemyHit', {ennemy_id: self.id, angle: angle});
        });
    }
};

Ennemy.prototype.render = function(ennemy_data)
{
    this.switchDirection(ennemy_data.dir);
    this.sprite.reset(ennemy_data.x, ennemy_data.y);
    this.stats.hp_old = this.stats.hp;
    this.stats.hp = ennemy_data.hp;
    this.miniStatusBarPosition();
    this.lostHp();
};

Ennemy.prototype.switchDirection = function (direction)
{
    if (direction  == '-1') direction = 'left';
    else direction = 'right';
    
    if (!this.sprite.animations.currentAnim) {
        if (!this.switchDirection_warn) {
            console.warn("Ennemy.switchDirection");
            this.switchDirection_warn = true;
        }
        return;
    }

    if (this.sprite.animations.currentAnim.name != direction) {
        this.direction = direction;
    }
}

Ennemy.prototype.miniStatusBarPosition = function()
{
    this.miniStatus.x = this.sprite.x+10;
    this.miniStatus.y = this.sprite.y-15;
    this.miniStatus.text = this.stats.hp;
};

Ennemy.prototype.setAttackTimer = function()
{
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
        this.kill();
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

Ennemy.get = function(i)
{
    if (i < 0) return;

    var n = 0;
    for (var e in ennemies) {
        if (i == n) return ennemies[e];
        n++;
    }
}

Ennemy.handle_server_data = function(ennemies_data)
{
    for (var e in ennemies_data) {
        var ennemy_data = ennemies_data[e];
        var ennemy_id = ennemy_data.id;
        var z;
        if (!ennemies[ennemy_id]) {
            ennemies[ennemy_id] = new Ennemy(ennemy_id, ennemy_data.key);
            ennemies[ennemy_id].init(ennemy_data.key, ennemy_data.x, ennemy_data.y, 'left');
            z = true;
        }
        ennemies[ennemy_id].render(ennemy_data);
    }
};
