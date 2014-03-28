var has_moved = function(sprite) {
    if (!sprite) debugger;
    // Retrieves current player position
    var x_int = (sprite.x + 0.5) | 0;
    var y_int = (sprite.y + 0.5) | 0;

    // Compare current to last player position
    var has_moved = sprite.x_int != x_int || sprite.y_int != y_int;

    // Updates last player position
    sprite.x_int = x_int;
    sprite.y_int = y_int;

    return has_moved;
}

var merge = function() {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};