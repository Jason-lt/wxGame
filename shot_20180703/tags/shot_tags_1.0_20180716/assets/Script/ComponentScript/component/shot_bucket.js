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
        this.bottlePool0 = null;
        this.bottlePool1 = null;
        this.bottlePool2 = null;
        this.bottlePool3 = null;
        this.bottlePool4 = null;
        this.deadPool = null;
        //TODO : new
        this.rotationForBattleArray = [];
    },

    properties: {
        rotationNode : {
            default : null,
            type : cc.Node
        },
        aniNodeForSection : {
            default : null,
            type : cc.Node
        },
        deadPrefab : {
            default : null,
            type : cc.Prefab
        },
        //瓶子碎裂动画
        bottleAniNode : {
            default : null,
            type : cc.Node
        },
        bottleAniNodeLeft : {
            default : null,
            type : cc.Node
        },
        bottleAniNodeRight : {
            default : null,
            type : cc.Node
        },
        prefabList : [cc.Prefab],

        bgType : "none",
        radius : 139,
        roundSpeed : 0,
        roundRotation : 180,
        roundRotationKey : 0,

        aniScale : false,
        isOnShotAction : false,

        bottleList : ["none","none","none","none","none","none","none","none","none","none","none","none"],
        bottlePrefabList : [cc.Node],

        parentScene: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        for (var i = 0; i <  5; i++) {
            this["bottlePool"+i] = new cc.NodePool();
            for (var j = 0 ; j < 4 ; j ++){
                this["bottlePool"+i].put(cc.instantiate(this.prefabList[i])); // 通过 putInPool 接口放入对象池
            }
        }

        var winSize = cc.director.getWinSize();
        this.radius = this.radius*winSize.width/640;
        this.bottleAniNode.y = -this.radius;
        this.deadPool = new cc.NodePool();
        for (var k = 0 ; k < 8 ; k ++){
            var deadNode = cc.instantiate(this.deadPrefab);
            var deadW = deadNode.getComponent("dead");
            deadW.setPositionYForDead(this.radius);
            this.deadPool.put(deadNode);
        }
    },
    setRotateTimeWithType : function (type) {
        this.bgType = type;
        var level = shot.GameWorld.gameLevel;
        var timeConfig;
        var timeLong;
        if(type == "bottom" || type == "top"){
            if(type == "bottom"){
                timeConfig = shot.GameWorld.rotationTimeConfig.bottomBucket;
            }else if(type == "top"){
                timeConfig = shot.GameWorld.rotationTimeConfig.topBucket;
            }
            timeLong = timeConfig.initialTime;
            var subTimeList = timeConfig.decreaseTimeList;
            for (var k = 11 ; k < level ; k ++){
                if(k %5 == 0){
                    for (var i = 0 ; i < subTimeList.length ; i ++){
                        var subTimeConfig = subTimeList[i];
                        if(subTimeConfig.minLevel <= k && subTimeConfig.maxLevel >= k){
                            timeLong -= subTimeConfig.decreaseTime;
                            break;
                        }
                    }
                }
            }
        }else {
            timeConfig = shot.GameWorld.rotationTimeConfig.onlyBucket;
            var levelL = parseInt(level/5);
            if(levelL == 0){
                timeLong = timeConfig.oneToFour;
            }else if(levelL == 1){
                timeLong = timeConfig.fiveToNine;
            }else {
                timeLong = timeConfig.ten;
            }
        }
        // hall.LOGW("======","===level==="+level+"===time==="+timeLong);
        this.roundSpeed = 360/timeLong;
    },

    setBottlesWithList : function (bottleList) {
        // hall.LOGW("=====","===setBottlesWithList==="+JSON.stringify(bottleList));
        this.bottleList = bottleList;
        for(var i = 0 ; i < this.bottleList.length ; i ++){
            var bottle = this.bottlePrefabList[i];
            if(this.bottleList[i] != "none"){
                bottle.active = true;
                var bottleWindow = bottle.getComponent('shot_bottle');
                bottleWindow.setBottleType(this.bottleList[i],this,this.radius,i);
                bottle.rotation = 30*i;
            }else {
                bottle.active = false;
            }
        }
    },

    setBottlesWithListNew : function (bottleList) {
        this.cleanRotationToBattleArray();
        // hall.LOGW("=====","===setBottlesWithList==="+JSON.stringify(bottleList));
        this.bottleList = bottleList;
        var sectionR;
        var j;
        for(var i = 0 ; i < this.bottleList.length ; i ++){
            var bottle = this.bottlePrefabList[i];
            if(this.bottleList[i] != "none"){
                bottle.active = true;
                var bottleWindow = bottle.getComponent('shot_bottle');
                bottleWindow.setBottleType(this.bottleList[i],this,this.radius,i);
                bottle.rotation = 30*i;

                var rotation = i * 30;
                sectionR = shot.GameWorld.bottleConfig[this.bottleList[i]].sectionR;
                for (j = rotation-sectionR ; j < rotation + sectionR ; j ++){
                    var setIndex = j >=0 ? j : j+360;
                    this.rotationForBattleArray[setIndex].push(bottle);
                }
            }else {
                bottle.active = false;
            }
        }
    },

    stopShotAni : function () {
        if(this.isOnShotAction){
            var ani = this.node.getComponent(cc.Animation);
            var anim = ani.getAnimationState("shot_bucket");
            anim.stop();
        }
    },
    playShotBucketAnimation : function () {
        var that = this;
        this.stopShotAni();
        this.isOnShotAction = true;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState("shot_bucket");
        anim.once("finished", function () {
            that.isOnShotAction = false;
        });
        anim.play();
    },
    receiveBullet : function () {
        if(this.bgType == "none"){
            return;
        }
        // hall.LOGW("=====","======receiveBullet======"+this.bgType);
        this.playShotBucketAnimation();

        var nowRotation = 540-this.roundRotation;
        var haveHit = false;
        var haveHitBottle = false;
        var bottle;
        var bottleW;
        var resultRotation;
        for (var  i = 0 ; i < this.bottleList.length ; i ++ ){
            var type = this.bottleList[i];
            if (type != "none"){
                resultRotation = i;
                var rotation = i * 30;
                var sectionR = shot.GameWorld.bottleConfig[type].sectionR;
                if(i == 0){
                    if(nowRotation-360 >= -sectionR || nowRotation <= sectionR){
                        haveHit = true;
                        bottle = this.bottlePrefabList[resultRotation];
                        bottleW = bottle.getComponent("shot_bottle");
                        haveHitBottle = bottleW.bottleHit();
                    }
                }
                var minR = rotation - sectionR;
                var maxR = rotation + sectionR;
                if(minR <= nowRotation && maxR >= nowRotation){
                    haveHit = true;
                    bottle = this.bottlePrefabList[resultRotation];
                    bottleW = bottle.getComponent("shot_bottle");
                    haveHitBottle = bottleW.bottleHit();
                }
            }
        }

        // hall.LOGW("=====","======FIRE_NOTHING======"+this.bgType);
        if(this.bgType == "only"){
            this.playDeadAnimation();
        }
        if(!haveHit){
            this.parentScene.emptyGunAction();
        }
        if(this.bgType == "top"){
            if(!haveHitBottle){
                this.parentScene.playBottomDeadAnimation();
            }else {
                this.playDeadAnimation();
            }
        }
    },

    receiveBulletNew : function () {
        if(this.bgType == "none"){
            return;
        }
        //TODO:new
        this.roundRotationKey = (540-this.roundRotation) >> 0;
        // hall.LOGW("=====","======receiveBullet======"+this.bgType);
        this.playShotBucketAnimation();
        var bottle;
        var bottleW;
        // var haveHit = false;
        var haveHitBottle = false;

        var nowRotationBottleList = this.rotationForBattleArray[this.roundRotationKey];
        if(nowRotationBottleList.length != 0){
            for (var i = 0 ; i < nowRotationBottleList.length ; i ++){
                bottle = nowRotationBottleList[i];
                if(bottle.active){
                    // haveHit = true;
                    bottleW = bottle.getComponent("shot_bottle");
                    var bottleCanHit = bottleW.bottleHit();
                    haveHitBottle = bottleCanHit ? bottleCanHit : haveHitBottle;
                }
            }
        }

        if(shot.GameWorld.bulletRange){
            this.bottleAniNodeLeft.rotation = 180-shot.GameWorld.bulletRange;
            this.bottleAniNodeRight.rotation = 180+shot.GameWorld.bulletRange;
            var tempBottles = [];
            if(bottle){
                tempBottles.push(this.bottlePrefabList.indexOf(bottle));
            }
            var rotation;
            for (var j = 0 ; j < 2 ; j ++) {
                if (j == 0) {
                    rotation = 540 - this.roundRotation - shot.GameWorld.bulletRange;
                } else {
                    rotation = 540 - this.roundRotation + shot.GameWorld.bulletRange;
                }
                if (rotation < 0) {
                    rotation += 360;
                } else if (rotation > 360) {
                    rotation -= 360;
                }
                this.roundRotationKey = rotation >> 0;
                nowRotationBottleList = this.rotationForBattleArray[this.roundRotationKey];
                if (nowRotationBottleList.length != 0) {
                    for (i = 0; i < nowRotationBottleList.length; i++) {
                        bottle = nowRotationBottleList[i];
                        if (bottle.active) {
                            if (tempBottles.indexOf(this.bottlePrefabList.indexOf(bottle)) == -1) {
                                // haveHit = true;
                                bottleW = bottle.getComponent("shot_bottle");
                                if(j == 0){
                                    bottleCanHit = bottleW.bottleHit("left");
                                }else {
                                    bottleCanHit = bottleW.bottleHit("right");
                                }

                                tempBottles.push(this.bottlePrefabList.indexOf(bottle));
                                haveHitBottle = bottleCanHit ? bottleCanHit : haveHitBottle;
                            }
                        }
                    }
                }
            }
            // hall.LOGW("===","========="+tempBottles.toString());
        }

        if(this.bgType == "only"){
            this.playDeadAnimation();
        }
        if(!haveHitBottle){
            this.parentScene.emptyGunAction();
        }
        if(this.bgType == "top"){
            if(!haveHitBottle){
                this.parentScene.playBottomDeadAnimation();
            }else {
                this.playDeadAnimation();
            }
        }
    },

    playDeadAnimation : function (range) {
        if(this.bgType == "none"){
            return;
        }
        var that = this;
        var nowRotation;
        if(!range){
            nowRotation = 540-this.roundRotation;
            if(shot.GameWorld.bulletRange){
                this.playDeadAnimation(nowRotation-shot.GameWorld.bulletRange);
                this.playDeadAnimation(nowRotation+shot.GameWorld.bulletRange);
            }
        }else {
            nowRotation = range;
        }

        var aniNode ;
        if(this.deadPool.size() > 0){
            aniNode = this.deadPool.get();
        }else {
            aniNode = cc.instantiate(this.deadPrefab);
            var deadW = aniNode.getComponent("dead");
            deadW.setPositionYForDead(this.radius);
        }
        aniNode.rotation = nowRotation;
        if(this.aniScale){
            aniNode.scaleX = -1;
        }else {
            aniNode.scaleX = 1;
        }
        this.aniScale = !this.aniScale;
        this.aniNodeForSection.addChild(aniNode);
        var ani2 = aniNode.getComponent(cc.Animation);
        var anim2 = ani2.getAnimationState("dead");
        anim2.once("finished", function () {
            that.deadPool.put(aniNode);
            aniNode.removeFromParent();
        });
        anim2.play();
    },

    receiveBottleLifeCount : function (bottleInfo) {
        this.parentScene.bottleHit(bottleInfo.lifeCount);
        var bottle;
        if(bottleInfo.lifeCount == 0){
            //TODO : TEST
            if(bottleInfo.type == "treasureBox"){
                shot.GlobalFuncs.showSecretBox();
            }
            this.bottleList[bottleInfo.sitNumber] = "none";
            shot.GameWorld.bottleCount --;
            if(shot.GameWorld.bottleCount <= 0) { //一局的瓶子打完了
                this.parentScene.levelUp();
            }
        }

        bottle = this.bottlePrefabList[bottleInfo.sitNumber];
        var aniIndex = shot.GameWorld.bottleNameList.indexOf(bottleInfo.type);
        var bottleAniPool = this["bottlePool"+aniIndex];
        var bottleAniNodeAdd ;
        if(bottleAniPool.size() > 0){
            bottleAniNodeAdd = bottleAniPool.get();
        }else {
            bottleAniNodeAdd = cc.instantiate(this.prefabList[aniIndex])
        }
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
            var bottleWindow = bottle.getComponent('shot_bottle');
            bottleWindow.afterAnimation();
            bottleAniPool.put(bottleAniNodeAdd);
            bottleAniNodeAdd.removeFromParent();
            // //TODO : TEST
            // if(bottleInfo.type == "treasureBox"){
            //     shot.GlobalFuncs.showSecretBox();
            // }
        });
        animation.play();
    },
    removeAllBottles : function () {
        for (var i = 0 ; i < this.bottlePrefabList.length ; i ++ ){
            var bottle = this.bottlePrefabList[i];
            bottle.active = false;
        }
    },
    cleanRotationToBattleArray : function () {
        for (var i = 0 ; i < 360 ; i ++){
            this.rotationForBattleArray[i] = [];
        }
    },
    update : function(dt) {
        if(shot.GameWorld.gameOver || shot.GameWorld.gamePause){
            return;
        }
        if(this.bgType == "none"){
            return;
        }
        this.roundRotation += dt*this.roundSpeed;
        if(this.roundRotation > 540){
            this.roundRotation -= 360;
        }
        this.rotationNode.rotation = this.roundRotation;
    },
    onDestroy : function () {
        // this.aniNode.removeAllChildren();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

});
