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
        rankList : {
            default : null,
            type : cc.Node
        },
        backButton : {
            default : null,
            type : cc.Button
        },
        rankSprite : cc.Sprite,

        texture:cc.Texture2D,
        spriteFrame:{
            default : null,
            type : cc.SpriteFrame
        },
        rankType: 'chip',

        treasureSelectedSprite : cc.Sprite,
        bonusSelectedSprite : cc.Sprite,
        shareTicket : "",
        titleLabel : {
            default : null,
            type : cc.RichText
        },
        titleLabel2 : {
            default : null,
            type : cc.RichText
        },
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        hall.GlobalFuncs.popScene();
    },
    onTreasureButton : function () {
        if(this.rankType == 'chip'){
            return;
        }
        this.rankType = 'chip';
        this.treasureSelectedSprite.node.active = true;
        this.bonusSelectedSprite.node.active = false;
        this.titleLabel.string = "<color=#ffffff>财富榜</c>";
        this.titleLabel2.string = "<color=#9C7343>奖金榜</c>";
        ddz.GlobalFuncs.showOrigin();
        this.showRankListForShare();
    },
    onBonusButton : function () {
        if(this.rankType == 'sumReward'){
            return;
        }
        this.rankType = 'sumReward';
        this.treasureSelectedSprite.node.active = false;
        this.bonusSelectedSprite.node.active = true;
        this.titleLabel.string = "<color=#9C7343>财富榜</c>";
        this.titleLabel2.string = "<color=#ffffff>奖金榜</c>";
        ddz.GlobalFuncs.showOrigin();
        this.showRankListForShare();
    },
    useModel : function () {
    },
    // LIFE-CYCLE CALLBACKS:
    ctor : function () {
    },
    onLoad : function () {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        var bottomWin = this.rankList.getComponent("ddz_rank_list");
        bottomWin.parentScene = this;

        this.treasureSelectedSprite.node.active = true;
        this.bonusSelectedSprite.node.active = false;
        this.titleLabel.string = "<color=#ffffff>财富榜</c>";
        this.titleLabel2.string = "<color=#9C7343>奖金榜</c>";
        var openDataContext = ddz.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 530;
        sharedCanvas.height = 1890;

        ddz.GlobalFuncs.showOrigin();
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
    },
    showRankListForShare : function (data) {
        hall.LOGD("==","file = [ddz_rank] fun = [showRankListForShare] data = " + JSON.stringify(this.shareTicket));
        this.unscheduleAllCallbacks();
        var openDataContext = ddz.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        if(this.shareTicket == ""){
            ddz.GlobalFuncs.showFriendRank(this.shareTicket,this.rankType);
        }else {
            ddz.GlobalFuncs.showGroupRank(this.shareTicket,this.rankType);
        }
        // ddz.GlobalFuncs.showGroupRank(this.shareTicket,this.rankType);
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
        var bottomWin = this.rankList.getComponent("ddz_rank_list");
        bottomWin.changeButtonToRank();
    },

    start :function() {
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        // wx.updateShareMenu({
        //     withShareTicket: false
        // });
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
