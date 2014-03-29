/**
 * Created with JetBrains PhpStorm.
 * User: Soahar
 * Date: 29/03/14
 * Time: 18:39
 * To change this template use File | Settings | File Templates.
 */

function Missile(parent){
    this.sprite = null;
    this.isActiveMissile = false;
    this.parent = parent;
    this.attackTimer = false;
}

Missile.prototype.update = function(){
    var self = this;
    game.physics.arcade.collide(this.sprite, layer);
    for (var p in players){
        game.physics.arcade.collide(players[p].sprite, this.sprite, function(){
            console.log('collide');
            if (!self.attackTimer){
                console.log('here');
                players[p].lostHp(players[p].stats.distanceDamage);
            }
            self.setAttackTimer();
        });
    }


    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) == true)
    {
        this.startAttack();
    }

    if (this.isMissileActive)
    {
        this.attackMissileHandling();
    }
};


Missile.prototype.setAttackTimer = function(){
    var self = this;
    this.attackTimer = true;
    setInterval(function(){
        self.attackTimer = false;
    },3000);
};

    //Lance un missile
Missile.prototype.startAttack = function () {
    //On ne peut lancer un nouveau missile que si aucun autre n'est en cours de déplacement
    if (!this.isMissileActive)
    {
        var missileVelocity;
        var missileStartX;
        var missileStartY;

        if (this.parent.direction == 'left')
        {
            missileVelocity = this.parent.velocity*-1;
            missileStartX = this.parent.sprite.x - 30;
        }
        else if (this.parent.direction == 'right')
        {
            missileVelocity = this.parent.velocity;
            missileStartX = this.parent.sprite.x + 30;
        }
        missileStartY = this.parent.sprite.y;

        this.sprite = game.add.sprite(missileStartX, missileStartY, 'missile');
        game.physics.enable(this.sprite);
        this.sprite.body.bounce.y = 0.7;
        this.sprite.body.bounce.x = 0.6;
        this.sprite.body.velocity.x = missileVelocity;
        this.sprite.body.gravity.y = 100;

        this.isMissileActive = true;
    }
};

//Gère la vitesse du missile
Missile.prototype.attackMissileHandling = function() {
    if (this.sprite.body.velocity.x > 0)
    {
        this.sprite.body.velocity.x = parseInt(--this.sprite.body.velocity.x, 10);
    }
    else if (this.sprite.body.velocity.x < 0)
    {
        this.sprite.body.velocity.x = parseInt(++this.sprite.body.velocity.x, 10);
    }
    else if (this.sprite.body.velocity.x === 0)
    {
        //Fin du déplacement : l'étoile disparait et on peut à nouveau en lancer une
        //this.sprite.kill();
        this.isMissileActive = false;
    }

    if (!map.contains(this.sprite.body)) {
        //console.log('!!! OUT OF MAP !!!');
    }

};