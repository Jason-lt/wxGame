
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
        rankOuter: cc.Label,
        shareBtn: cc.Button,
        onceMoreBtn: cc.Button,
        aniNode: cc.Node,
        twoRewardsArea: cc.Node,
        oneRewardArea: cc.Node,
        reward1: cc.Node,
        reward2: cc.Node,
        reward0: cc.Node,
        btnBack : cc.Button
    },

    onLoad:function () {
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.backButton.node.y = backButtonH;
        //}
        ddz.matchModel.isShowingRevive = false;
        //ty.NotificationCenter.listen("signin_fail", this.onSigninFail, this);
        ty.NotificationCenter.listen("signin_success", this.onSigninSuccess, this);
        ty.NotificationCenter.listen(ddz.EventType.RECEIVE_MATCH_WAIT_STATE, this.onMatchWait, this);
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.play('qiansan');

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.btnBack.node.y = backButtonH;
        }
    },

    setOverInfo: function(overInfo) {
        this.overInfo = overInfo;
        this.rankLable.string = overInfo.rank;
        this.rankOuter.string = overInfo.rank >= 10 ? '第    名' : '第   名';
        var rewards = overInfo.rewards;
        if(rewards) {
            if(rewards.length == 1) {
                this.twoRewardsArea.active = false;
                this.oneRewardArea.active = true;
                var sr = this.reward0.getComponent("SingleReward");
                sr.setRewardInfo(rewards[0]);
            }

            if(rewards.length >=2 ) {
                this.twoRewardsArea.active = true;
                this.oneRewardArea.active = false;
                var sr1 = this.reward1.getComponent("SingleReward");
                sr1.setRewardInfo(rewards[0]);
                var sr2 = this.reward2.getComponent("SingleReward");
                sr2.setRewardInfo(rewards[1]);
            }
        }
        ddz.matchModel.cleanWaitInfo();
    },

    onSigninFail: function(value) {
        //报名失败
        this.showTipsWindow(value.error.info, "确定");
    },

    showTipsWindow : function (tipsString, buttonStr) {
        var preFabPath = "prefabs/ddz_window_normal";
        var  comName = "ddz_window_normal";
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tiString = "分享到群";
            if(buttonStr){
                tiString = buttonStr;
            }
            window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tipsString + "</c>",[tiString]);
            window.centerCallFunc = function () {
                //ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
            };
        });
    },

    onSigninSuccess: function() {
        //报名成功
        //this.removeAni();
        //ty.NotificationCenter.ignoreScope(this);
        //this.node.destroy();
    },

    onClickShare: function () {
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeArenaWin);
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
        this.node.destroy();
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
        this.node.destroy();
    },

    onDestroy: function() {
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});
