// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

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
        titleLabel : cc.Label,

        rankSprite : cc.Sprite,

        texture:cc.Texture2D,
        spriteFrame:{
            default : null,
            type : cc.SpriteFrame
        },

        shareTicket : ""
    },
    backAction : function () {
        jump.LOGD(null, "backAction");
        jump.AudioHelper.playEffect(jump.EffectPath_mp3.back_button_click_sound, false);
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
        jump.GlobalFuncs.drawGameCanvas();
        var backButtonH = jump.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        var openDataContext = jump.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 566;
        sharedCanvas.height = 1890;

        jump.GlobalFuncs.showOrigin();
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
        // ty.NotificationCenter.listen(jump.EventType.MSG_CUSTOM_RANK,this.onRankList,this);
    },
    showRankListForShare : function () {
        // hall.LOGD("==","file = [ddz_rank] fun = [showRankListForShare] data = " + JSON.stringify(this.shareTicket));
        this.unscheduleAllCallbacks();
        var openDataContext = jump.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        if(this.shareTicket == ""){
            jump.GlobalFuncs.showFriendRank();
        }else {
            jump.GlobalFuncs.showGroupRank(this.shareTicket);
        }
        // jump.GlobalFuncs.showGroupRank(this.shareTicket,this.rankType);
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
            this.titleLabel.string = "群排行";
            this.seeHolkButton.node.active = false;
            this.startGameButton.node.active = true;
        }else {
            this.titleLabel.string = "好友排行";
            this.seeHolkButton.node.active = true;
            this.startGameButton.node.active = false;
        }
    },
    onRankButton : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["groupRankAtRank"]);
        var shareType = jump.Share.onShareType.clickStatShareTypeRankList;
        jump.Share.shareWithType(shareType);
    },
    onStartButton : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["startGameAtRank"]);
        this.hideBackButton();
        var curScene = cc.director.getScene();
        if (curScene.name == "jump_main"){
            ty.NotificationCenter.trigger(jump.EventType.GAME_RESTART,"start");
        }else {
            var sceneName = 'jump_main';
            var onLaunched = function () {
            };
            cc.director.loadScene(sceneName,onLaunched);
        }
        this.node.destroy();
    },
    start :function() {
    },
    onDestroy : function () {
        jump.gameModel.rankWindow = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    },
    hideBackButton : function () {
        this.backButton.node.active = false;
    },

    showBackButton : function () {
        this.backButton.node.active = true;
    }

    // update (dt) {},
});
