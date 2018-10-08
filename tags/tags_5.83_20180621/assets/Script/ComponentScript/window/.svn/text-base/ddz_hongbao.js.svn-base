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
        adId:"adunit-18726a0b6953b0d2",
    },

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        var _config = ddz.gameModel.congratulationGetRedPacketConfig;
        this.chooseType = 2; // 1 分享  2 看广告
        if (!_config || _config.isType == "ads"){
            if (_config.adConfig && _config.adConfig.buttonTitle){
                var _string = hall.GlobalFuncs.replaceKeyWordInString(_config.adConfig.buttonTitle);
                this.getRedPacketText.string = "<color=#FFFFFF>"+ _string +"</c>";
            }
            if (_config.adConfig && _config.adConfig.adIds) {
                this.adId = _config.adConfig.adIds;
            }
            this.chooseType = 2;
        }else if (_config.isType == "share") {
            var _shareType = ddz.Share.onShareType.clickStatShareTypeGetRedPacket;
            this.getRedPacketText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
            if (ddz.gameModel.shareConfig[_shareType].adId){
                this.adId = ddz.gameModel.shareConfig[_shareType].adId;
            }
            this.chooseType = 1;
        }

        // if (ddz.matchResultPanel){
        //     ddz.matchResultPanel.shut();
        // }

        this.number = 0;

        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);

        this.setNumberLabel();

        var that = this;
        var ani = that.node.getComponent(cc.Animation);
        ani.play('btnTick');
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
        var _shareType;
        if (isChip) {
            this.numberLabel.string = parseInt(this.number * 10000) + "";
            this.shareIndex = 1;
            this.titleLabel.string = "奖励金币";
            this.contentLabel.string = "金币领取成功!";
            this.tipsLabel.node.active = false;
            _shareType = ddz.Share.onShareType.clickStatShareTypeWithChip;
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.withChip);
        }else {
            this.titleLabel.string = "领奖金额";
            this.contentLabel.string = "红包领取成功!";
            this.tipsLabel.node.active = true;
            this.shareIndex = 2;
            _shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.lottery);
        }
        var that = this;
        var nextCallBack = function () {
            var ani = that.node.getComponent(cc.Animation);
            ani.once('finished',function(){
                ddz.GlobalFuncs.noteToFriend('hero');
            },that);
            ani.play('hongbao');
        };
        requestAnimationFrame(nextCallBack);
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

        if (shareType != ddz.Share.onShareType.clickStatShareTypeMainTips 
            && shareType != ddz.Share.onShareType.clickStatShareTypeWithChip) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                break;
            case 2:
                hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    finishShowRewardVideo : function (isEnded) {
        if(isEnded){
            this.playAni();
        }
    },
    errorShowRewardVideo : function (parArr) {
        var adId = parArr[1];
        if(adId == this.adId){
            this.playAni();
        }
    },

    onShareDrawBtn:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeGetRedPacket;
        if (this.chooseType && this.chooseType == 2) {
            hall.adManager.showRewardedVideo(this.adId,"hongbao");
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
            this.btnRichText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle() +"</c>";
        }else {
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
        var ani = this.node.getComponent(cc.Animation);
        ani.stop();
    },

    onBackButton: function(){
        this.shut();
        this.removeAni();
        // hall.GlobalFuncs.gotoDdz();
    },

    removeAni : function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        ty.NotificationCenter.trigger(ddz.EventType.HIDE_TOP_BUTTON, true);
        this.node.removeFromParent();
    },

    shut:function () {
        ty.NotificationCenter.ignoreScope(this);
        this.stopAni();
        ddz.hongBaoPanel = null;
        this.node.destroy();
    },
});
