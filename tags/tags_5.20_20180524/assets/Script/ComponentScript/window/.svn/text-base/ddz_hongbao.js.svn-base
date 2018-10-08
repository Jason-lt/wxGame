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
        btnRichText:cc.RichText,
        numberLabel:cc.Label,
        backButton : cc.Button,
    },

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        
        var _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";

        if (ddz.matchResultPanel){
            ddz.matchResultPanel.shut();
        }

        var ani = this.getComponent(cc.Animation);
        ani.once('finished',function(){
        },this);
        ani.play('hongbao');

        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.lottery);
    },

    setNumberLabel:function(){
        var _curOverInfo = ddz.matchModel.getCurOverInfo();
        var m_count = _curOverInfo.mcount;
        if (m_count && m_count.length > 0) {
            for (var i = 0; i < m_count.length; i++) {
                if (m_count[i].icon == "user:coupon") {
                    this.numberLabel.string = m_count[i].count/100;
                    ddz.Share.shareKeywordReplace.curBonusOnly = m_count[i].count/100;
                    ddz.LOGD("","file = [ddz_hongbao] fun = [setNumberLabel] ddz.Share.shareKeywordReplace.curBonusOnly = " + ddz.Share.shareKeywordReplace.curBonusOnly);
                    return
                }
            }
        }
    },

    addTipsWindow : function (tips) {
        var _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        var _string = hall.GlobalFuncs.getButtonTitle(_shareType);
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :_string,
                    bottomType : 0
                }
            ];
            window.setTitleContentAndButtons("提示",tips, testArray);
        });
    },

    onClickCenterButton:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        ddz.Share.shareWithType(shareType);
    },

    playAnimationAfterShareWithType : function (shareType) {
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeMainTips) {
            return;
        }
        // ddz.gameModel.checkShareReward(ddz.Share.SharePointType.lottery);
        // var type = ddz.Share.resultType;
        // hall.LOGW("=="," file = [ddz_hongbao] fun = [playAnimationAfterShareWithType] type = " + type);
        // switch (type){
        //     case 1:
        //         //TODO:分享到微信群才能领取奖励哦
        //         var tips = "只有分享到微信群才能领取奖励哦";
        //         this.addTipsWindow(tips);
        //         break;
        //     case 2:
        //         var tips = "这个群已经分享过啦，分享到其他群吧";
        //         this.addTipsWindow(tips);
        //         break;
        //     case 3:
        //         break;
        //     default:
        //         break;
        // }
        // ddz.Share.resultType = 0;
    },

    updateButtonText:function(data){
        if (data.pointId != ddz.Share.SharePointType.lottery){
            return;
        }
        hall.LOGW("=="," file = [ddz_hongbao] fun = [updateButtonText] diamond = " + data.leftCount);
        var _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        if (!data.leftCount || data.leftCount <= 0) {
            // titileS = "<color=#FFFFFF>分享到群</c>";
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle() +"</c>";
        }else {
            // titileS = "<color=#FFFFFF>分享到群</c><img src='dda_button_diamond' height=34 width=42/><color=#FFFFFF>+1</c>";
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        }
    },

    onClickShareBtn:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        ddz.Share.shareWithType(shareType);
    },

    stopAni:function(){
        var ani = this.getComponent(cc.Animation);
        ani.stop();
    },

    onBackButton: function(){
        this.shut();
        this.removeAni();
        hall.GlobalFuncs.gotoDdz();
    },

    removeAni : function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        this.node.removeFromParent();
    },

    shut:function () {
        this.stopAni();
        ddz.hongBaoPanel = null;
        ty.NotificationCenter.ignoreScope(this);
        this.node.destroy();
    },
});
