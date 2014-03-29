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
        hp: 0
    },
    statusBar: null,

    init: function(){
        this.sprite = game.add.sprite(32, 32, 'dude')
        this.stats.hp = 100;
        this.statusBar = game.add.text(this.sprite.x, this.sprite.y, this.stats.hp, { fontSize: '32px', fill: '#000' });
    },

    lostHp: function(qtyHp){
        this.stats.hp -= qtyHp;
    },

    statusBarPosition: function(){
        this.statusBar.x = this.sprite.x;
        this.statusBar.y = this.sprite.y;
        this.statusBar.text = this.stats.hp;
    }


}