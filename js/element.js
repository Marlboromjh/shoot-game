/**
 * 所有游戏对象的父对象
 */
var Element = function (opts) {
    var opts = opts || {};

//设置坐标和尺寸
    this.x = opts.x;
    this.y = opts.y;
    this.size = opts.size;
    this.speed =opts.speed;
};

//对象原型
Element.prototype = {
    /**
     * 原型方法move
     */
    move: function (x,y) {
        var addX = x || 0;
        var addY = y || 0;
        this.x += x;
        this.y += y;
    },
    /**
     * 原型draw方法
     * */
    draw: function () {

    }
};
