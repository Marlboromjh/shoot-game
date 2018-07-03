/**
 * 键盘事件
 */

var KeyBoard = function () {
    var self = this;
//    键盘按下
    document.addEventListener('keydown',function (event) {
        self.keydown(event);
    });
//    松开键盘
    document.addEventListener('keyup',function (event) {
        self.keyup(event);
    })
};

KeyBoard.prototype = {
    pressedLeft: false,    //是否点击左
    pressedRight: false,   //是否点击右
    pressedUp: false,      //是否点击上
    pressedSpace: false,   //是否按空格
    keydown: function (event) {
    //    获取键位
        var key = event.keyCode;
        switch (key){
            case 32:
                this.pressedSpace = true;
                break;
            case 37:
                this.pressedLeft = true;
                this.pressedRight = false;
                break;
            case 38:
                this.pressedUp = true;
                break;
            case 39:
                this.pressedLeft = false;
                this.pressedRight = true;
                break;
        }
    },
    keyup: function (event) {
        //获取键位
        var key = event.keyCode;
        switch (key){
            case 32:
                this.pressedSpace = false;
                break;
            case 37:
                this.pressedLeft = false;
                break;
            case 38:
                this.pressedUp = false;
                break;
            case 39:
                this.pressedRight = false;
                break;
        }
    }
};