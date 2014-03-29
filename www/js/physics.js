/* MANAGE COLLISIONS FOR PLAYER */

//Generic function for hit comestible objects
function hitComestibleObject(sprite, tile, score) {

    tile.index = 1;
    scoreText.text = 'Score: ' + score;

    return false;

}

function hitMushroom(sprite, tile) {
    score += 40;
    return hitComestibleObject(sprite, tile, score);
}

function hitCoin(sprite, tile) {
    score += 10;
    return hitComestibleObject(sprite, tile, score);
}

var physics =
{
    init: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#787878';
        game.physics.arcade.gravity.y = 250;

        //COLLISIONS
        var mapInstance = map.mapInstance;
        
        mapInstance.setCollisionBetween(15, 16);
        mapInstance.setCollisionBetween(20, 25);
        mapInstance.setCollisionBetween(27, 29);
        //Ground collision
        mapInstance.setCollision(40);
        //"?" blocks
        mapInstance.setCollision(14);
        // Overlap functions
        mapInstance.setTileIndexCallback(11, hitCoin, this);
        mapInstance.setTileIndexCallback(12, hitMushroom, this);        
    },

    update: function() {
        game.physics.arcade.collide(star, layer);
        game.physics.arcade.collide(player.sprite, layer);
    }
};