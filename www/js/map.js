var map =
{
    mapInstance: null,
    
    init: function() {
        this.mapInstance = game.add.tilemap('mario');
        this.mapInstance.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        layer = this.mapInstance.createLayer('World1');

        return this.mapInstance;
    }
};