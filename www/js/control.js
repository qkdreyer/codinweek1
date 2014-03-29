
var control =
{

    moveButton: '',
    buttons: null,

    initMoveButton: function()
    {
        var self = this;

        // Create action buttons
        this.buttons = game.add.group();
        this.buttons.fixedToCamera = true;
        this.buttons.enableBody = false;

        var upButton = this.buttons.create(20, game.height-40, 'star');
        var leftButton = this.buttons.create(0, game.height-20, 'star');
        var rightButton = this.buttons.create(40, game.height-20, 'star');

        upButton.inputEnabled = true;
        upButton.events.onInputDown.add(function(){
            self.moveButton = 'up';
        });
        leftButton.inputEnabled = true;
        leftButton.events.onInputDown.add(function(){
            self.moveButton = 'left';
        });
        rightButton.inputEnabled = true;
        rightButton.events.onInputDown.add(function(){
            self.moveButton = 'right';
        });
        leftButton.events.onInputUp.add(function(){
            self.moveButton = '';
        });
        rightButton.events.onInputUp.add(function(){
            self.moveButton = '';
        });
        upButton.events.onInputUp.add(function(){
            self.moveButton = '';
        });

    }
};