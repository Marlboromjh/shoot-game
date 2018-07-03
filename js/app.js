// 元素
var container = document.getElementById('game');

var levelText = document.querySelector('.game-level');                             //获取游戏分数
var nextLevelText = document.querySelector('.game-next-level');                      //获取下一个分数
var scoreText = document.querySelector('.game-intro .score');                 //获取等级
var totalScoreText = document.querySelector('.game-info-text .score');     //

//画布
var canvas = document.getElementById('canvas');           //获取画布
var context = canvas.getContext('2d');             //以2d方式渲染

//更新画布相关信息
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;



/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */

  init: function(opts) {
    this.status = 'start';
    var opts = Object.assign({},opts,CONFIG);     //把{} opts CONFIG合并到新的对象中
    //画布的间距
    var padding = opts.canvasPadding;
    var self = this;

    this.padding = padding;
    //射击目标极限纵坐标
    this.enemyLimitY = canvasHeight - padding - opts.planeSize.height;
    //射击目标对象极限横坐标
    this.enemyMinX = padding;
    this.enemyMaxX = canvasWidth - padding - opts.enemySize;

    //飞机对象极限横坐标
    var planeWidth = opts.planeSize.width;
    this.planeMinX = padding;
    this.planeMaxX = canvasWidth - padding - planeWidth;
    this.planePosX = canvasWidth / 2 - planeWidth;
    this.planePosY = this.enemyLimitY;

    //更新
    this.status = opts.status || 'start';
    this.score = 0;
    this.keyBoard = new KeyBoard();
    this.opts = opts;

    //加载图片资源，加载完成后交互
    var resources = [
        opts.enemyIcon,
        opts.enemyBoomIcon,
        opts.planeIcon
    ];

    util.resourceOnload(resources,function (images) {
    //更新图片
      opts.enemyIconImage = images[0];
      opts.enemyBoomIconImage = images[1];
      opts.planeIconImage = images[2];
      self.opts = opts;
      self.bindEvent();
    });

    this.bindEvent();
  },


  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
      self.scoring();
    };

    var replayBtn = document.querySelectorAll('.js-replay');
    var nextBtn = document.querySelector('.js-next');

  //  重新开始
    replayBtn.forEach(function (btn) {
      btn.onclick = function () {
        self.opts.level = 1;
        self.play();
        self.score = 0;
        totalScoreText.innerText = self.score;
        self.scoring();
      };
    });
  //  下一关开始
    nextBtn.onclick = function () {
      self.opts.level +=1;
      self.play();
      self.scoring();
    }
  },


  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },


  play: function() {
    //获取游戏初始化level
    var self = this,
        opts = this.opts,
        padding = this.padding,
        level = opts.level,
        numPerLine = opts.numPerLine,
        enemyGap = opts.enemyGap,
        enemySize = opts.enemySize,
        enemySpeed = opts.enemySpeed,
        enemyIconImage = opts.enemyIconImage,
        enemyBoomIconImage = opts.enemyBoomIconImage;
    //var enemyIconImage和enemyBoomIconImage;

    //清空射击目标对象数据
    this.enemies = [];

    //重置怪兽方向
    // console.log(self.opts.enemyDirection);
    self.opts.enemyDirection = 'right';


    //创建enemy实例
    for(var i=0; i < level; i++){
      for(var j=0; j < numPerLine; j++){
        var initOpt = {
          x: padding + j * (enemySize + enemyGap),
          y: padding + i * enemySize,
          size: enemySize,
          speed: enemySpeed,
          icon: enemyIconImage,
          boomIcon: enemyBoomIconImage
        };
        this.enemies.push(new Enemy(initOpt));
      }
    }

    var planeIconImage = opts.planeIconImage;
    //创建飞机
    this.plane = new Plane({
      x: this.planePosX,
      y: this.planePosY,
      minX: this.planeMinX,
      maxX: this.planeMaxX,
      size: opts.planeSize,
      speed: opts.planeSpeed,
      bulletSize: opts.bulletSize,
      bulletSpeed: opts.bulletSpeed,
      icon: planeIconImage
    });

    this.setStatus('playing');
    this.update();
  },


  /**
   * 结束方式有三种
   * -all-success
   * -success
   * -failed
   */
  end: function (type) {
  //  先清理当前画布
    context.clearRect(0,0,canvasWidth,canvasHeight);
    this.setStatus(type);
  },


  /**
   * 游戏每一帧的更新函数
   */
  update: function () {
    var self = this;
    var opts = this.opts;
    var padding = opts.padding;
    var enemySize = opts.enemySize;
    var enemies = this.enemies;

  //先清除画布
    context.clearRect(0,0,canvasWidth,canvasHeight);
  //更新飞机
  this.updatePanel();
  //更新敌人
  this.updateEnemies();

  //  如果没有目标元素，就是通关了
    if(enemies.length === 0){
    //  判断是否全部关卡都通过
      var endType = opts.level === opts.totalLevel ? 'all-success' : 'success';
      this.end(endType);
    //  停止动画循环
      return;
    }

  //  判断最后一个元素是否到了底部，是就游戏结束
    if(enemies[enemies.length - 1].y >= this.enemyLimitY){
      this.end('failed');
    //  停止动画循环
      return;
    }

  //  绘制画布
    this.draw();

    this.scoring();
    var scoreEnd = document.getElementsByClassName('score')[0];
    scoreEnd.innerText=this.score;

  //  不断循环update
    requestAnimFrame(function () {
      self.update()
    });

  },

  //绘制分数
  scoring: function () {
    var opts = this.opts;
    var level = opts.level+1;
    context.font='18px serif';
    context.fillStyle='#fff';
    context.fillText('分数：'+this.score,20,20);
    var levelIndex = document.getElementsByClassName('game-next-level game-info-text')[0];
    levelIndex.innerHTML = '下一个Level：'+level;
  },

  /**
   * 更新敌人实例数据
   */
  updateEnemies: function () {
    var opts = this.opts,
        padding = opts.padding,
        enemySize =opts.enemySize,
        enemies = this.enemies,
        plane = this.plane,
        i = enemies.length;

    //判断目标元素是否需要向下
    var enemyNeedDown = false;
    //获取当前目标实例数组中的最小横坐标和最大横坐标
    var enemiesBoundary = util.getHorizontalBoundary(enemies);

    //判断目标是否到了水平边界，是就改变方向向下
    if(enemiesBoundary.minX < this.enemyMinX
        || enemiesBoundary.maxX > this.enemyMaxX ){
      opts.enemyDirection = opts.enemyDirection === 'right' ? 'left' : 'right';
      enemyNeedDown = true;
    }

    //循环更新怪兽
    while (i--){
      var enemy = enemies[i];
      //  是否需要向下移动
      if(enemyNeedDown){
        enemy.down();
      }
      //水平位移
      enemy.translate(opts.enemyDirection);

      //  判断怪兽的状态，从而做出不同的处理
    //  根据状态进行处理
      switch (enemy.status){
        case 'normal':
          //判断是否击中未爆炸的敌人
          if(plane.hasHit(enemy)){
          //  设置爆炸时长展示一帧
          enemy.booming();
          }
          break;
        case 'booming':
          enemy.booming();
          break;
        case 'boomed':
          this.enemies.splice(i,1);
          this.score += 1;
          break;
      }
    }
  },


  /**
   *更新飞机
   * 更新子弹
   * 判断是否点击键盘移动了飞机
   * 判断是否需要射击子弹
   */
  updatePanel: function () {
    var plane = this.plane;
    var keyBoard = this.keyBoard;
    //如果按了左方向建就水平左移
    if(keyBoard.pressedLeft){
      plane.translate('left');
    }
    //如果按了右方向建就水平右移
    if(keyBoard.pressedRight){
      plane.translate('right');
    }
    //如果按了上键或者空格就射击
    if(keyBoard.pressedUp || keyBoard.pressedSpace){
      //飞机射击子弹
      plane.shoot();
      //取消飞机射击
      keyBoard.pressedUp = false;
      keyBoard.pressedSpace = false;
    }
  //  飞机更新子弹
    this.plane.updateBullets();

  },


  draw: function () {
      this.enemies.forEach(function (enemy) {
        enemy.draw();
      });
      this.plane.draw();
  }
};


// 初始化
// GAME.init(CONFIG);    //传入配置参数；
GAME.init();



