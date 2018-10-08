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
        this.deadPool = null;
        this.bottleWinList = [];

        this.jugglingList = [];
        this.jugglingListDetail = {};
        this.bottleConfig = {};
    },

    properties: {

        widthScale : 0,
        heightScale : 0,

        titleNode : {
            default : null,
            type : cc.Node
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
        // countDownSprite : {
        //     default : null,
        //     type : cc.Sprite
        // },
        // countDownSpriteFrameList : [cc.SpriteFrame],

        bulletNode : {
            default : null,
            type : cc.Node
        },
        bulletCountLabel : {
            default : null,
            type : cc.Label
        },
        infiniteSprite : {
            default : null,
            type : cc.Sprite
        },
        countDownLabel : {
            default : null,
            type : cc.Label
        },
        infiniteBulletTimeSprite : {
            default : null,
            type : cc.Sprite
        },
        infiniteBulletTimeNode : {
            default : null,
            type : cc.Node
        },
        infiniteTime : 0,
        infiniteFullTime : 0,

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


        bucketNode : {
            default : null,
            type : cc.Node
        },
        mutongNode : {
            default : null,
            type : cc.Node
        },
        mutongAnimation : {
            default : null,
            type : cc.AnimationState
        },
        mutongRaiceCount : 0,
        mutongDesSpeed : 0,
        mutongPosuiNode : {
            default : null,
            type : cc.Node
        },
        deadPrefab : {
            default : null,
            type : cc.Prefab
        },
        deadAniNode : {
            default : null,
            type : cc.Node
        },
        bonusLabel : {
            default : null,
            type : cc.Label
        },
        bonusSprite : {
            default : null,
            type : cc.Sprite
        },


        resultNode : {
            default : null,
            type : cc.Node
        },
        hitLabel : {
            default : null,
            type : cc.Label
        },
        lastLabel : {
            default : null,
            type : cc.Label
        },
        scoreLabel : {
            default : null,
            type : cc.Label
        },
        addScoreLabel : {
            default : null,
            type : cc.Label
        },

        countDown : 0,
        bucketRaiseCount : 0,
        bucketHitTime : false,
        throwBottleCountDown : 0,
        startBucketInfoCount : 0,
        crazyCheerCount : 0,
        afterResultCount : 0,
        addScoreCountDown : 0,
        overCountDown : 0,

        missShowCount : 0,

        nowBottleIndex : 0,
        nowBottleType : "",
        bottleTypeList : [cc.String],

        haveHitBottle : false,
        receiveBulletIntervalCount : 0,
        gunFireIntervalCount : 0
    },

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.widthScale = winSize.width/640;
        this.heightScale = winSize.height/1136;

        this.bucketNode.active = false;
        this.infiniteBulletTimeNode.active = false;

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

        this.deadPool = new cc.NodePool();
        for (j = 0 ; j < 8 ; j ++){
            var deadNode = cc.instantiate(this.deadPrefab);
            var deadW = deadNode.getComponent("dead");
            deadW.setPositionYForDead(0);
            this.deadPool.put(deadNode);
        }
        snipe.GameWorld.jugglingBottleCount.green = 0;
        snipe.GameWorld.jugglingBottleCount.purple = 0;
        snipe.GameWorld.jugglingBottleCount.orange = 0;
        snipe.GameWorld.jugglingBottleCount.red = 0;
        snipe.GameWorld.jugglingBottleHitCount = 0;
        snipe.GameWorld.jugglingBottleScore = 0;
        snipe.GameWorld.jugglingMissBottleCount = 0;
        snipe.GameWorld.jugglingBonus = 0;

        // this.startGameCount = 120;
        snipe.GameWorld.gamePause = false;
        var ani = this.titleNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function () {
            that.titleNode.active = false;
            that.missNode.active = true;
            that.bulletNode.active = true;
            that.countDown = 180;
            snipe.AudioHelper.playMusic(snipe.EffectPath_mp3.jugglingMusic,true);
            // hall.GlobalFuncs.btnScaleEffectOnce(that.countDownSprite,1.5);
            hall.GlobalFuncs.btnScaleEffectOnce(that.countDownResultLabel,1.5);
        });
        animation.play();
        this.changeOriginData();
    },
    countDownOut : function () {
        // this.countDownSprite.node.active = false;
        this.countDownResultLabel.node.active = false;
        this.throwNextBottle();
    },

    changeOriginData : function () {
        var jugglingConfig = snipe.GameWorld.jugglingSchemaConfig.jugglingLevelConfig;
        var jugglingLevelConfig;
        for (var i = 0 ; i < jugglingConfig.length ; i ++){
            if(jugglingConfig[i].jugglingLevel == snipe.GameWorld.gameLevel){
                jugglingLevelConfig = jugglingConfig[i];
            }
        }

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
        if(this.bucketHitTime){
            return;
        }
        if(this.bucketNode.active){
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
    },

    receiveBullet : function (runningFire) {
        if(this.bucketNode.active){
            if(this.bucketHitTime){
                this.playDeadAnimation(runningFire);
            }else {
                snipe.GameWorld.bulletRunningTimeBottom = 0;//子弹连发属性
                snipe.GameWorld.bulletRunningTimeTop = 0;//子弹连发属性
            }
            return;
        }
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

    startBucketInfo : function () {
        this.bucketNode.active = true;
        this.infiniteBulletTimeNode.active = true;
        this.bucketRaiseCount = 55;
        // this.bonusLabel.string = "+"+snipe.GameWorld.jugglingBonus;
        this.bonusLabel.string = "+0";

        var ani = this.mutongNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        // ani.setCurrentTime(5,clipName);
        this.mutongAnimation = ani.getAnimationState(clipName);
        this.mutongAnimation.play();
        this.mutongAnimation.speed = 0.5;
    },
    startBucketAnimation : function () {
        this.infiniteTime = 180;
        this.infiniteFullTime = 180;
        this.bucketHitTime = true;
        this.infiniteSprite.node.active = true;
        this.bulletCountLabel.node.active = false;
    },
    playDeadAnimation : function (runningFire) {
        this.bonusSprite.node.active = true;

        snipe.AudioHelper.playEffect(snipe.EffectPath_mp3.jugglingTrack);
        snipe.GameWorld.jugglingBonus += snipe.GameWorld.jugglingBonusPer*snipe.GameWorld.bulletBlood;
        if(snipe.GameWorld.bulletRange){
            snipe.GameWorld.jugglingBonus += snipe.GameWorld.jugglingBonusPer*2;
        }
        this.bonusLabel.string = "+"+snipe.GameWorld.jugglingBonus;

        this.mutongAnimation.speed = 1;
        this.mutongRaiceCount = 5;

        if(runningFire){
            this.parentScene.openFireGunAction();
            if(snipe.GameWorld.gunFireInterval){
                this.parentScene.openFireBulletAction();
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

        var aniNode ;
        if(this.deadPool.size() > 0){
            aniNode = this.deadPool.get();
        }else {
            aniNode = cc.instantiate(this.deadPrefab);
            var deadW = aniNode.getComponent("dead");
            deadW.setPositionYForDead(0);
        }
        this.deadAniNode.addChild(aniNode);
        var ani2 = aniNode.getComponent(cc.Animation);
        var anim2 = ani2.getAnimationState("dead");
        var that = this;
        anim2.once("finished", function () {
            that.deadPool.put(aniNode);
            aniNode.removeFromParent();
        });
        anim2.play();
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
            // this.jugglingSchemaTimeOut();
            this.startBucketInfo();
            return;
        }
        if(snipe.GameWorld.jugglingBulletCount == 0){
            this.startBucketInfo();
        }

    },
    receiveBottleLifeCount : function (bottleInfo,bottle) {
        if(bottleInfo.lifeCount == 0){
            snipe.GameWorld.jugglingBottleCount[bottleInfo.type] ++;
            snipe.GameWorld.jugglingBottleHitCount ++;
            if(snipe.GameWorld.jugglingBottleHitCount+snipe.GameWorld.jugglingMissBottleCount == snipe.GameWorld.jugglingOriginBottleCount){
                this.startBucketInfoCount = 60;
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
    jugglingSchemaTimeGood : function (havePosui) {
        this.bucketHitTime = false;
        snipe.GameWorld.gamePause = true;
        // var ani = this.mutongNode.getComponent(cc.Animation);
        // var clipName = ani.getClips()[0].name;
        // var animation = ani.getAnimationState(clipName);
        this.mutongAnimation.stop();
        this.mutongNode.stopAllActions();
        this.mutongNode.active = false;

        this.infiniteSprite.node.active = false;
        this.bulletCountLabel.node.active = true;

        if(havePosui){
            this.mutongPosuiNode.active = true;
            this.mutongPosuiNode.y = this.mutongNode.y;
            var ani2 = this.mutongPosuiNode.getComponent(cc.Animation);
            var clipName2 = ani2.getClips()[0].name;
            var animation2 = ani2.getAnimationState(clipName2);
            var that = this;
            animation2.once("finished", function () {
                that.jugglingSchemaTimeEnd();
            });
            animation2.play();
            this.crazyCheerCount = 18;
            snipe.AudioHelper.playEffect(snipe.EffectPath_mp3.jugglingFragmentation);
        }else {
            this.jugglingSchemaTimeEnd();
        }
    },
    jugglingSchemaTimeEnd : function () {
        this.addScoreCountDown = 60;
        for (var key in snipe.GameWorld.jugglingBottleCount){
            // snipe.GameWorld.jugglingBottleHitCount += snipe.GameWorld.jugglingBottleCount[key];
            snipe.GameWorld.jugglingBottleScore += snipe.GameWorld.jugglingBottleCount[key]*snipe.GameWorld.bottleConfig[key].crazyBottleScore;
        }
    },

    setResult : function () {
        this.missNode.active = false;
        snipe.GameWorld.gamePause = true;
        this.bucketNode.active = false;
        this.resultNode.active = true;
        // this.hitLabel.string = snipe.GameWorld.crazyBottleHitCount+"";
        this.hitLabel.string = snipe.GameWorld.jugglingBottleScore +"";
        // this.lastLabel.string = snipe.GameWorld.jugglingMissBottleCount;
        this.scoreLabel.string = snipe.GameWorld.jugglingBonus;
        this.addScoreLabel.string = snipe.GameWorld.jugglingBottleScore;

        if(snipe.GameWorld.jugglingMissBottleCount >= 3){
            this.lastLabel.string = 0;
        }else {
            this.lastLabel.string = snipe.GameWorld.jugglingBulletCount*10;
            snipe.GameWorld.jugglingBonus += snipe.GameWorld.jugglingBulletCount*10;
        }

        var ani = this.resultNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function () {
            if(snipe.GameWorld.jugglingBonus){
                that.overCountDown = 90;
                return;
                // that.scoreLabel.string = snipe.GameWorld.crazyBonus+"";
            }
            that.afterResultCount = 90;
        });
        animation.play();
    },
    jugglingOver : function () {
        snipe.AudioHelper.playMusic(snipe.EffectPath_mp3.musicGame,true);
        this.parentScene.endJugglingSchema();
        this.node.destroy();
    },
    update :function (dt) {
        //特殊枪
        if(this.receiveBulletIntervalCount){
            this.receiveBulletIntervalCount -- ;
            if(this.receiveBulletIntervalCount == 0){
                this.receiveBullet(true);
            }
        }
        // if(snipe.GameWorld.isOnThompsonRunning && !snipe.GameWorld.gamePause && !snipe.GameWorld.gameOver){
        //     this.gunFireIntervalCount ++;
        //     if(this.gunFireIntervalCount >= snipe.GameWorld.gunFireInterval){
        //         this.gunFireIntervalCount = 0;
        //         this.receiveBullet(true);
        //     }
        // }

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
                // this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[1];
                this.countDownResultLabel.string = "2";
                // hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite,1.5);
                hall.GlobalFuncs.btnScaleEffectOnce(this.countDownResultLabel,1.5);
            }else if(this.countDown == 60){
                // this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[0];
                this.countDownResultLabel.string = "1";
                // hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite,1.5);
                hall.GlobalFuncs.btnScaleEffectOnce(this.countDownResultLabel,1.5);
            }else if(this.countDown == 0){
                this.countDownOut();
            }
            return;
        }
        //飞出瓶子
        if(this.throwBottleCountDown){
            this.throwBottleCountDown -- ;
            if(this.throwBottleCountDown == 0){
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
        if(this.startBucketInfoCount){
            this.startBucketInfoCount -- ;
            if(this.startBucketInfoCount == 0){
                this.startBucketInfo();
            }
        }
        //木桶出现
        if(this.bucketRaiseCount){
            this.bucketRaiseCount --;
            this.mutongNode.y += this.heightScale*this.bucketRaiseCount/2;
            if(this.bucketRaiseCount == 0){
                this.startBucketAnimation();
            }
        }
        //击打木桶进度条
        if(this.infiniteTime && this.bucketHitTime){
            this.infiniteTime --;
            if(this.infiniteTime == 0){
                this.jugglingSchemaTimeGood(true);
                this.countDownLabel.string = "0";
            }else {
                if(this.infiniteTime % 60 == 0){
                    this.countDownLabel.string = ""+ (this.infiniteTime/60 >> 0);
                }
                this.infiniteBulletTimeSprite.fillRange = (this.infiniteTime/this.infiniteFullTime);
            }
        }
        //木桶在经受打击过程中移动
        if(this.bucketHitTime){
            if(this.mutongRaiceCount){
                this.mutongDesSpeed = 0;
                if(this.mutongNode.y < 230*this.heightScale){
                    this.mutongNode.y += this.mutongRaiceCount*5*this.heightScale;
                }
                this.mutongAnimation.speed = this.mutongRaiceCount/5;
                this.mutongRaiceCount --;
            }else {
                this.mutongDesSpeed += 0.5;
                this.mutongNode.y -= this.mutongDesSpeed*this.heightScale;
            }
            if(this.mutongNode.y < -200*this.heightScale){
                this.jugglingSchemaTimeGood(false);
            }
        }
        if(this.crazyCheerCount){
            this.crazyCheerCount --;
            if(this.crazyCheerCount == 0){
                snipe.AudioHelper.playEffect(snipe.EffectPath_mp3.crazyCheer,false);
            }
        }

        //游戏结束后准备出结算动画
        if(this.addScoreCountDown){
            this.addScoreCountDown -- ;
            if(this.addScoreCountDown == 0){
                this.setResult();
            }
        }
        //分数添加滚动
        if(this.overCountDown){
            this.overCountDown --;
            if(this.overCountDown == 0){
                snipe.GameWorld.jugglingBottleScore += snipe.GameWorld.jugglingBonus;
                this.addScoreLabel.string = snipe.GameWorld.jugglingBottleScore;
                this.afterResultCount = 60;
            }else {
                this.addScoreLabel.string = (((90-this.overCountDown)*snipe.GameWorld.jugglingBonus/90)+snipe.GameWorld.jugglingBottleScore) >> 0;
            }
        }
        //移除
        if(this.afterResultCount){
            this.afterResultCount --;
            if(this.afterResultCount == 0){
                this.jugglingOver();
            }
        }
    },

    onDestroy : function () {
        this.bottlePool0.clear();
        this.bottlePool1.clear();
        this.bottlePool2.clear();
        this.bottlePool3.clear();
        this.bottlePool.clear();
        this.deadPool.clear();

        // this.mutongNode.stopAllActions();
        // this.mutongNode.removeAllChildren();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:



    // start () {
    //
    // },


});
