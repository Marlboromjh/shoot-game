/**
 * 敌人对象,即射击对象
 */
var Enemy = function (opts) {
    var opts = opts || {};
    Element.call(this,opts);
//特有属性   当前状态     可调   normal    booming    boomed
    this.status = 'normal';
    this.icon = opts.icon;
    this.boomIcon = opts.boomIcon;
//特有属性   计算爆炸的帧次
    this.boomCount = 0;
};


//继承Element的方法
Enemy.prototype = new Element();

/**
 * 方法：down  向下移动一个单位
 */
Enemy.prototype.down = function () {
    this.move(0,this.size);
    return this;
};

/**
 *方法：booming  爆炸中
 */
Enemy.prototype.booming = function () {
    this.status = 'booming';
    this.boomCount += 1;
    if(this.boomCount > 4){
        this.status = 'boomed';
    }
    return this;
};

/**
 * 方法：translate 根据方向水平移动一个单位
 * @param {String} direction  水平移动方向
 */

Enemy.prototype.translate = function (direction) {
    if(direction === 'left'){
        this.move(-this.speed,0);
    }else {
        this.move(this.speed,0);
    }
    return this;
};

//方法：draw方法
Enemy.prototype.draw = function () {
    //绘制敌人
    switch (this.status){
        case 'normal':
            context.drawImage(this.icon,this.x,this.y,this.size,this.size);
            break;
        case 'booming':
            context.drawImage(this.boomIcon,this.x,this.y,this.size,this.size);
            break;
    }
    return this;
};