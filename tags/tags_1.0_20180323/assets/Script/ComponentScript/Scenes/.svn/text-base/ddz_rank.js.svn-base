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
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        cc.director.loadScene(sceneName);
    },
    useModel : function () {
        // ddz.LOGD(null, "backActionbackActionbackActionbackAction");
    },
    // LIFE-CYCLE CALLBACKS:
    ctor : function () {
        // ddz.GlobalFuncs.drawGameCanvas();
    },
    onLoad : function () {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        ddz.matchModel.getRankList();
        ty.NotificationCenter.listen(ddz.EventType.MSG_CUSTOM_RANK,this.onRankList,this);
    },
    onRankList : function (argument) {
        var result = argument.result.tabs[0];
        if(result && result.length > 0){
            var rankData = result.rankDatas;
            var bottomWin = this.rankList.getComponent("ddz_rank_list");
            bottomWin.setOrigData(rankData);
        }else {
            var bottomWin = this.rankList.getComponent("ddz_rank_list");
            bottomWin.setOrigData([]);
        }
    },

    start :function() {
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

    // update (dt) {},
});
