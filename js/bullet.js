/**
 * 子弹对象
 */
/**
 * 子类子弹对象
 */

var Bullet = function (opts) {
    var opts = opts || {};
    Element.call(this,opts);
};

//继承Element的方法
Bullet.prototype = new Element();


/*
* 特有方法
* 方法：fly向上移动
* */

Bullet.prototype.fly = function () {
    this.move(0,-this.speed);
    return this;
};

/*
* 碰撞检测
* @return Boolean
*/
Bullet.prototype.crash = function (enemy) {
    if (!(enemy.x + enemy.size < this.x) &&
    !(this.x + 1 < enemy.x) &&
    !(enemy.y + enemy.size < this.y) &&
    !(this.y + this.size < enemy.y)){
    //    物体碰撞了
        return true;
    }
    return false;
};

//方法：draw  方法
Bullet.prototype.draw = function () {
//    绘制一个线条
    context.beginPath();
    context.strokeStyle = '#fff';
    context.moveTo(this.x,this.y);
    context.lineTo(this.x,this.y-this.size); //子弹尺寸不支持修改
    context.closePath();
    context.stroke();
    return this;
};
