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


var collisions =
{
	initialize: function(map)
	{

	    //COLLISIONS
	    map.setCollisionBetween(15, 16);
	    map.setCollisionBetween(20, 25);
	    map.setCollisionBetween(27, 29);
	    //Ground collision
	    map.setCollision(40);
	    //"?" blocks
	    map.setCollision(14);
	    // Overlap functions
	    map.setTileIndexCallback(11, hitCoin, this);
	    map.setTileIndexCallback(12, hitMushroom, this);

	}
	
};