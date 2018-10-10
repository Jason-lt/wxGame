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
        backButton : {
            default : null,
            type : cc.Button
        },
        seeHolkButton : {
            default : null,
            type : cc.Button
        },
        startGameButton : {
            default : null,
            type : cc.Button
        },
        titleLabel : cc.RichText,

        rankSprite : cc.Sprite,

        texture:cc.Texture2D,
        spriteFrame:{
            default : null,
            type : cc.SpriteFrame
        },

        shareTicket : ""
    },
    backAction : function () {
        ty.NotificationCenter.trigger(snipe.EventType.UPDATE_RESULT_RANK);
        hall.LOGD(null, "backAction");
        this.node.destroy();
    },
    onBlack : function () {

    },
    useModel : function () {
    },
    // LIFE-CYCLE CALLBACKS:
    ctor : function () {
    },
    onLoad : function () {
        snipe.GlobalFuncs.drawGameCanvas();
        var backButtonH = snipe.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        var openDataContext = snipe.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 566;
        sharedCanvas.height = 1890;

        snipe.GlobalFuncs.showOrigin();
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function () {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, 1/10,1000);
        // ddz.matchModel.getRankList();
        ty.NotificationCenter.listen(snipe.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType != snipe.Share.onShareType.clickStatShareTypeRankList) {
            return;
        }
        var _config = snipe.GameWorld.gunnerShareSchemeConfig;
        if (_config){
            var reultType = snipe.Share.resultType;
            switch (reultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                default:
                    break;
            }
        }else {
            hall.MsgBoxManager.showToast({title : "可入群查看自己的排行哦~"});
        }

        snipe.Share.resultType = 0;
    },
    showRankListForShare : function () {
        // hall.LOGD("==","file = [ddz_rank] fun = [showRankListForShare] data = " + JSON.stringify(this.shareTicket));
        this.unscheduleAllCallbacks();
        var openDataContext = snipe.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        if(!this.shareTicket || this.shareTicket == ""){
            snipe.GlobalFuncs.showFriendRank();
        }else {
            snipe.GlobalFuncs.showGroupRank(this.shareTicket);
        }
        // snipe.GlobalFuncs.showGroupRank(this.shareTicket,this.rankType);
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function () {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        ty.Timer.setTimer(this, main, 1/10,1000);
    },
    changeButtonToRank : function (shareTicket) {
        this.shareTicket = shareTicket;
        this.showRankListForShare();
        if(shareTicket && shareTicket != ""){
            this.titleLabel.string = "<color=#58C0F9>群排行</c>";
            this.seeHolkButton.node.active = false;
            this.startGameButton.node.active = true;
        }else {
            this.titleLabel.string = "<color=#58C0F9>好友排行</c>";
            this.seeHolkButton.node.active = true;
            this.startGameButton.node.active = false;
        }
    },
    onRankButton : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["groupRankAtRank"]);
        var shareType = snipe.Share.onShareType.clickStatShareTypeRankList;
        snipe.Share.shareWithType(shareType);
    },
    onStartButton : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["startGameAtRank"]);
        this.hideBackButton();
        var curScene = cc.director.getScene();
        if (curScene.name == 'snipe_main'){
            ty.NotificationCenter.trigger(snipe.EventType.GAME_START,"start");
        }else {
            var sceneName = 'snipe_main';
            var onLaunched = function () {
            };
            cc.director.loadScene(sceneName,onLaunched);
        }
        this.node.destroy();
    },
    start :function() {
    },
    onDestroy : function () {
        snipe.gameModel.rankWindow = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    },
    hideBackButton : function () {
        this.backButton.node.active = false;
    },

    showBackButton : function () {
        this.backButton.node.active = true;
    }
});
