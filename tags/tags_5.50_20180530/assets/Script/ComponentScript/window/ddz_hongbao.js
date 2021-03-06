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
        numLabel:cc.Label,
        backButton : cc.Button,
        button : cc.Button,
        ddz_hb_coos : cc.Node,
        ddz_redPacket : cc.Node,
        ddz_getRedPacket : cc.Node,

        titleLabel : cc.Label,
        contentLabel : cc.Label,
        tipsLabel : cc.Label,
        getRedPacketText:cc.RichText,
    },

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        
        var _shareType = ddz.Share.onShareType.clickStatShareTypeGetRedPacket;
        this.getRedPacketText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        this.adId = ddz.gameModel.shareConfig[_shareType].adId;

        if (ddz.matchResultPanel){
            ddz.matchResultPanel.shut();
        }

        this.number = 0;

        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);

        this.setNumberLabel();

        var that = this;
        this.scheduleOnce(function () {
            var ani = that.node.getComponent(cc.Animation);
            ani.play('btnTick');
        }, 1);
    },

    setNumberLabel:function(){
        var _curOverInfo = ddz.matchModel.getCurOverInfo();
        var m_count = _curOverInfo.mcount;
        if (m_count && m_count.length > 0) {
            for (var i = 0; i < m_count.length; i++) {
                if (m_count[i].icon == "user:coupon") {
                    this.number = m_count[i].count/100;
                    this.numberLabel.string = this.number;
                    this.numLabel.string = this.number;
                    ddz.Share.shareKeywordReplace.curBonusOnly = this.number;
                    ddz.Share.shareKeywordReplace.curBonusOnlyChip = parseInt(this.number * 10000);
                    return
                }
            }
        }
    },

    playAni : function (isChip) {
        this.button.node.active = true;
        this.ddz_hb_coos.active = true;
        this.ddz_redPacket.active = true;
        this.ddz_getRedPacket.active = false;
        if (isChip) {
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.withChip);
            this.numberLabel.string = parseInt(this.number * 10000) + "";
            this.shareIndex = 1;
            this.titleLabel.string = "奖励金币";
            this.contentLabel.string = "金币领取成功!";
            this.tipsLabel.node.active = false;

            var _shareType = ddz.Share.onShareType.clickStatShareTypeWithChip;
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        }else {

            this.titleLabel.string = "领奖金额";
            this.contentLabel.string = "红包领取成功!";
            this.tipsLabel.node.active = true;
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.lottery);
            this.shareIndex = 2;

            var _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        }
        var ani = this.getComponent(cc.Animation);
        ani.once('finished',function(){
        },this);
        ani.play('hongbao');
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
        // 分享领取通关红包
        if (shareType && shareType == ddz.Share.onShareType.clickStatShareTypeGetRedPacket) {
            this.playAni();
        }else if (shareType && shareType == ddz.Share.onShareType.clickStatShareTypeMainTips) {
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.lottery);
        }else if (shareType && shareType == ddz.Share.onShareType.clickStatShareTypeWithChip) {
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.withChip);
        }

        // var type = ddz.Share.resultType;
        // hall.LOGW("=="," file = [ddz_hongbao] fun = [playAnimationAfterShareWithType] type = " + type);
        // switch (type){
        //     case 1:
        //         //
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

    finishShowRewardVideo : function (adId) {
        ddz.LOGD("","file = [ddz_hongbao] fun = [finishShowRewardVideo]");
        if(adId == this.adId){
            this.playAni();
        }
    },
    errorShowRewardVideo : function (errMsg) {
        ddz.LOGD("","file = [ddz_hongbao] fun = [errorShowRewardVideo]");
        this.playAni();
    },

    onShareDrawBtn:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeGetRedPacket;
        var chooseType = ddz.gameModel.shareConfig[shareType].chooseType; // 1 分享  2 看广告
        if (chooseType && chooseType == 2) {
            hall.adManager.showRewardedVideo(this.adId);

        }else {
            ddz.Share.shareWithType(shareType);
        }
    },

    onAbandonBtn:function(){
        if (Number(this.number) > 0) {
            ddz.gameModel.getCashCoin(parseInt(this.number*100));
        }
        this.playAni(true);
    },

    updateButtonText:function(data){
        if (data.pointId != ddz.Share.SharePointType.lottery ||
            data.pointId != ddz.Share.SharePointType.withChip ){
            return;
        }
        hall.LOGW("=="," file = [ddz_hongbao] fun = [updateButtonText] diamond = " + data.leftCount);
        var _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        if (this.shareIndex == 1) {
            _shareType = ddz.Share.onShareType.clickStatShareTypeWithChip;
        }else if(this.shareIndex == 2) {
            _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        }
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
        if (this.shareIndex == 1) {
            shareType = ddz.Share.onShareType.clickStatShareTypeWithChip;
        }else if(this.shareIndex == 2) {
            shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        }
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
