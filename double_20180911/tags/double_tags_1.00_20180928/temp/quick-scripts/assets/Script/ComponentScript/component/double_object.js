(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/double_object.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f763d7UteFLJ6XCI2+CALII', 'double_object', __filename);
// Script/ComponentScript/component/double_object.js

"use strict";

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
    ctor: function ctor() {
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

        windowWidth: 0,
        windowHeight: 0,

        objectSprite: {
            default: null,
            type: cc.Sprite
        },
        objectSpriteFrameList: [cc.SpriteFrame],
        objectPrefabList: [cc.Prefab],

        dajiChengPrefab: {
            default: null,
            type: cc.Prefab
        },
        dajiHongPrefab: {
            default: null,
            type: cc.Prefab
        },
        dajiHuangPrefab: {
            default: null,
            type: cc.Prefab
        },
        dajiLanPrefab: {
            default: null,
            type: cc.Prefab
        },
        dajiZongPrefab: {
            default: null,
            type: cc.Prefab
        },

        //特殊节点
        moveNode: {
            default: null,
            type: cc.Node
        },
        rotationNode: {
            default: null,
            type: cc.Node
        },
        bombAniNode: {
            default: null,
            type: cc.Node
        },
        gunHitAniNode: {
            default: null,
            type: cc.Node
        },

        //箭
        arrowPrefab: {
            default: null,
            type: cc.Prefab
        },
        leftArrowNode: {
            default: null,
            type: cc.Node
        },
        rightArrowNode: {
            default: null,
            type: cc.Node
        },
        arrowSpriteFrameList: [cc.SpriteFrame],
        arrowIndex: -1,
        gunSpriteFrame: cc.SpriteFrame,

        //增加分数
        leftAddScoreNode: {
            default: null,
            type: cc.Node
        },
        rightAddScoreNode: {
            default: null,
            type: cc.Node
        },
        addScorePrefab: cc.Prefab,

        rotationSpeed: 0,
        horizontalSpeed: 0,
        verticalSpeed: 0,

        parentScene: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width;
        this.windowHeight = winSize.height;

        var k;
        var addAniNode;

        this.addScorePool = new cc.NodePool();
        for (k = 0; k < 10; k++) {
            addAniNode = cc.instantiate(this.addScorePrefab);
            this.addScorePool.put(addAniNode);
        }
        this.arrowPool = new cc.NodePool();
        for (k = 0; k < 30; k++) {
            addAniNode = cc.instantiate(this.arrowPrefab);
            addAniNode.getComponent("double_arrow").parentScene = this;
            this.arrowPool.put(addAniNode);
        }
        this.dajiChengPool = new cc.NodePool();
        for (k = 0; k < 20; k++) {
            addAniNode = cc.instantiate(this.dajiChengPrefab);
            this.dajiChengPool.put(addAniNode);
        }
        this.dajiHongPool = new cc.NodePool();
        for (k = 0; k < 20; k++) {
            addAniNode = cc.instantiate(this.dajiHongPrefab);
            this.dajiHongPool.put(addAniNode);
        }
        this.dajiHuangPool = new cc.NodePool();
        for (k = 0; k < 20; k++) {
            addAniNode = cc.instantiate(this.dajiHuangPrefab);
            this.dajiHuangPool.put(addAniNode);
        }
        this.dajiLanPool = new cc.NodePool();
        for (k = 0; k < 20; k++) {
            addAniNode = cc.instantiate(this.dajiLanPrefab);
            this.dajiLanPool.put(addAniNode);
        }
        this.dajiZongPool = new cc.NodePool();
        for (k = 0; k < 20; k++) {
            addAniNode = cc.instantiate(this.dajiZongPrefab);
            this.dajiZongPool.put(addAniNode);
        }

        ty.NotificationCenter.listen(double.EventType.CHANGE_GUN_TYPE, this.changeGunType, this);
    },

    changeGunType: function changeGunType(index) {
        if (double.GameWorld.weaponType == 0) {
            //枪
            this.arrowIndex = -1;
        } else {
            //弓箭
            this.arrowIndex = index;
        }
    },

    //TODO:更换击打对象的样式/碰撞区域
    changeObjectType: function changeObjectType() {
        // double.GameWorld.objectType
        this.objectSprite.spriteFrame = this.objectSpriteFrameList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)];

        double.GameWorld.objectNowLocationX = 0;
        this.moveNode.x = double.GameWorld.objectNowLocationX;
        double.GameWorld.objectNowLocationY = -this.windowHeight / 2 - 200;
        this.moveNode.y = double.GameWorld.objectNowLocationY;
        double.GameWorld.objectNowRotation = 0;
        this.rotationNode.rotation = double.GameWorld.objectNowRotation;

        this.rotationSpeed = 30;
        this.horizontalSpeed = 0;
        this.verticalSpeed = double.GameWorld.objectInitializedSpeed;

        this.node.active = true;

        this.changeGunType(double.GameWorld.doubleBowNameList.indexOf(double.GameWorld.gunType));
    },

    sendArrowForObject: function sendArrowForObject(from, direction) {
        var arrowNode;
        if (this.arrowPool.size() > 0) {
            arrowNode = this.arrowPool.get();
        } else {
            arrowNode = cc.instantiate(this.arrowPrefab);
            arrowNode.parentScene = this;
        }
        arrowNode.x = 0;
        arrowNode.y = 0;
        if (from) {
            this.rightArrowNode.addChild(arrowNode);
        } else {
            this.leftArrowNode.addChild(arrowNode);
        }
        if (this.arrowIndex == -1) {
            arrowNode.getComponent("double_arrow").reSetArrowSprite(this.gunSpriteFrame);
        } else {
            arrowNode.getComponent("double_arrow").reSetArrowSprite(this.arrowSpriteFrameList[this.arrowIndex]);
        }
        arrowNode.getComponent("double_arrow").beginSendAnimation(direction, from);
    },

    //被箭头射中
    receiveArrow: function receiveArrow(arrowNode, direction, from) {
        arrowNode.removeFromParent();
        var vec1;
        if (from) {
            vec1 = this.gunHitAniNode.convertToNodeSpace(this.rightArrowNode.convertToWorldSpace(arrowNode.position));
        } else {
            vec1 = this.gunHitAniNode.convertToNodeSpace(this.leftArrowNode.convertToWorldSpace(arrowNode.position));
        }
        arrowNode.x = vec1.x;
        arrowNode.y = vec1.y;
        arrowNode.rotation = arrowNode.rotation - this.rotationNode.rotation;
        this.gunHitAniNode.addChild(arrowNode);

        this.changeEffectFromWeaponToObject(direction);

        this.playAddScoreAnimation(from);
    },
    //被子弹射中,子弹动画
    receiveBullet: function receiveBullet(arrowNode, direction, from) {
        this.arrowPool.put(arrowNode);

        var tempPool = this[double.GameWorld.doubleObjectAniPoolList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)]];
        var tempNode;
        if (tempPool.size() > 0) {
            tempNode = tempPool.get();
            this.gunHitAniNode.addChild(tempNode);
            var ani = tempNode.getComponent(cc.Animation);
            var animation = ani.getAnimationState(ani.getClips()[0].name);
            animation.once("finished", function () {
                // tempNode.removeFromParent();
                tempPool.put(tempNode);
            });
            animation.play();
        }
        this.changeEffectFromWeaponToObject(direction);
        this.playAddScoreAnimation(from);
    },

    changeEffectFromWeaponToObject: function changeEffectFromWeaponToObject(direction) {
        this.verticalSpeed = double.GameWorld.impactForce * Math.sin(direction);
        this.horizontalSpeed = double.GameWorld.impactForce * Math.cos(direction);
        this.parentScene.receiveArrow();
    },
    playAddScoreAnimation: function playAddScoreAnimation(from) {
        // 加分动画
        var addNode;
        if (this.addScorePool.size() > 0) {
            addNode = this.addScorePool.get();
        } else {
            addNode = cc.instantiate(this.addScorePrefab);
        }
        addNode.getComponent("addScore").changeLabel();
        if (from) {
            this.rightAddScoreNode.addChild(addNode);
        } else {
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
    //TODO:爆炸动画
    gameBomb: function gameBomb() {
        if (double.GameWorld.objectType == "box") {
            //TODO:宝箱
            this.parentScene.afterObjectBomb();
            return;
        }
        if (!this[double.GameWorld.objectType]) {
            this[double.GameWorld.objectType] = cc.instantiate(this.objectPrefabList[double.GameWorld.doubleObjectList.indexOf(double.GameWorld.objectType)]);
            this[double.GameWorld.objectType].x = 0;
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
    },
    gameOver: function gameOver() {
        this.node.active = false;
        this.rotationSpeed = 0;
        this.horizontalSpeed = 0;
        this.verticalSpeed = 0;
        this.removeAllGunHitAniNodeChild();
        this.parentScene.gameOver();
    },

    removeAllGunHitAniNodeChild: function removeAllGunHitAniNodeChild() {
        var tempNodeList = this.gunHitAniNode.children;
        while (tempNodeList.length != 0) {
            tempNodeList[0].stopAction();
            this.arrowPool.put(tempNodeList[0]);
        }
        var tempNodeList2 = this.rightAddScoreNode.children;
        while (tempNodeList2.length != 0) {
            tempNodeList2[0].stopAction();
            this.addScorePool.put(tempNodeList2[0]);
        }
        var tempNodeList3 = this.leftAddScoreNode.children;
        while (tempNodeList3.length != 0) {
            tempNodeList3[0].stopAction();
            this.addScorePool.put(tempNodeList3[0]);
        }
    },

    update: function update(dt) {
        if (double.GameWorld.gameOver || double.GameWorld.gamePause) {
            return;
        }
        double.GameWorld.objectNowLocationX += this.horizontalSpeed * dt;
        this.moveNode.x = double.GameWorld.objectNowLocationX;

        this.verticalSpeed -= double.GameWorld.objectAccelerated * dt;
        double.GameWorld.objectNowLocationY += this.verticalSpeed * dt;
        this.moveNode.y = double.GameWorld.objectNowLocationY;

        double.GameWorld.objectNowRotation += this.rotationSpeed * dt;
        this.rotationNode.rotation = double.GameWorld.objectNowRotation;

        if (double.GameWorld.objectNowLocationX < -this.windowWidth || double.GameWorld.objectNowLocationX > this.windowWidth || double.GameWorld.objectNowLocationY < -this.windowHeight || double.GameWorld.objectNowLocationY > this.windowHeight) {
            //本局结束
            if (!double.GameWorld.gameLevelUp) {
                this.gameOver();
            }
        }
    },

    onDestroy: function onDestroy() {
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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=double_object.js.map
        