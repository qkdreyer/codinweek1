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
        hp: 100,
        maxHp: 100,
        distanceDamage: 20
    };
    this.statusBar = {
        sprite: null,
        maxWidth: 0
    };
    this.missile = null;
    this.direction = 'right';
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

    this.missile = new Missile(this);

    this.statusBar.sprite = game.add.sprite(10, 10, 'statusBar');
    var statusBarFrame = game.add.sprite(10, 10, 'statusBarFrame');
    this.statusBar.maxWidth = 0.95*statusBarFrame.width;
    this.statusBar.sprite.width = this.statusBar.maxWidth;
    statusBarFrame.fixedToCamera = true;
    this.statusBar.sprite.fixedToCamera = true;
};

Player.prototype.render = function(player_data) {
    this.sprite.x = player_data.x;
    this.sprite.y = player_data.y;
    this.stats.hp = player_data.hp;
};

Player.prototype.kill = function() {
    return this.sprite.kill();
};

Player.prototype.hasMoved = function() {
    // Retrieves current player position
    var x_int = (this.sprite.x + 0.5) | 0;
    var y_int = (this.sprite.y + 0.5) | 0;

    // Compare current to last player position
    var has_moved = this.x_int != x_int || this.y_int != y_int;

    // Updates last player position
    this.x_int = x_int;
    this.y_int = y_int;

    return has_moved;
}

Player.prototype.serialize = function() {
    return {
        id: this.userid,
        x: this.sprite.x,
        y: this.sprite.y,
        hp: this.stats.hp,
        missile: this.missile.serialize()
    };
};

Player.prototype.lostHp = function(qtyHp) {
    this.stats.hp -= qtyHp;
    if (this.stats.hp <= 0) this.die();
    else  this.statusBar.sprite.width = this.statusBar.maxWidth * (this.stats.hp / this.stats.maxHp);
};

Player.prototype.isDead = function() {
    return (this.stats.hp === 0);
};

Player.prototype.die = function() {
    this.stats.hp = 0;
    this.statusBar.sprite.width = 0;

    endText = game.add.text(100, 100, 'U DIE BITCH', { fontSize: '32px', fill: '#000' });
    endText.fixedToCamera = true;
};

Player.prototype.statusBarPosition = function() {
    this.statusBar.x = this.sprite.x;
    this.statusBar.y = this.sprite.y;
    this.statusBar.text = this.stats.hp;
};

Player.prototype.update = function() {
    if (this.isDead()) {
        this.sprite.body.velocity.x = 0;
        return;
    }

    this.missile.update();
};
