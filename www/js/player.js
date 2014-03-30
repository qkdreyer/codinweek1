
function Player(x, y)
{
    this.sprite = null;
    this.stats = {
        hp: 100,
        maxHp: 100,
        missileDamage: 20,
        fightDamage: 10
    };
    this.statusBar = {
        sprite: null,
        maxWidth: 0
    };
    this.missile = new Missile(this);
    this.direction = 'right';

    if (!x) x = 32;
    if (!y) y = 32;

    this.sprite = game.add.sprite(x, y, 'player');
    this.miniStatus = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { font: 'bold 10px Arial' });
}

Player.prototype.init = function()
{
    //  Our two animations, walking left and right.
    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

    game.physics.enable(this.sprite);

    this.sprite.body.bounce.y = 0.2;
    this.sprite.body.linearDamping = 1;
    //Don't leave the world zone when collides
    this.sprite.body.collideWorldBounds = true;

    this.statusBar.sprite = game.add.sprite(10, 10, 'statusBar');
    var statusBarFrame = game.add.sprite(10, 10, 'statusBarFrame');
    this.statusBar.maxWidth = 0.90*statusBarFrame.width;
    this.statusBar.sprite.width = this.statusBar.maxWidth;
    statusBarFrame.fixedToCamera = true;
    this.statusBar.sprite.fixedToCamera = true;
    this.cursors = game.input.keyboard.createCursorKeys();
};

Player.prototype.update = function()
{
    this.miniStatusBarPosition();

    if (this.cursors.up.isDown || control.moveButton == 'up')
    {
        if (this.sprite.body.onFloor())
        {
            this.sprite.body.velocity.y = -200;
        }
    }

    if (this.cursors.left.isDown || control.moveButton == 'left')
    {
        this.sprite.body.velocity.x = -150;
        this.sprite.animations.play('left');
        this.direction = 'left';
    }
    else if (this.cursors.right.isDown || control.moveButton == 'right')
    {
        this.sprite.body.velocity.x = 150;
        this.sprite.animations.play('right');
        this.direction = 'right';
    }
    else
    {
        this.sprite.animations.stop();
    }


    if (this.isDead()) {
        this.sprite.body.velocity.x = 0;
        return;
    }

    var self = this;
    for (var e in ennemies) {
        var ennemy = ennemies[e];
        game.physics.arcade.collide(ennemy.sprite, self.sprite, function(){
            if (!ennemy.attackTimer) {
                self.lostHp(20);
                var angle = touchingEvent(ennemy.sprite);
                socket.io.emit('playerHit', {ennemy_id: e, angle: angle});
            }
            ennemy.setAttackTimer();
        });
    }

    this.missile.update();
};

Player.prototype.render = function(player_data)
{
    this.sprite.x = player_data.x;
    this.sprite.y = player_data.y;
    this.stats.hp = player_data.hp;
    this.miniStatusBarPosition();

    if (player_data.missile) {
        this.missile.render(player_data.missile);
    }
};

Player.prototype.die = function()
{
    this.stats.hp = 0;
    this.statusBar.sprite.width = 0;

    endText = game.add.text(100, 100, 'U DIE BITCH', { fontSize: '32px', fill: '#000' });
    endText.fixedToCamera = true;
};

Player.prototype.kill = function()
{
    this.sprite.kill();
    this.miniStatus.text = '';
    if (this.missile.sprite) this.missile.kill();
};

Player.prototype.doSync = function()
{
    var do_sync = this.do_sync || has_moved(this.sprite) || this.missile.doSync();
    this.do_sync = false;
    return do_sync;
};

Player.prototype.serialize = function()
{
    return {
        id: this.userid,
        x: this.sprite.x,
        y: this.sprite.y,
        hp: this.stats.hp,
        missile: this.missile.serialize()
    };
};

Player.prototype.lostHp = function(qtyHp)
{
    this.stats.hp -= qtyHp;
    if (this.stats.hp <= 0) 
    {
        this.die();
    }
    else  
    {
        this.statusBar.sprite.width = this.statusBar.maxWidth * (this.stats.hp / this.stats.maxHp);

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
    this.sync = true;
};

Player.prototype.isDead = function()
{
    return (this.stats.hp === 0);
};

Player.prototype.miniStatusBarPosition = function()
{
    this.miniStatus.x = this.sprite.x+5;
    this.miniStatus.y = this.sprite.y-5;
    this.miniStatus.text = this.stats.hp;
};

Player.prototype.fight = function ()
{

};
