/**
 * Created with JetBrains PhpStorm.
 * User: Soahar
 * Date: 29/03/14
 * Time: 14:43
 * To change this template use File | Settings | File Templates.
 */


function Player(x, y) {
    this.sprite = null;
    this.stats = {
        hp: 0,
        maxHp: 0
    };
    this.statusBar = {
        sprite: null,
        maxWidth: 0
    };
    this.missile = null;
    this.direction = null;
    this.velocity = 300;

    if (!x) x = 32;
    if (!y) y = 32;

    this.sprite = game.add.sprite(x, y, 'dude');
}

Player.prototype.init = function() {

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

    this.missile = new Missile(this);

    statusBarFrame.fixedToCamera = true;
    this.statusBar.sprite.fixedToCamera = true;
    //this.statusBar = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { fontSize: '32px', fill: '#000' });
    this.direction = 'right'
};

Player.prototype.lostHp = function(qtyHp) {
    this.stats.hp -= qtyHp;
    if (this.stats.hp <= 0) this.die();
    else {
        console.log(this.stats.hp);
        this.statusBar.sprite.width = this.statusBar.maxWidth * (this.stats.hp / this.stats.maxHp);
    }
};

Player.prototype.isDead = function() {
    return (this.stats.hp === 0);
};

Player.prototype.die = function() {
    this.stats.hp = 0;
    this.statusBar.sprite.width = 0;

    endText = game.add.text(100, 100, 'U DIE BITCH', { fontSize: '32px', fill: '#000' });
    endText.fixedToCamera = true;
    console.log('U DIE BITCH');
};

Player.prototype.statusBarPosition = function() {
    this.statusBar.x = this.sprite.x;
    this.statusBar.y = this.sprite.y;
    this.statusBar.text = this.stats.hp;
};

Player.prototype.update = function() {
    if (this.isDead())
    {
        this.sprite.body.velocity.x = 0;
        return;
    }

    this.missile.update();
};
