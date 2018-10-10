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
        nowScoreLabel : {
            default : null,
            type : cc.Label
        },
        bestScoreLabel : {
            default : null,
            type : cc.Label
        },

        bestShowButton : {
            default : null,
            type : cc.Button
        },
        rankTexture : cc.Texture2D,
        rankSpriteFrame : cc.SpriteFrame,
        rankSprite : cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    blackAction : function () {

    },
    backAction : function () {
        double.GlobalFuncs.showOrigin();
        hall.adManager.hideBannerAd();
        double.GlobalFuncs.showTitlePage();
        this.node.removeFromParent();
    },
    onLoad : function() {
        hall.GlobalFuncs.btnScaleEffect(this.bestShowButton.node,1.13);
        ty.NotificationCenter.listen(double.EventType.UPDATE_RESULT_RANK,this.updateResultInfo,this);
    },

    updateResultInfo : function () {
        double.GlobalFuncs.showOrigin();
        this.nowScoreLabel.string = double.GameWorld.totalScore+"";

        var bestScore = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_BEST_SCORE,"0");
        if(bestScore < double.GameWorld.totalScore){
            bestScore = double.GameWorld.totalScore;
            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_BEST_SCORE,bestScore);
        }
        double.GlobalFuncs.upDateRankData(bestScore);
        this.bestScoreLabel.string = "本周最佳:"+bestScore;

        this.setRankInfo();
    },
    setRankInfo : function () {
        var openDataContext = double.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 550;
        sharedCanvas.height = 300;
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

        double.GlobalFuncs.getThirdRankInfo();
    },

    showAllRank : function () {
        double.GlobalFuncs.showOrigin();
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["showAllRank"]);
        hall.adManager.hideBannerAd();
        double.GlobalFuncs.showRankList("");
    },
    playNextGame : function () {
        double.GlobalFuncs.showOrigin();
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        ty.NotificationCenter.trigger(double.EventType.GAME_START);
        this.node.removeFromParent();
    },
    showBest : function () {
        // double.AudioHelper.playEffect(double.EffectPath_mp3.doubleBtnEffect,false);
        double.Share.shareRec = false;
        double.Share.shareWithType(double.Share.onShareType.weekbestscoreshare);
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    },

    onEnable:function(){
        ctr.sxAdmanager.show();
        ctr.sxAdmanager.setPositionById(102);
    },

    onDisable:function(){
        ctr.sxAdmanager.hide();
    }

    // update (dt) {},
});
