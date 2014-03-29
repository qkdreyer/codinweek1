/**
 * Created with JetBrains PhpStorm.
 * User: Soahar
 * Date: 29/03/14
 * Time: 18:39
 * To change this template use File | Settings | File Templates.
 */
var missile =
{
    sprite: null,
    isActiveMissile: false,
    parent: null,
    init: function(parent){
        this.parent = parent;
        return this;
    },
    update: function(){
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

            console.log(this.parent.direction);
            console.log(missileVelocity);

            this.sprite = game.add.sprite(missileStartX, missileStartY, 'star');
            game.physics.enable(this.sprite);
            this.sprite.body.bounce.y = 0.7;
            this.sprite.body.bounce.x = 0.6;
            this.sprite.body.velocity.x = missileVelocity;
            this.sprite.body.gravity.y = 100;

            this.isMissileActive = true;
        }



    },

    //Gère la vitesse du missile
    attackMissileHandling: function()
    {
        if (this.sprite.body.velocity.x > 0)
        {
            this.sprite.body.velocity.x = parseInt(--this.sprite.body.velocity.x, 10);
        }
        else if (this.sprite.body.velocity.x < 0)
        {
            this.sprite.body.velocity.x = parseInt(++this.sprite.body.velocity.x, 10);
        }

        if (this.sprite.body.velocity.x === 0)
        {
            //Fin du déplacement : l'étoile disparait et on peut à nouveau en lancer une
            this.sprite.kill();
            this.isMissileActive = false;
        }

        if (!map.contains(this.sprite.body)) {
            console.log('!!! OUT OF MAP !!!');
        }

        console.log("REDUCTION DE LA VITESSE : " + this.sprite.body.velocity.x);
    }
}