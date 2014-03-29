/**
 * Created with JetBrains PhpStorm.
 * User: Soahar
 * Date: 29/03/14
 * Time: 10:27
 * To change this template use File | Settings | File Templates.
 */
var control =
{

    moveButton: null,
    buttons: null,

    initMoveButton: function()
    {
        // Create action buttons
        buttons.enableBody = false;

        var upButton = buttons.create(20, game.height-40, 'star');
        var leftButton = buttons.create(0, game.height-20, 'star');
        var rightButton = buttons.create(40, game.height-20, 'star');

        upButton.inputEnabled = true;
        upButton.events.onInputDown.add(function(){
            moveButton = 'up';
        });
        leftButton.inputEnabled = true;
        leftButton.events.onInputDown.add(function(){
            moveButton = 'left';
        });
        rightButton.inputEnabled = true;
        rightButton.events.onInputDown.add(function(){
            moveButton = 'right';
        });
        leftButton.events.onInputUp.add(function(){
            moveButton = '';
        });
        rightButton.events.onInputUp.add(function(){
            moveButton = '';
        });
        upButton.events.onInputUp.add(function(){
            moveButton = '';
        });

    }
};