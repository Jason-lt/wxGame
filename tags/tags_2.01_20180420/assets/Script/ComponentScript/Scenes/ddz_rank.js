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
        spriteFrame:cc.SpriteFrame
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        cc.director.loadScene(sceneName);
    },
    useModel : function () {
    },
    // LIFE-CYCLE CALLBACKS:
    ctor : function () {
    },
    onLoad : function () {
        hall.LOGE("","=========rank======onLoad==========");
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        var bottomWin = this.rankList.getComponent("ddz_rank_list");
        bottomWin.parentScene = this;

        wx.updateShareMenu({
            withShareTicket: true
        });

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
        // ddz.matchModel.getRankList();
        // ty.NotificationCenter.listen(ddz.EventType.MSG_CUSTOM_RANK,this.onRankList,this);
    },
    showRankListForShare : function (data) {
        this.unscheduleAllCallbacks();
        var openDataContext = ddz.GlobalFuncs.getOpenData();
        if(!openDataContext){
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        if(data){
            ddz.GlobalFuncs.showGroupRank(data);
        }else {
            ddz.GlobalFuncs.showFriendRank();
        }
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
        this.showRankListForShare(shareTicket);
        var bottomWin = this.rankList.getComponent("ddz_rank_list");
        bottomWin.changeButtonToRank();
    },

    // onRankList : function (argument) {
    //     var result = argument.result.tabs[0];
    //     if(result && result.rankDatas && result.rankDatas.length > 0){
    //         var rankData = result.rankDatas;
    //         var bottomWin = this.rankList.getComponent("ddz_rank_list");
    //         bottomWin.setOrigData(rankData);
    //         bottomWin.parentScene = this;
    //     }else {
    //         var bottomWin = this.rankList.getComponent("ddz_rank_list");
    //         bottomWin.setOrigData([]);
    //         bottomWin.parentScene = this;
    //     }
    // },

    start :function() {
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        wx.updateShareMenu({
            withShareTicket: false
        });
        this.unscheduleAllCallbacks();
    },
    hideBackButton : function () {
        this.backButton.node.active = false;
    }

    // update (dt) {},
});
