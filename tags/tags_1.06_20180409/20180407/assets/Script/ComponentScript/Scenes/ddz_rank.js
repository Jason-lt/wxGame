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

        testPrafab : {
            default : null,
            type : cc.Prefab
        },
        testPrafab2 : {
            default : null,
            type : cc.Prefab
        },
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

        this.showRankListForShareOrigin();
        ty.NotificationCenter.listen(ddz.EventType.CHANGE_TO_SHOW_FROM_HODE, this.showRankListForShareOrigin, this);

        // ddz.matchModel.getRankList();
        // ty.NotificationCenter.listen(ddz.EventType.MSG_CUSTOM_RANK,this.onRankList,this);

        // // // //TODO:TEST
        // var tipsW = cc.instantiate(this.testPrafab);
        // this.node.addChild(tipsW);
        // var window = tipsW.getComponent("ddz_buttonList");
        // window.parentScene = this;
        // var testArray =
        //     [{title :"微信邀请好友", bottomType : 1},
        //         {title :"分享战绩", bottomType :1}];
        // window.setButtonListWithButtons(testArray);
    },
    // onTopButtonAction : function () {
    //     //TODO:微信邀请好友的图片
    //     var shareString = "经典玩法,6局,地主封顶32分,快来和我一起玩!";
    //     ty.TuyooSDK.shareWithInformation(shareString,ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/4.png');
    // },
    // onTempButtonAction : function () {
    //     var sceneName = 'SceneTest';
    //     cc.director.loadScene(sceneName);
    // },
    // //TODO:endTest
    //
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
    showRankListForShareOrigin : function () {
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width  = 530;
        sharedCanvas.height = 1890;
        ddz.GlobalFuncs.showOrigin();
        //
        // if(data){
        //     ddz.GlobalFuncs.showGroupRank(data);
        // }else {
        //     ddz.GlobalFuncs.showFriendRank();
        // }
        var texture = new cc.Texture2D();
        var spriteFrame = new cc.SpriteFrame(texture);

        var sprite = this.rankSprite;
        // sprite.spriteFrame = spriteFrame;
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
        if(data){
            ddz.GlobalFuncs.showGroupRank(data);
        }else {
            ddz.GlobalFuncs.showFriendRank();
        }
    },
    changeButtonToRank : function (shareTicket) {
        this.showRankListForShare(shareTicket);
        var bottomWin = this.rankList.getComponent("ddz_rank_list");
        bottomWin.changeButtonToRank();
    },

    start :function() {
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        wx.updateShareMenu({
            withShareTicket: false
        });
        ddz.GlobalFuncs.showOrigin();
        ty.Timer.cancelTimer(this, main);
    },
    hideBackButton : function () {
        this.backButton.node.active = false;
    },

    // update (dt) {},
});
