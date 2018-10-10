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
    ctor : function () {
        this.addScorePool = null;
        this.arrowPool = null;
        this.dajiChengPool = null;
        this.dajiHongPool = null;
        this.dajiHuangPool = null;
        this.dajiLanPool = null;
        this.dajiZongPool = null;
    },
    extends: cc.Component,

    properties: {

        windowWidth : 0,
        windowHeight : 0,

        objectSprite : {
            default : null,
            type : cc.Sprite
        },
        objectSpriteFrameList :[cc.SpriteFrame],
        objectPrefabList :[cc.Prefab],

        dajiChengPrefab : {
            default : null,
            type : cc.Prefab
        },
        dajiHongPrefab : {
            default : null,
            type : cc.Prefab
        },
        dajiHuangPrefab : {
            default : null,
            type : cc.Prefab
        },
        dajiLanPrefab : {
            default : null,
            type : cc.Prefab
        },
        dajiZongPrefab : {
            default : null,
            type : cc.Prefab
        },

        //特殊节点
        moveNode : {
            default : null,
            type : cc.Node
        },
        rotationNode : {
            default : null,
            type : cc.Node
        },
        bombAniNode : {
            default : null,
            type : cc.Node
        },
        gunHitAniNode : {
            default : null,
            type : cc.Node
        },
        hitAniNode : {
            default : null,
            type : cc.Node
        },

        //箭
        arrowPrefab : {
            default : null,
            type : cc.Prefab
        },
        leftArrowNode : {
            default : null,
            type : cc.Node
        },
        rightArrowNode : {
            default : null,
            type : cc.Node
        },
        arrowSpriteFrameList : [cc.SpriteFrame],
        arrowIndex : -1,
        gunSpriteFrame : cc.SpriteFrame,

        //增加分数
        leftAddScoreNode : {
            default : null,
            type : cc.Node
        },
        rightAddScoreNode : {
            default : null,
            type : cc.Node
        },
        addScorePrefab : cc.Prefab,

        rotationSpeed : 0,
        horizontalSpeed : 0,
        verticalSpeed : 0,

        parentScene: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width;
        this.windowHeight = winSize.height;

        var k;
        var addAniNode;

        this.addScorePool = new cc.NodePool();
        for (k = 0 ; k < 10 ; k ++){
            addAniNode = cc.instantiate(this.addScorePrefab);
            this.addScorePool.put(addAniNode);
        }
        this.arrowPool = new cc.NodePool();
        for (k = 0 ; k < 50 ; k ++){
            addAniNode = cc.instantiate(this.arrowPrefab);
            addAniNode.getComponent("double_arrow").parentScene = this;
            this.arrowPool.put(addAniNode);
        }
        this.dajiChengPool = new cc.NodePool();
        for (k = 0 ; k < 20 ; k ++){
            addAniNode = cc.instantiate(this.dajiChengPrefab);
            this.dajiChengPool.put(addAniNode);
        }
        this.dajiHongPool = new cc.NodePool();
        for (k = 0 ; k < 20 ; k ++){
            addAniNode = cc.instantiate(this.dajiHongPrefab);
            this.dajiHongPool.put(addAniNode);
        }
        this.dajiHuangPool = new cc.NodePool();
        for (k = 0 ; k < 20 ; k ++){
            addAniNode = cc.instantiate(this.dajiHuangPrefab);
            this.dajiHuangPool.put(addAniNode);
        }
        this.dajiLanPool = new cc.NodePool();
        for (k = 0 ; k < 20 ; k ++){
            addAniNode = cc.instantiate(this.dajiLanPrefab);
            this.dajiLanPool.put(addAniNode);
        }
        this.dajiZongPool = new cc.NodePool();
        for (k = 0 ; k < 20 ; k ++){
            addAniNode = cc.instantiate(this.dajiZongPrefab);
            this.dajiZongPool.put(addAniNode);
        }

        ty.NotificationCenter.listen(double.EventType.CHANGE_GUN_TYPE,this.changeGunType,this);
    },

    changeGunType : function () {
        if(double.GameWorld.weaponType == 0){//枪
            this.arrowIndex = -1;
        }else {//弓箭
            this.arrowIndex = double.GameWorld.doubleBowNameList.indexOf(double.GameWorld.gunType);
        }
    },

    changeObjectType : function () {
        // double.GameWorld.objectType
        var index = double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType);
        this.objectSprite.spriteFrame = this.objectSpriteFrameList[index];
        this.objectSprite.node.active = true;

        this.objectSprite.getComponent(cc.PolygonCollider).points = double.objectColliderPoints[double.GameWorld.objectType];
        // tempCollider.world.points = [cc.p(0,20),cc.p(10,20),cc.p(0,10),cc.p(10,10)];
        // tempCollider.points = [cc.p(0,20),cc.p(10,20),cc.p(0,10),cc.p(10,10)];

        double.EffectPath_mp3.objectHit = double.EffectPath_mp3["objectHit"+ index];
        double.EffectPath_mp3.objectBomb = double.EffectPath_mp3["objectBomb"+ index];

        double.GameWorld.objectNowLocationX = 0;
        this.moveNode.x = double.GameWorld.objectNowLocationX;
        double.GameWorld.objectNowLocationY = -this.windowHeight/2-40;
        this.moveNode.y = double.GameWorld.objectNowLocationY;
        double.GameWorld.objectNowRotation = 0;
        this.rotationNode.rotation = double.GameWorld.objectNowRotation;

        this.rotationSpeed = 50;
        this.horizontalSpeed = 0;
        this.verticalSpeed = double.GameWorld.objectInitializedSpeed;

        this.node.active = true;

        this.changeGunType();

        // console.log(' this.moveNode.y', this.moveNode.y);
    },

    sendArrowForObject : function (from,direction) {
        var arrowNode  ;
        if(this.arrowPool.size() > 0){
            arrowNode = this.arrowPool.get();
        }else {
            arrowNode = cc.instantiate(this.arrowPrefab);
            arrowNode.getComponent("double_arrow").parentScene = this;
        }
        arrowNode.x = 0;
        arrowNode.y = 0;
        if(from){
            this.rightArrowNode.addChild(arrowNode);
        }else {
            this.leftArrowNode.addChild(arrowNode);
        }
        if(this.arrowIndex == -1){
            arrowNode.getComponent("double_arrow").reSetArrowSprite(this.gunSpriteFrame);
        }else {
            arrowNode.getComponent("double_arrow").reSetArrowSprite(this.arrowSpriteFrameList[this.arrowIndex]);
        }
        arrowNode.getComponent("double_arrow").beginSendAnimation(direction,from);
    },

    //被箭头射中
    receiveArrow : function (arrowNode,direction,from) {
        double.AudioHelper.playEffect(double.EffectPath_mp3.objectHit,false);
        arrowNode.removeFromParent();
        var vec1;
        if(from){
            vec1 = this.gunHitAniNode.convertToNodeSpace(this.rightArrowNode.convertToWorldSpace(arrowNode.position));
        }else {
            vec1 = this.gunHitAniNode.convertToNodeSpace(this.leftArrowNode.convertToWorldSpace(arrowNode.position));
        }
        arrowNode.x = vec1.x;
        arrowNode.y = vec1.y;
        arrowNode.rotation = arrowNode.rotation-this.rotationNode.rotation;
        this.gunHitAniNode.addChild(arrowNode);

        this.changeEffectFromWeaponToObject(direction);

        this.playAddScoreAnimation(from);
    },
    //被子弹射中,子弹动画
    receiveBullet : function (arrowNode,direction,from) {
        double.AudioHelper.playEffect(double.EffectPath_mp3.objectHit,false);
        arrowNode.removeFromParent();
        this.arrowPool.put(arrowNode);

        var tempPool = this[double.GameWorld.doubleObjectAniPoolList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)]];
        var tempNode;
        if(tempPool.size() > 0){
            tempNode = tempPool.get();
            this.hitAniNode.addChild(tempNode);
            var ani = tempNode.getComponent(cc.Animation);
            var animation = ani.getAnimationState(ani.getClips()[0].name);
            // var that = this;
            animation.once("finished", function () {
                // tempNode.removeFromParent();
                // that[double.GameWorld.doubleObjectAniPoolList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)]].put(tempNode);
                tempPool.put(tempNode);
            });
            animation.play();
        }
        this.changeEffectFromWeaponToObject(direction);
        this.playAddScoreAnimation(from);
    },

    changeEffectFromWeaponToObject : function (direction) {
        this.verticalSpeed += double.GameWorld.impactForce * Math.sin(direction);
        this.horizontalSpeed += double.GameWorld.impactForce * Math.cos(direction);
        if(!double.GameWorld.gameLevelUp){
            this.parentScene.receiveArrow();
        }
    },
    playAddScoreAnimation : function (from) {
        // 加分动画
        var addNode  ;
        if(this.addScorePool.size() > 0){
            addNode = this.addScorePool.get();
        }else {
            addNode = cc.instantiate(this.addScorePrefab);
        }
        addNode.getComponent("addScore").changeLabel();
        if(from){
            this.rightAddScoreNode.addChild(addNode);
        }else {
            this.leftAddScoreNode.addChild(addNode);
        }
        var ani = addNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function () {
            addNode.removeFromParent();
            that.addScorePool.put(addNode);
        });
        animation.play();
    },

    gameBomb : function () {
        double.AudioHelper.playEffect(double.EffectPath_mp3.objectBomb,false);
        this.objectSprite.node.active = false;
        if(double.GameWorld.objectType =="box"){
            hall.adManager.showBannerAd();
            double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.goldTreasureChest,5);
            // this.parentScene.afterObjectBomb();
            return;
        }
        if(!this[double.GameWorld.objectType]){
            this[double.GameWorld.objectType] = cc.instantiate(this.objectPrefabList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)]);
            this[double.GameWorld.objectType].x= 0;
            this[double.GameWorld.objectType].y = 0;
        }
        var ani = this[double.GameWorld.objectType].getComponent(cc.Animation);
        var animation = ani.getAnimationState(ani.getClips()[0].name);
        this.bombAniNode.addChild(this[double.GameWorld.objectType]);
        var that = this;
        animation.once("finished", function () {
            that[double.GameWorld.objectType].removeFromParent();
            that.parentScene.afterObjectBomb();
        });
        animation.play();

        //手机短震动 1.2.0版本支持
        try {
            // console.log('gameBomb');
            wx.vibrateShort();
        } catch (error) {
            
        }
    },
    gameOver : function () {
        this.node.active = false;
        this.rotationSpeed = 0;
        this.horizontalSpeed = 0;
        this.verticalSpeed = 0;
        this.removeAllGunHitAniNodeChild();
        this.parentScene.gameOver();
    },

    removeAllGunHitAniNodeChild : function () {
        var tempNodeList = this.gunHitAniNode.children;
        var tempNode;
        while (tempNodeList.length != 0){
            tempNode = tempNodeList[0];
            tempNode.stopAction();
            tempNode.removeFromParent();
            this.arrowPool.put(tempNode);
        }
        tempNodeList = this.rightArrowNode.children;
        while (tempNodeList.length != 0){
            tempNode = tempNodeList[0];
            tempNode.stopAction();
            tempNode.removeFromParent();
            this.arrowPool.put(tempNode);
        }
        tempNodeList = this.leftArrowNode.children;
        while (tempNodeList.length != 0){
            tempNode = tempNodeList[0];
            tempNode.stopAction();
            tempNode.removeFromParent();
            this.arrowPool.put(tempNode);
        }

        var tempNodeList2 = this.rightAddScoreNode.children;
        while (tempNodeList2.length != 0){
            tempNode = tempNodeList2[0];
            tempNode.stopAction();
            tempNode.removeFromParent();
            this.addScorePool.put(tempNode);
        }
        var tempNodeList3 = this.leftAddScoreNode.children;
        while (tempNodeList3.length != 0){
            tempNode = tempNodeList3[0];
            tempNode.stopAction();
            tempNode.removeFromParent();
            this.addScorePool.put(tempNode);
        }
        var tempNodeList4 = this.hitAniNode.children;
        var tempPool = this[double.GameWorld.doubleObjectAniPoolList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)]];
        while (tempNodeList4.length != 0){
            tempNode = tempNodeList4[0];
            tempNode.stopAction();
            tempNode.removeFromParent();
            tempPool.put(tempNode);
        }
    },

    update : function(dt) {
        if(double.GameWorld.gameOver || double.GameWorld.gamePause || double.GameWorld.gameLevelUp){
            return ;
        }
        if(dt > 0.03)
        {
            dt = 0.03;
        }
        if(this.horizontalSpeed < 0){
            this.horizontalSpeed += double.GameWorld.objectHAccelerated*dt;
            if(this.horizontalSpeed > 0){
                this.horizontalSpeed = 0;
            }
        }else if(this.horizontalSpeed > 0){
            this.horizontalSpeed -= double.GameWorld.objectHAccelerated*dt;
            if(this.horizontalSpeed < 0){
                this.horizontalSpeed = 0;
            }
        }
        double.GameWorld.objectNowLocationX += this.horizontalSpeed*dt;
        this.moveNode.x = double.GameWorld.objectNowLocationX;

        this.verticalSpeed -= double.GameWorld.objectAccelerated*dt;
        if(this.verticalSpeed > 0 && double.GameWorld.objectNowLocationY > 100){
            this.verticalSpeed = Math.max(0,this.verticalSpeed- (this.verticalSpeed * this.verticalSpeed) / 5000);
        }
        double.GameWorld.objectNowLocationY += this.verticalSpeed*dt;
        this.moveNode.y = double.GameWorld.objectNowLocationY;

        double.GameWorld.objectNowRotation += this.rotationSpeed*dt;
        this.rotationNode.rotation = double.GameWorld.objectNowRotation;

        if(double.GameWorld.objectNowLocationX < -this.windowWidth/2-80 || double.GameWorld.objectNowLocationX > this.windowWidth/2+80 ||
        double.GameWorld.objectNowLocationY < -this.windowHeight/2-200 || double.GameWorld.objectNowLocationY > this.windowHeight/2+400){
            //本局结束
            this.gameOver();
            // if(!double.GameWorld.gameLevelUp){
            //     this.gameOver();
            // }
        }
        // console.log(double.GameWorld.objectNowLocationY);
    },

    onDestroy : function () {
        this.addScorePool.clear();
        this.arrowPool.clear();
        this.dajiChengPool.clear();
        this.dajiHongPool.clear();
        this.dajiHuangPool.clear();
        this.dajiLanPool.clear();
        this.dajiZongPool.clear();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
