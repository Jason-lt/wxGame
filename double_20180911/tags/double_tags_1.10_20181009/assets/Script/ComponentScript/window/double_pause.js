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

    },

    blackAction : function () {

    },
    backAction : function () {

    },
    mainPageAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        ty.NotificationCenter.trigger(double.EventType.GAME_OVER);
        hall.adManager.hideBannerAd();
        double.GlobalFuncs.showTitlePage();
        this.node.removeFromParent();
    },
    continueAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        this.node.removeFromParent();
        double.GameWorld.gamePause = false;
        ty.NotificationCenter.trigger(double.EventType.GAME_CONTINUE);
    },
    shareAction : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        double.Share.shareRec = false;
        double.Share.shareWithType(double.Share.onShareType.gamestopbottonshare);
    },
    onLoad : function() {

    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
