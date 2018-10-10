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
        scoreLabel : {
            default : null,
            type : cc.Label
        },

        resurgenceButton : {
            default : null,
            type : cc.Button
        },

        rankTexture : cc.Texture2D,
        rankSpriteFrame : cc.SpriteFrame,
        rankSprite : cc.Sprite,

        openType : ""
    },

    // LIFE-CYCLE CALLBACKS:


    blackAction : function () {

    },
    backAction : function () {

    },
    onLoad : function() {
        hall.GlobalFuncs.btnScaleEffect(this.resurgenceButton.node,1.13);
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        // this.setRankNextInfo();
    },

    setRankNextInfo : function () {
        double.GlobalFuncs.showOrigin();
        this.openType = double.GlobalFuncs.getRewardOpenType("resurgence");

        this.scoreLabel.string = double.GameWorld.totalScore+"";


        var openDataContext = double.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 584;
        sharedCanvas.height = 110;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        var main = function () {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, 1/10,5000);

        double.GlobalFuncs.getNextRankInfo();
    },

    justNowAction : function () {
        double.GlobalFuncs.showOrigin();
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        double.GlobalFuncs.showGameOverResult();
        this.node.removeFromParent();
    },
    resurgenceAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        if(this.openType == "share"){
            if(ty.UserInfo.isInBSGS){
                double.Share.shareWithType(double.Share.onShareType.resurgenceshare);
            }else {
                double.Share.shareWithType(double.Share.onShareType.unbsgsresurgenceshare);
            }
        // }else if(this.openType == "ad"){
        //
        // }else if(this.openType == "checkBox"){
        }else {
          this.resurgenceDoAction();
        }
    },
    resurgenceDoAction : function () {
        double.GlobalFuncs.showOrigin();
        ty.NotificationCenter.trigger(double.EventType.GAME_START,true);
        this.node.removeFromParent();
    },
    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && (shareType == double.Share.onShareType.resurgenceshare || shareType == double.Share.onShareType.unbsgsresurgenceshare)) {
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                    break;
                case 3:
                    this.resurgenceDoAction();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
                default:
                    hall.MsgBoxManager.showToast({title : '分享失败了'+resultType});
                    break;
            }
            double.Share.resultType = 0;
        }
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
