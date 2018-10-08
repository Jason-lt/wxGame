"use strict";
cc._RF.push(module, 'c739ec/KeZH6rmZN1rbc6yw', 'ddz_arena_result_win');
// Script/ComponentScript/window/ddz_arena_result_win.js

'use strict';

// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {},

    properties: {
        rankLable: cc.Label,
        rankLable_2: cc.Label,
        rankOuter: cc.Label,
        shareBtn: cc.Button,
        onceMoreBtn: cc.Button,
        aniNode: cc.Node,
        twoRewardsArea: cc.Node,
        oneRewardArea: cc.Node,
        reward1: cc.Node,
        reward2: cc.Node,
        reward0: cc.Node,
        btnBack: cc.Button
    },

    onLoad: function onLoad() {
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.backButton.node.y = backButtonH;
        //}
        ddz.matchModel.isShowingRevive = false;
        ddz.Share.isMatchShare = false;
        //ty.NotificationCenter.listen("signin_fail", this.onSigninFail, this);
        ty.NotificationCenter.listen("signin_success", this.onSigninSuccess, this);
        ty.NotificationCenter.listen(ddz.EventType.RECEIVE_MATCH_WAIT_STATE, this.onMatchWait, this);
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.play('qiansan');

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.btnBack.node.y = backButtonH;
        }
    },

    setOverInfo: function setOverInfo(overInfo) {
        this.overInfo = overInfo;
        ddz.Share.shareKeywordReplace.arenaRanking = overInfo.rank;
        if (overInfo.rank <= 3) {
            this.rankLable.node.active = true;
            this.rankLable_2.node.active = false;
            this.rankLable.string = overInfo.rank;
        } else {
            this.rankLable.node.active = false;
            this.rankLable_2.node.active = true;
            this.rankLable_2.string = overInfo.rank;
        }
        this.rankOuter.string = overInfo.rank >= 10 ? '第    名' : '第   名';
        var rewards = overInfo.rewards;
        if (rewards) {
            if (rewards.length == 1) {
                this.twoRewardsArea.active = false;
                this.oneRewardArea.active = true;
                var sr = this.reward0.getComponent("SingleReward");
                sr.setRewardInfo(rewards[0]);
            }

            if (rewards.length >= 2) {
                this.twoRewardsArea.active = true;
                this.oneRewardArea.active = false;
                var sr1 = this.reward1.getComponent("SingleReward");
                sr1.setRewardInfo(rewards[0]);
                var sr2 = this.reward2.getComponent("SingleReward");
                sr2.setRewardInfo(rewards[1]);
            }

            if (overInfo.rank == 1) {
                var rwd;
                for (var i = 0; i < rewards.length; i++) {
                    rwd = rewards[i];
                    if (rwd.icon = 'user:coupon') {
                        //夺冠,通知好友
                        ddz.GlobalFuncs.noteToFriend('arena', parseInt(rwd.count / 100));
                    }
                }
            }
        }
        ddz.matchModel.cleanWaitInfo();
    },

    onSigninFail: function onSigninFail(value) {
        //报名失败
        this.showTipsWindow(value.error.info, "确定");
    },

    showTipsWindow: function showTipsWindow(tipsString, buttonStr) {
        var preFabPath = "prefabs/ddz_window_normal";
        var comName = "ddz_window_normal";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tiString = "分享";
            if (buttonStr) {
                tiString = buttonStr;
            }
            window.setTitleContentAndButtonsString("提示", "<color=#1A6951>" + tipsString + "</c>", [{ title: tiString, callFunc: function callFunc() {
                    //ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
                } }]);
        });
    },

    onSigninSuccess: function onSigninSuccess() {
        //报名成功
        //this.removeAni();
        //ty.NotificationCenter.ignoreScope(this);
        //this.node.destroy();
    },

    onClickShare: function onClickShare() {
        var ranking = this.overInfo.rank;
        if (ranking == 1) {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeMatchFirst);
        } else if (ranking == 2) {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeMatchSecond);
        } else if (ranking == 3) {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeMatchThird);
        } else {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeArenaWin);
        }
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