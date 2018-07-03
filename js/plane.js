/**
 * 飞机对象
 */

var Plane = function (opts) {
    var opts = opts || {};
    Element.call(this,opts);
//    特有属性
    this.minX = opts.minX;
    this.maxX = opts.maxX;
    this.icon = opts.icon;

//    子弹属性
    this.bullets = [];
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletSize = opts.bulletSize;
};

//继承Element 的方法
Plane.prototype = new Element();

/*
* 方法：hasHit  判断是否击中当前元素
* @parm  {Aim}  enemy目标元素实例
*/

Plane.prototype.hasHit = function (enemy) {
    var bullets = this.bullets;
    var hasHit = false;
    for(var j=bullets.length - 1; j >= 0; j--){
    //    如果子弹击中目标对象，则销毁子弹
        if(bullets[j].crash(enemy)){
            this.bullets.splice(j,1);
            hasHit = true;
            break;
        }
    }
    return hasHit;
};

/**
 * 方法：translate 根据方向左右移动飞机
 */
Plane.prototype.translate = function (direction) {
    var speed = this.speed;
    var addX;

//    根据方向修改飞机坐标
    if(direction === 'left'){
    //    判断是否到达左边界，是就不移动，否则移动一个单位
        addX = this.x < this.minX ? 0: -speed;
    }else {
    //    判断是否到达右边界，是停止移动，否则移动一个单位
        addX = this.x > this.maxX ? 0: speed;
    }

    this.move(addX,0);
    return this;
};

/**
 * 方法：shoot 方法
 */
Plane.prototype.shoot = function () {
//    创建子弹，子弹位置居中射出
    var x = this.x + this.size.width / 2;
    //创建子弹
    this.bullets.push(new Bullet({
        x: x,
        y: this.y,
        size: this.bulletSize,
        speed: this.bulletSpeed
    }));
    return this;
};

/**
 * 方法：更新子弹状态
 */
Plane.prototype.updateBullets = function () {
    var bullets = this.bullets;
    var i = bullets.length;
//    遍历更新
    while (i--){
        var bullet = bullets[i];
        bullet.fly();
    //    如果子弹对象超出边界，就删除
        if(bullet.y <= 0 - bullet.size){
        //    如果子弹实例下降到底部，就要在bullets 数组中删除该子弹实例
            bullets.splice(i,1);
        }
    }
};

/**
 * 方法：drawBullets  画子弹
 */
Plane.prototype.drawBullets = function () {
    this.bullets.forEach(function (bullet) {
        bullet.draw();
    });
};

/**
 * 方法：draw 方法
 */
Plane.prototype.draw = function () {
//    绘制飞机
    context.drawImage(this.icon,this.x,this.y,this.size.width,this.size.height);
    this.drawBullets();
    return this;
};
