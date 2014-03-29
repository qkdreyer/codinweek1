var map =
{
    mapInstance: null,
    
    init: function() {
        this.mapInstance = game.add.tilemap('mario');
        this.mapInstance.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        layer = this.mapInstance.createLayer('World1');

        return this.mapInstance;
    },

    contains: function(obj) {
		return obj.x > 0 && obj.x < this.mapInstance.widthInPixels && obj.y > 0 && obj.y < this.mapInstance.heightInPixels;
    }

};