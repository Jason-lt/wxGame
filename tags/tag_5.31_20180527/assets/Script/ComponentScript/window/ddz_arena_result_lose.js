
// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor:function () {

    },

    properties: {
        rankLable: cc.Label,
        shareBtn: cc.Button,
        onceMoreBtn: cc.Button,
        aniNode: cc.Node,
        btnBack : cc.Button
    },

    onLoad:function () {
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.backButton.node.y = backButtonH;
        //}
        ddz.matchModel.isShowingRevive = false;
        ddz.Share.isMatchShare = false;
        ty.NotificationCenter.listen("signin_fail", this.onSigninFail, this);
        ty.NotificationCenter.listen("signin_success", this.onSigninSuccess, this);
        ty.NotificationCenter.listen(ddz.EventType.RECEIVE_MATCH_WAIT_STATE, this.onMatchWait, this);
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.play('zaijiezaili');

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.btnBack.node.y = backButtonH;
        }
    },

    onSigninFail: function(value) {
        //报名失败
        //this.showTipsWindow(value.error.info, "确定");
    },

    onSigninSuccess: function() {
        //报名成功
        //this.removeAni();
        //ty.NotificationCenter.ignoreScope(this);
        //this.node.destroy();
    },

    showTipsWindow : function (tipsString, buttonStr) {
        var preFabPath = "prefabs/ddz_window_normal";
        var  comName = "ddz_window_normal";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tiString = "分享到群";
            if(buttonStr){
                tiString = buttonStr;
            }
            window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tipsString + "</c>",[{title:tiString,callFunc:function () {
                //ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
            }}]);
        });
    },

    setOverInfo: function(overInfo) {
        this.overInfo = overInfo;
        this.rankLable.string = "第" + overInfo.rank + "名";
        ddz.Share.shareKeywordReplace.arenaRanking = overInfo.rank;
        ddz.matchModel.cleanWaitInfo();
    },

    updateRankLabel: function(rankRewards) {

    },

    onClickShare: function () {
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeArenaLose);
    },

    onClickOnceMore: function() {
        ddz.matchModel.matchSignin(this.overInfo.roomId, this.overInfo.matchId, 0);
    },

    removeAni : function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        this.node.removeFromParent();
    },

    onClickBack: function() {
        this.removeAni();
        ty.NotificationCenter.ignoreScope(this);
        this.shut();
        hall.GlobalFuncs.popScene();
        ty.NotificationCenter.trigger(ddz.EventType.ARENA_BACK_TO_SCENE);
    },

    onMatchWait: function(state) {
        ddz.matchModel.onMatchWait(state);
        this.removeAni();
        ty.NotificationCenter.ignoreScope(this);
        this.node.destroy();
    },

    shut:function () {
        ddz.arenaResultPanel = null;
        this.node.destroy();
    },

    onDestroy: function() {
        ty.NotificationCenter.ignoreScope(this);
    },
    // update (dt) {},
});
