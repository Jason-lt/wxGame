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

    properties: {
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
        bottleInfoDictionary : {}
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        this.bottleInfoDictionary = {};
        this.lifeCount = 0;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
    },

    setBottleType : function (type,bucket,height,sitNumber) {
        this.bucket = bucket;
        this.type = type;
        this.sitNumber = sitNumber;
        this.lifeCount = shot.GameWorld.bottleConfig[type].lifeCount;
        this.bottleInfoDictionary.bucketType = this.bucketType;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleInfoDictionary.sitNumber = this.sitNumber;
        this.bottleSprite.spriteFrame = this.bottleSpriteList[shot.GameWorld.bottleNameList.indexOf(type)];
        this.bottleSprite.node.active = true;
        this.bottleSprite.node.y = height;
    },

    bottleHit : function (direction) {
        if(shot.GameWorld.nowBulletPenetrate <= 0){
            return false;
        }
        if(this.lifeCount <= 0){
            return false;
        }
        if(this.isAction){
            return false;
        }
        shot.GameWorld.nowBulletPenetrate --;
        this.isAction = true;
        this.lifeCount -= shot.GameWorld.bulletBlood;
        this.lifeCount = this.lifeCount < 0 ? 0 : this.lifeCount;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        if(direction){
            this.bottleInfoDictionary.direction = direction;
        }
        this.bucket.receiveBottleLifeCount(this.bottleInfoDictionary);
        if(this.lifeCount == 0){
            shot.AudioHelper.playEffect(shot.EffectPath_mp3.endSmash,false);
            this.node.active = false;
        }else {
            if (shot.GameWorld.bottleConfig[this.type].lifeCount == this.lifeCount + 1) {
                shot.AudioHelper.playEffect(shot.EffectPath_mp3.headSmash,false);
            }else {
                shot.AudioHelper.playEffect(shot.EffectPath_mp3.centerSmash,false);
            }
            this.bottleSprite.spriteFrame = this["bottleSpriteList"+this.lifeCount][shot.GameWorld.bottleNameList.indexOf(this.type)];
        }
        return true;
        // hall.LOGW("=====","======bottleHit======"+this.lifeCount);
    },

    afterAnimation : function () {
        this.isAction = false;
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // start () {
    //
    // },

    // update (dt) {},
});
