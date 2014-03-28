
function createEnnemy()
{
	
    //  This sprite is using a texture atlas for all of its animation data
    bot = game.add.sprite(750, 500, 'bot');
	
	console.log(bot.x);
    //game.physics.enable(bot, Phaser.Physics.ARCADE);
	
	bot.body.velocity.x=-85;

    //  Here we add a new animation called 'run'
    //  We haven't specified any frames because it's using every frame in the texture atlas
    bot.animations.add('run');

    //  And this starts the animation playing by using its key ("run")
    //  15 is the frame rate (15fps)
    //  true means it will loop when it finishes
    bot.animations.play('run', 5, true);

}