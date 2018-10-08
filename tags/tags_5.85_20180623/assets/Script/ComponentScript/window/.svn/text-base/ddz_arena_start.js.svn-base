
// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor:function () {

    },

    properties: {
        progressNode: cc.Node,
    },

    onLoad:function () {
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.backButton.node.y = backButtonH;
        //}
        ty.NotificationCenter.listen(ddz.EventType.ACTION_CHALLENGE, this.delayDestroy, this);
    },

    showArenaStageProgress: function(stages, curStage, playani) {
        var scr = this.progressNode.getComponent("MatchRankProgressScript");
        scr.initWithPars(stages, curStage, playani);
    },

    delayDestroy: function() {
        ty.Timer.setTimer(this, this.shutSelf, 0.05, 1, 0);
    },

    shutSelf: function() {
        ty.Timer.cancelTimer(this, this.shutSelf);
        ty.NotificationCenter.ignoreScope(this);
        this.node && this.node.destroy();
    },

    shut:function () {
        this.node.destroy();
    },

    onDestroy: function() {
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});
