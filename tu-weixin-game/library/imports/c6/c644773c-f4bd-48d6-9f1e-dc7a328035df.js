"use strict";
cc._RF.push(module, 'c6447c89L1I1p8e3HoygDXf', 'ddz_arena_result_lose');
// Script/ComponentScript/window/ddz_arena_result_lose.js

"use strict";

// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {},

    properties: {
        rankLable: cc.Label,
        shareBtn: cc.Button,
        onceMoreBtn: cc.Button,
        aniNode: cc.Node,
        btnBack: cc.Button
    },

    onLoad: function onLoad() {
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
        if (backButtonH) {
            this.btnBack.node.y = backButtonH;
        }
    },

    onSigninFail: function onSigninFail(value) {
        //报名失败
        //this.showTipsWindow(value.error.info, "确定");
    },

    onSigninSuccess: function onSigninSuccess() {
        //报名成功
        //this.removeAni();
        //ty.NotificationCenter.ignoreScope(this);
        //this.node.destroy();
    },

    showTipsWindow: function showTipsWindow(tipsString, buttonStr) {
        var preFabPath = "prefabs/ddz_window_normal";
        var comName = "ddz_window_normal";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tiString = "邀请好友";
            if (buttonStr) {
                tiString = buttonStr;
            }
            window.setTitleContentAndButtonsString("提示", "<color=#1A6951>" + tipsString + "</c>", [{ title: tiString, callFunc: function callFunc() {
                    //ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
                } }]);
        });
    },

    setOverInfo: function setOverInfo(overInfo) {
        this.overInfo = overInfo;
        this.rankLable.string = "第" + overInfo.rank + "名";
        ddz.Share.shareKeywordReplace.arenaRanking = overInfo.rank;
        ddz.matchModel.cleanWaitInfo();
    },

    updateRankLabel: function updateRankLabel(rankRewards) {},

    onClickShare: function onClickShare() {
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeArenaLose);
    },

    onClickOnceMore: function onClickOnceMore() {
        ddz.matchModel.matchSignin(this.overInfo.roomId, this.overInfo.matchId, 0);
    },

    removeAni: function removeAni() {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        this.node.removeFromParent();
    },

    onClickBack: function onClickBack() {
        this.removeAni();
        ty.NotificationCenter.ignoreScope(this);
        this.shut();
        hall.GlobalFuncs.popScene();
        ty.NotificationCenter.trigger(ddz.EventType.ARENA_BACK_TO_SCENE);
    },

    onMatchWait: function onMatchWait(state) {
        ddz.matchModel.onMatchWait(state);
        this.removeAni();
        ty.NotificationCenter.ignoreScope(this);
        this.node.destroy();
    },

    shut: function shut() {
        ddz.arenaResultPanel = null;
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});

cc._RF.pop();