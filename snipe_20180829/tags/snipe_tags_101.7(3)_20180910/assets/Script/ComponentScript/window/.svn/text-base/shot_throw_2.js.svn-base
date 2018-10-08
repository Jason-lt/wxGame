// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor : function () {
        this.bottlePool = null;
        this.bottlePool0 = null;
        this.bottlePool1 = null;
        this.bottlePool2 = null;
        this.bottlePool3 = null;
        // this.deadPool = null;
        this.bottleWinList = [];

        this.jugglingList = [];
        this.jugglingListDetail = {};
        this.bottleConfig = {};
    },

    properties: {

        widthScale : 0,
        heightScale : 0,

        gunNode : {
            default : null,
            type : cc.Node
        },
        gunNodeWin: {
            default: null,
            serializable: false
        },
        gameLevelLabel : {
            default : null,
            type : cc.Label
        },

        openFireButton : {
            default : null,
            type : cc.Button
        },

        missNode : {
            default : null,
            type : cc.Node
        },
        missNodeList : [cc.Sprite],
        missSpriteFrameList : [cc.SpriteFrame],

        countDownResultLabel : {
            default : null,
            type : cc.Label
        },

        bulletNode : {
            default : null,
            type : cc.Node
        },
        bulletCountLabel : {
            default : null,
            type : cc.Label
        },

        bottleNode : {
            default : null,
            type : cc.Node
        },
        bottleAniNode : {
            default : null,
            type : cc.Node
        },
        bottlePrefab : {
            default : null,
            type : cc.Prefab
        },
        prefabList : [cc.Prefab],

        countDown : 0,
        throwBottleCountDown : 0,
        addScoreCountDown : 0,

        missShowCount : 0,

        nowBottleIndex : 0,
        nowBottleType : "",
        bottleTypeList : [cc.String],

        haveHitBottle : false,
        receiveBulletIntervalCount : 0,
        gunFireIntervalCount : 0,

        gameLevel : 0,
        jugglingConfigOrigin : null
    },

    openFireButtonTouchStart : function () {
        if(this.isOnTouch){
            return;
        }
        this.isOnTouch = true;
        if(snipe.GameWorld.gunFireInterval && !snipe.GameWorld.gamePause && !snipe.GameWorld.gameOver){//汤姆逊冲锋枪按住连发,机枪
            snipe.GameWorld.gunFireIntervalNow = snipe.GameWorld.gunFireInterval;
            this.openFireAction();
        }
    },
    openFireButtonTouchCancel : function () {
        this.isOnTouch = false;
        // this.stopThompsonRunning();
    },
    openFireButtonTouchEnded : function(){
        if(!this.isOnTouch){
            return;
        }
        this.isOnTouch = false;
        // this.stopThompsonRunning();
        if(snipe.GameWorld.bulletRunningTimeBottom || snipe.GameWorld.gunFireInterval){ //特殊枪型
            return;
        }
        if(snipe.GameWorld.gameOver || snipe.GameWorld.gamePause ){
            return;
        }

        this.openFireAction();
    },
    openFireAction : function () {
        this.emptyGunCount = 0;
        snipe.GameWorld.bulletRunningTimeBottom = snipe.GameWorld.bulletRunningTimeCan;//子弹连发属性
        snipe.GameWorld.bulletRunningTimeTop = snipe.GameWorld.bulletRunningTimeCan;//子弹连发属性

        this.openFireBulletAction();
        this.openFireGunAction();
        this.receiveBullet();
    },
    openFireBulletAction : function () {
        if(snipe.GameWorld.gameOver || snipe.GameWorld.gamePause){
            return;
        }
        this.changeBulletCountLabel();
    },
    openFireGunAction : function () {
        try {
            wx.vibrateShort({
                success:function () {
                },
                fail : function () {
                },
                complete : function () {
                }
            });
        }catch (err){
            hall.LOGE("error:", "openFireGunAction——" + JSON.stringify(err));
        }
        this.gunNodeWin.openFire();
    },
    // stopThompsonRunning : function () {
    //     snipe.GameWorld.gunFireIntervalNow = 0;
    //
    //     // this.isFirstThompsonRunning = true;
    // },

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.widthScale = winSize.width/640;
        this.heightScale = winSize.height/1136;

        this.gunNodeWin = this.gunNode.getComponent('shot_gun');
        this.gunNodeWin.parentScene = this;
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireButtonTouchStart, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.openFireButtonTouchCancel, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireButtonTouchEnded, this, true);
        snipe.GlobalFuncs.setBulletType("bulletType0");

        var j;
        for (var i = 0; i <  4; i++) {
            this["bottlePool"+i] = new cc.NodePool();
            for (j = 0 ; j < 5 ; j ++){
                this["bottlePool"+i].put(cc.instantiate(this.prefabList[i])); // 通过 putInPool 接口放入对象池
            }
        }
        this.bottlePool = new cc.NodePool();
        for (j = 0 ; j < 20 ; j ++){
            var bottleNode = cc.instantiate(this.bottlePrefab);
            var bottleWin = bottleNode.getComponent("shot_bottle");
            bottleWin.setBottleOriginInformationForJuggling(this,this.widthScale*320+50);
            this.bottlePool.put(bottleNode); // 通过 putInPool 接口放入对象池
            this.bottleWinList.push(bottleWin);
        }

        snipe.AudioHelper.playMusic(snipe.EffectPath_mp3.jugglingMusic,true);

        this.gameStart();
        ty.NotificationCenter.listen(snipe.EventType.GAME_START,this.gameStart, this);
    },
    //游戏过程
    gameStart : function () {
        snipe.GameWorld.totalScore = 0;
        this.gameLevel = 0;
        var jugglingString = JSON.stringify(snipe.GameWorld.tishenJugglingLevelConfig);
        this.jugglingConfigOrigin = JSON.parse(jugglingString);

        this.setOriginConfig();
        this.setGameStart();
    },

    setOriginConfig : function () {

        for (var i = 0 ; i < 3 ; i ++){
            this.missNodeList[i].spriteFrame = this.missSpriteFrameList[0];
        }

        snipe.GameWorld.jugglingBottleCount.green = 0;
        snipe.GameWorld.jugglingBottleCount.purple = 0;
        snipe.GameWorld.jugglingBottleCount.orange = 0;
        snipe.GameWorld.jugglingBottleCount.red = 0;
        snipe.GameWorld.jugglingBottleHitCount = 0;
        snipe.GameWorld.jugglingBottleScore = 0;
        snipe.GameWorld.jugglingMissBottleCount = 0;
        snipe.GameWorld.jugglingBonus = 0;

        snipe.GameWorld.gamePause = false;
        snipe.GameWorld.gameOver = false;

        this.changeOriginData();

        this.gameLevel ++;
        this.gameLevelLabel.string = "第"+this.gameLevel+"关";
    },

    setGameStart : function () {
        // this.titleNode.active = false;
        this.missNode.active = true;
        this.bulletNode.active = true;
        this.countDown = 180;
        this.countDownResultLabel.string = "3";
        hall.GlobalFuncs.btnScaleEffectOnce(this.countDownResultLabel,1.5);
    },

    countDownOut : function () {
        this.countDownResultLabel.string = "";
        this.throwNextBottle();
    },

    changeOriginData : function () {

        var jugglingLevelConfig = this.jugglingConfigOrigin;
        jugglingLevelConfig.jugglingAccelerated += 65;
        jugglingLevelConfig.jugglingAccelerated =jugglingLevelConfig.jugglingAccelerated > 1455 ? 1455 : jugglingLevelConfig.jugglingAccelerated;
        jugglingLevelConfig.bottleCount += 2;
        jugglingLevelConfig.jugglingList[0].maxBottleCount += 2;

        jugglingLevelConfig.jugglingList[0].minSecondGap -= 0.1;
        jugglingLevelConfig.jugglingList[0].minSecondGap = jugglingLevelConfig.jugglingList[0].minSecondGap < 0.03 ? 0.03 : jugglingLevelConfig.jugglingList[0].minSecondGap;
        jugglingLevelConfig.jugglingList[0].maxSecondGap -= 0.2;
        jugglingLevelConfig.jugglingList[0].maxSecondGap = jugglingLevelConfig.jugglingList[0].maxSecondGap < 0.06 ? 0.06 : jugglingLevelConfig.jugglingList[0].maxSecondGap;

        jugglingLevelConfig.jugglingList[0].bottleConfig.green.bottleCount += 2;
        jugglingLevelConfig.jugglingList[0].bottleConfig.green.speed += 36;
        jugglingLevelConfig.jugglingList[0].bottleConfig.green.speed =
            jugglingLevelConfig.jugglingList[0].bottleConfig.green.speed > 952? 952:jugglingLevelConfig.jugglingList[0].bottleConfig.green.speed;

        snipe.GameWorld.verticalAccelerate = jugglingLevelConfig.jugglingAccelerated;
        snipe.GameWorld.jugglingOriginBottleCount = jugglingLevelConfig.bottleCount;
        snipe.GameWorld.jugglingBulletCount = jugglingLevelConfig.bulletCount;
        snipe.GameWorld.jugglingBonusPer = jugglingLevelConfig.bonus;
        this.jugglingList = jugglingLevelConfig.jugglingList;
        this.nowBottleIndex = 1;
        this.changeBottleConfig();
        this.changeBulletCountLabel();
    },

    changeBottleConfig : function () {
        var jugglingTemp ;
        var randomNumber;
        var lastIndex = 0;
        for (var i = 0 ; i < this.jugglingList.length ; i ++ ){
            jugglingTemp = this.jugglingList[i];
            if(this.nowBottleIndex >= jugglingTemp.minBottleCount && this.nowBottleIndex <= jugglingTemp.maxBottleCount){
                this.jugglingListDetail = jugglingTemp;
                this.bottleConfig = this.jugglingListDetail.bottleConfig;
                var notFirstKey = false;
                for(var key in this.jugglingListDetail.bottleConfig){
                    for (var j = 0 ; j < this.jugglingListDetail.bottleConfig[key].bottleCount ; j ++){
                        if(notFirstKey){
                            lastIndex = this.bottleTypeList.length;
                            randomNumber = hall.GlobalFuncs.getRandomNumberBefore(this.bottleTypeList.length);
                            this.bottleTypeList[lastIndex] = this.bottleTypeList[randomNumber];
                            this.bottleTypeList[randomNumber] = key;
                        }else {
                            this.bottleTypeList.push(key);
                        }
                    }
                    notFirstKey = true;
                }
                if(this.nowBottleIndex > 1){
                    this.throwNextBottle();
                }
                break;
            }
        }
    },

    changeBulletCountLabel : function () {
        if(snipe.GameWorld.jugglingBulletCount <= 0){
            return;
        }
        if(this.nowBottleIndex != 1){
            snipe.GameWorld.jugglingBulletCount --;
        }
        this.bulletCountLabel.string = snipe.GameWorld.jugglingBulletCount;
    },

    throwNextBottle : function () {
        if(snipe.GameWorld.gamePause){
            return;
        }
        if(this.bottleTypeList.length == 0){
            if(snipe.GameWorld.jugglingOriginBottleCount <= this.nowBottleIndex){
                //没有瓶子了
                return;
            }
            this.changeBottleConfig();
            return;
        }
        var bottleNode ;
        var bottleWin;
        if(this.bottlePool.size() > 0){
            bottleNode = this.bottlePool.get();
            bottleWin = bottleNode.getComponent("shot_bottle");
        }else {
            bottleNode = cc.instantiate(this.bottlePrefab);
            bottleWin = bottleNode.getComponent("shot_bottle");
            bottleWin.setBottleOriginInformationForJuggling(this,this.widthScale*320+50);
        }

        this.bottleNode.addChild(bottleNode);
        this.nowBottleType = this.bottleTypeList[0];
        var fromRight = this.nowBottleIndex%2 == 0;
        var originX = fromRight ? this.widthScale*320 : -this.widthScale*320;
        var originRotation = hall.GlobalFuncs.getRandomNumberBefore(360);
        var byRotation = hall.GlobalFuncs.getRandomNumberBefore(this.jugglingListDetail.maxRotation-this.jugglingListDetail.minRotation+1)+this.jugglingListDetail.minRotation;
        var originY = hall.GlobalFuncs.getRandomNumberBefore((90-byRotation)*5)- 200;
        bottleWin.setBottleTypeForJuggling(this.nowBottleType, this.bottleConfig[this.nowBottleType],originX,originY,originRotation,byRotation,fromRight);
        this.bottleTypeList.shift();
        this.nowBottleIndex ++;

        this.throwBottleCountDown = hall.GlobalFuncs.getRandomNumberBefore(this.jugglingListDetail.maxSecondGap*60-
                this.jugglingListDetail.minSecondGap*60 + 1) + this.jugglingListDetail.minSecondGap*60;
        // this.throwBottleCountDown = parseInt(this.throwBottleCountDown);
    },

    receiveBullet : function (runningFire) {

        var bottleWindow ;
        var bottleNodeX;
        if(!runningFire){
            this.haveHitBottle = false;
        }else {
            this.parentScene.openFireGunAction();
            if(snipe.GameWorld.gunFireInterval){
                this.parentScene.openFireBulletAction();
            }
        }

        var bulletRange = 75;
        if(snipe.GameWorld.bulletRange) {
            bulletRange += snipe.GameWorld.bulletRange;
        }
        for (var i = 0 ; i < this.bottleWinList.length ; i ++){
            bottleWindow = this.bottleWinList[i];
            bottleNodeX = bottleWindow.getJugglingNodeX();
            if(bottleNodeX >= -bulletRange && bottleNodeX <= bulletRange){
                var canHit = bottleWindow.bottleHit();
                this.haveHitBottle = canHit ? canHit : this.haveHitBottle;
            }
        }

        //M16(三连发)
        if(snipe.GameWorld.bulletRunningTimeBottom) {
            snipe.GameWorld.bulletRunningTimeBottom--;
            if (snipe.GameWorld.bulletRunningTimeBottom) {
                this.receiveBulletIntervalCount = snipe.GameWorld.bulletRunningInterval;
                return;
            }
        }

        if(snipe.GameWorld.gunFireInterval){
            return;
        }

        this.stopRunningCount();
    },
    stopRunningCount : function () {
        if(!this.haveHitBottle){
            this.emptyGunActionForJuggling();
        }
    },

    emptyGunActionForJuggling : function () {
        if(snipe.GameWorld.jugglingBulletCount == 0 && !snipe.GameWorld.gamePause){
            this.jugglingSchemaTimeOut();
        }
    },

    missBottle : function (bottle) {
        bottle.node.removeFromParent();
        this.bottlePool.put(bottle.node);
    },
    missBottleOne : function (bottle,fromRight) {
        if(snipe.GameWorld.jugglingMissBottleCount >= 3){
            return;
        }
        if(snipe.GameWorld.gamePause){
            return;
        }
        this.missNodeList[snipe.GameWorld.jugglingMissBottleCount].spriteFrame = this.missSpriteFrameList[1];
        snipe.GameWorld.jugglingMissBottleCount ++;
        if(fromRight){
            this.missNodeList[3].node.active = true;
        }else {
            this.missNodeList[4].node.active = true;
        }

        this.missShowCount = 60;
        this.missBottle(bottle);
        if(snipe.GameWorld.jugglingMissBottleCount >= 3){
            this.jugglingSchemaTimeOut();
            return;
        }
        if(snipe.GameWorld.jugglingMissBottleCount+snipe.GameWorld.jugglingBottleHitCount == snipe.GameWorld.jugglingOriginBottleCount){
            this.jugglingSchemaTimeGood();
            return;
        }
        if(snipe.GameWorld.jugglingBulletCount == 0){
            this.jugglingSchemaTimeGood();
        }
    },
    receiveBottleLifeCount : function (bottleInfo,bottle) {
        if(bottleInfo.lifeCount == 0){
            snipe.GameWorld.jugglingBottleCount[bottleInfo.type] ++;
            snipe.GameWorld.jugglingBottleHitCount ++;
            if(snipe.GameWorld.jugglingBottleHitCount+snipe.GameWorld.jugglingMissBottleCount == snipe.GameWorld.jugglingOriginBottleCount){
                this.jugglingSchemaTimeGood();
            }else if(snipe.GameWorld.jugglingBulletCount == 0){
                this.jugglingSchemaTimeOut();
            }
            this.missBottle(bottle);
        }else {
            if(snipe.GameWorld.jugglingBulletCount == 0){
                this.jugglingSchemaTimeOut();
            }
        }

        var aniIndex = snipe.GameWorld.bottleNameList.indexOf(bottleInfo.type);
        var bottleAniPool = this["bottlePool"+aniIndex];
        var bottleAniNodeAdd ;
        if(bottleAniPool.size() > 0){
            bottleAniNodeAdd = bottleAniPool.get();
        }else {
            bottleAniNodeAdd = cc.instantiate(this.prefabList[aniIndex])
        }
        bottleAniNodeAdd.x = 0;
        bottleAniNodeAdd.y = bottle.getComponent("shot_bottle").getJugglingNodeY();
        var ani = bottleAniNodeAdd.getComponent(cc.Animation);
        var clipName = ani.getClips()[bottleInfo.lifeCount].name;
        var animation = ani.getAnimationState(clipName);
        if(bottleInfo.direction){
            if(bottleInfo.direction == "left"){
                this.bottleAniNodeLeft.addChild(bottleAniNodeAdd);
            }else {
                this.bottleAniNodeRight.addChild(bottleAniNodeAdd);
            }
        }else {
            this.bottleAniNode.addChild(bottleAniNodeAdd);
        }
        animation.once("finished", function () {
            bottleAniPool.put(bottleAniNodeAdd);
            bottleAniNodeAdd.removeFromParent();
        });
        animation.play();
    },
    //结束
    jugglingSchemaTimeOut : function () {
        snipe.GameWorld.gamePause = true;
        this.jugglingSchemaTimeEnd();
    },
    jugglingSchemaTimeGood : function () {
        for (var key in snipe.GameWorld.jugglingBottleCount){
            // snipe.GameWorld.jugglingBottleHitCount += snipe.GameWorld.jugglingBottleCount[key];
            snipe.GameWorld.jugglingBottleScore += snipe.GameWorld.jugglingBottleCount[key]*snipe.GameWorld.bottleConfig[key].crazyBottleScore;
        }
        snipe.GameWorld.totalScore += snipe.GameWorld.jugglingBottleScore;
        this.setOriginConfig();
        this.setGameStart();
    },
    jugglingSchemaTimeEnd : function () {
        this.addScoreCountDown = 180;
        for (var key in snipe.GameWorld.jugglingBottleCount){
            // snipe.GameWorld.jugglingBottleHitCount += snipe.GameWorld.jugglingBottleCount[key];
            snipe.GameWorld.jugglingBottleScore += snipe.GameWorld.jugglingBottleCount[key]*snipe.GameWorld.bottleConfig[key].crazyBottleScore;
        }
        snipe.GameWorld.totalScore += snipe.GameWorld.jugglingBottleScore;
    },

    setResult : function () {
        snipe.GlobalFuncs.showGameOverWithMyScore();
    },

    update :function (dt) {
        //特殊枪
        if(this.receiveBulletIntervalCount){
            this.receiveBulletIntervalCount -- ;
            if(this.receiveBulletIntervalCount == 0){
                this.receiveBullet(true);
            }
        }

        if(snipe.GameWorld.gunFireIntervalNow && !snipe.GameWorld.gamePause && !snipe.GameWorld.gameOver){
            snipe.GameWorld.gunFireIntervalNow --;
            if(snipe.GameWorld.gunFireIntervalNow == 1){
                snipe.GameWorld.gunFireIntervalNow = snipe.GameWorld.gunFireInterval;
                this.receiveBullet(true);
            }
        }

        //开始倒计时
        if(this.countDown){
            this.countDown --;
            if(this.countDown == 120){
                this.countDownResultLabel.string = "2";
                hall.GlobalFuncs.btnScaleEffectOnce(this.countDownResultLabel,1.5);
            }else if(this.countDown == 60){
                this.countDownResultLabel.string = "1";
                hall.GlobalFuncs.btnScaleEffectOnce(this.countDownResultLabel,1.5);
            }else if(this.countDown == 0){
                this.countDownOut();
            }
            return;
        }
        //飞出瓶子
        if(this.throwBottleCountDown){
            this.throwBottleCountDown -- ;
            if(this.throwBottleCountDown <= 0){
                this.throwBottleCountDown = 0;
                this.throwNextBottle();
            }
        }
        //显示MISS标志
        if(this.missShowCount){
            this.missShowCount --;
            if(this.missShowCount == 0){
                this.missNodeList[4].node.active = false;
                this.missNodeList[3].node.active = false;
            }
        }

        //游戏结束后准备出结算动画
        if(this.addScoreCountDown){
            this.addScoreCountDown -- ;
            if(this.addScoreCountDown == 0){
                this.setResult();
            }
        }
    },

    onDestroy : function () {
        this.bottlePool0.clear();
        this.bottlePool1.clear();
        this.bottlePool2.clear();
        this.bottlePool3.clear();
        this.bottlePool.clear();
        // this.deadPool.clear();

        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

});
