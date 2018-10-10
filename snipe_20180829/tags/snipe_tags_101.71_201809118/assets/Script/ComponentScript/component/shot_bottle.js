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
        this.bottleInfoDictionary ={};
    },

    properties: {
        windowWidth : 0,
        bottleSprite : {
            default : null,
            type : cc.Sprite
        },
        bottleSpriteList : [cc.SpriteFrame],
        bottleSpriteList1 : [cc.SpriteFrame],
        bottleSpriteList2 : [cc.SpriteFrame],
        bottleSpriteList3 : [cc.SpriteFrame],
        bottleSpriteList4 : [cc.SpriteFrame],

        type : "",
        bucket : {
            default : null
        },

        isAction : false,
        lifeCount : 0,
        sitNumber : 0,

        jugglingNodeX : 0,
        byRotation : 0,
        verticalJugglingSpeed : 0,
        horizontalJugglingSpeed : 0,
        fromRight : false
    },

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width/2;

        this.bottleInfoDictionary = {};
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.sitNumber = this.sitNumber;
    },

    //飞碟模式
    getJugglingNodeX : function () {
      return this.jugglingNodeX;
    },
    getJugglingNodeY : function () {
        return this.node.y;
    },
    setBottleOriginInformationForJuggling : function (bucket,jugglingNodeX) {
        this.bucket = bucket;
        this.jugglingNodeX = jugglingNodeX;
        this.node.x = this.jugglingNodeX;
        this.verticalJugglingSpeed = 0;
        this.horizontalJugglingSpeed = 0;
    },
    setBottleTypeForJuggling : function (type,typeConfig,originX,originY,originRotation,byRotation,fromRight) {
        this.type = type;
        this.lifeCount = snipe.GameWorld.bottleConfig[type].lifeCount;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleSprite.spriteFrame = this.bottleSpriteList[snipe.GameWorld.bottleNameList.indexOf(type)];
        this.bottleSprite.node.active = true;
        this.node.active = true;

        this.jugglingNodeX = originX;
        this.node.x = this.jugglingNodeX;
        this.node.y = originY;
        this.node.rotation = originRotation;
        this.byRotation = byRotation;
        // this.minRadius = typeConfig.minRadius;
        // this.maxRadius = typeConfig.maxRadius;
        // this.speed = typeConfig.speed;
        var radius = (hall.GlobalFuncs.getRandomNumberBefore(typeConfig.maxRadius-typeConfig.minRadius+1) + typeConfig.minRadius)*2*Math.PI/360;

        this.verticalJugglingSpeed = Math.sin(radius)*typeConfig.speed;
        this.horizontalJugglingSpeed = Math.cos(radius)*typeConfig.speed;
        this.fromRight = fromRight;

    },
    changeNodeStateForJuggling : function () {
        this.bottleSprite.node.active = true;
    },

    //正常模式
    setBottleType : function (type,bucket,height,sitNumber) {
        this.bucket = bucket;
        this.type = type;
        this.sitNumber = sitNumber;
        this.lifeCount = snipe.GameWorld.bottleConfig[type].lifeCount;
        // this.bottleInfoDictionary.bucketType = this.bucketType;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleInfoDictionary.sitNumber = this.sitNumber;
        this.bottleSprite.spriteFrame = this.bottleSpriteList[snipe.GameWorld.bottleNameList.indexOf(type)];
        this.bottleSprite.node.active = true;
        this.bottleSprite.node.y = height;
    },

    bottleHit : function (direction) {
        if(snipe.GameWorld.nowBulletPenetrate <= 0){
            return false;
        }
        if(this.lifeCount <= 0){
            return false;
        }
        snipe.GameWorld.nowBulletPenetrate --;
        this.lifeCount -= snipe.GameWorld.bulletBlood;
        this.lifeCount = this.lifeCount < 0 ? 0 : this.lifeCount;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        if(direction){
            this.bottleInfoDictionary.direction = direction;
        }
        this.bucket.receiveBottleLifeCount(this.bottleInfoDictionary,this);
        if(this.lifeCount == 0){
            snipe.AudioHelper.playEffect(snipe.EffectPath_mp3.endSmash,false);
            this.node.active = false;
        }else {
            if (snipe.GameWorld.bottleConfig[this.type].lifeCount == this.lifeCount + 1) {
                snipe.AudioHelper.playEffect(snipe.EffectPath_mp3.headSmash,false);
            }else {
                snipe.AudioHelper.playEffect(snipe.EffectPath_mp3.centerSmash,false);
            }
            this.bottleSprite.spriteFrame = this["bottleSpriteList"+this.lifeCount][snipe.GameWorld.bottleNameList.indexOf(this.type)];
        }
        return true;
        // hall.LOGW("=====","======bottleHit======"+this.lifeCount);
    },

    update : function(dt) {
        if(this.horizontalJugglingSpeed != 0){
            if(this.fromRight){
                this.jugglingNodeX -= this.horizontalJugglingSpeed*dt;
                this.node.x = this.jugglingNodeX;
                if(this.node.x < -this.windowWidth){
                    this.bucket.missBottleOne(this,this.fromRight);
                }
            }else {
                this.jugglingNodeX += this.horizontalJugglingSpeed*dt;
                this.node.x = this.jugglingNodeX;
                if(this.node.x > this.windowWidth){
                    this.bucket.missBottleOne(this,this.fromRight);
                }
            }

            this.verticalJugglingSpeed -= snipe.GameWorld.verticalAccelerate*dt;
            this.node.y += this.verticalJugglingSpeed*dt;
            this.node.rotation += this.byRotation;

        }
    },

    // afterAnimation : function () {
    //     this.isAction = false;
    // },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // start () {
    //
    // },

});
