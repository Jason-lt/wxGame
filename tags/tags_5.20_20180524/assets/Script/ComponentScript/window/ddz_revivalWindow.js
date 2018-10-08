
cc.Class({
    extends: cc.Component,

    properties: {
        backBg : {
            default : null,
            type  : cc.Button
        },
        titleLabel : cc.Label,
        contentRichText : cc.RichText,
        centerButton : cc.Button,
        centerRichText : cc.RichText,
        ignoreButton : cc.Button,
        ignoreRichText : cc.RichText,
        //
        // isGreenHand : false, //是否是新手复活
        // isOnShare : false, //是否处于分享状态
        // isWin : false
        matchName : "",
        failCondition : null,

        matchDes : null,
        sharePoint : "",

        conditionType : "",
        requestCount : 1,
        nowCount : 0,

        adIds : [],
        nowAdId : ''

    },

// {
//     "failCountMin": 2,
//     "failCountMax": 4,
//     "resurgenceCondition": {
//     "conditionType": "share",
//         "requestCount": 1
// },
//     "title": "提示",
//     "content": "晋级失败\n分享游戏给朋友即可免费复活",
//     "buttonText1": "分享",
//     "buttonText2": "点击放弃>"
// },
    setContentWithFailCondition : function (failCondition,matchName) {
        this.failCondition = failCondition;
        this.matchName = matchName;
        this.conditionType = failCondition.resurgenceCondition.conditionType;
        this.requestCount = failCondition.resurgenceCondition.requestCount;
        ddz.Share.shareKeywordReplace.repeatNumber = this.requestCount;
        this.nowCount = 0;
        ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
        this.adIds = failCondition.resurgenceCondition.adIds;
        this.titleLabel.string = failCondition.title || "提示";
        var contentString = hall.GlobalFuncs.replaceKeyWordInString(failCondition.content);
        this.contentRichText.string = "<color=#1A6951>"+contentString+"</c>";
        var centerString = hall.GlobalFuncs.replaceKeyWordInString(failCondition.buttonText1);
        this.centerRichText.string = "<color=#FFFFFF>"+centerString+"</c>";
        this.ignoreRichText.string = "<color=#1A6951>"+failCondition.buttonText2+"</c>";

        if(this.matchName == "arena"){
            this.setMatchInfo();
            var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(ddz.matchModel._curWaitInfo.matchId);
            this.matchDes = matchDes;
        }
    },

// * @param matchDes
// * @param stageIndex
// */
    setMatchInfo: function() {
        var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(ddz.matchModel._curWaitInfo.matchId);
        this.matchDes = matchDes;
        this.stageIndex = ddz.matchModel.getCurWaitInfo().stageIndex;
        var curArenaConfig = ddz.gameModel.getArenaMatchConfigJson()[this.matchDes.matchId.toString()];
        var sharePointValue = curArenaConfig["reviveSharePoint"];
        this.sharePoint = sharePointValue;
        // var leftCount = ddz.ShareRecord[this.sharePoint.toString()] && ddz.ShareRecord[this.sharePoint.toString()].leftCount;
        for(var i in this.matchDes.stages) {
            if(this.matchDes.stages[i].index == this.stageIndex) {
                var stage = this.matchDes.stages[i];
                if(stage.canBack == 1) {
                    this.feeCount = stage.backFeeCount;
                    this.shareRewardOnceCount = 1;
                    if(curArenaConfig["shareRewardOnce"]["type"] == 'diamond') {
                        this.shareRewardOnceCount = curArenaConfig["shareRewardOnce"]["count"];
                    }
                    this.getRewardCount = Math.ceil(this.feeCount/this.shareRewardOnceCount);
                } else {
                    hall.LOGD("arena revive","something error");
                }
            }
        }
    },

    onLoad : function () {
        ddz.matchModel.isShowingMatchRevivalPanel = true;
        var animation = this.getComponent(cc.Animation);
        animation.play('tipsWindowNode');
        ty.NotificationCenter.listen(ddz.EventType.ARENA_SEND_MATCH_BACK, this.close, this);

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
    },

    playAnimationAfterShareWithType : function (type) {
        this.isOnShare = false;
        var reultType = ddz.Share.resultType;
        hall.LOGW("=====", "=======playAnimationAfterShareWithType======="+reultType);
        switch (reultType) {
            case 1:
                if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                    this.nowCount ++;
                    this.getDiamondToRevival();
                    return;
                }else {
                    hall.MsgBoxManager.showToast({title:"分享到群才有效哦"});
                }
                break;
            case 2:
                if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                    this.nowCount ++;
                    this.getDiamondToRevival();
                    return;
                }else {
                    hall.MsgBoxManager.showToast({title:"分享到不同的群才有效哦"});
                }
                break;
            case 3:
                this.nowCount ++;
                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
        this.getDiamondToRevival();
    },

    finishShowRewardVideo : function (adId) {
        hall.LOGW("=====","==================="+adId);
        this.isOnShare = false;
        if(adId == this.nowAdId){
            this.nowCount ++;
            this.getDiamondToRevival();
        }
    },
    errorShowRewardVideo : function (errMsg) {
        this.isOnShare = false;
        hall.MsgBoxManager.showToast({title:errMsg});
    },

    getDiamondToRevival : function () {
        ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
        var centerString = hall.GlobalFuncs.replaceKeyWordInString(this.failCondition.buttonText1);
        this.centerRichText.string = "<color=#FFFFFF>"+centerString+"</c>";
        hall.LOGW("=====","==================="+this.nowCount);
        if(this.nowCount >= this.requestCount){
            if(this.matchName == "arena"){
                ddz.waitGetRevial = {
                    sharePoint: this.sharePoint,
                    matchType: 'arena',
                    matchDes : this.matchDes,
                    type : 'waitRecive',
                    needCount : this.getRewardCount,
                    curCount : 0
                };
            }else {
                var needCount = ddz.matchModel.getDiamondCountNeeded();
                ddz.waitGetRevial = {
                    type : 'waitRecive',
                    curCount : 0,
                    needCount : needCount
                };
            }
            var needCountR = ddz.waitGetRevial.needCount;
            //发送得钻石的消息
            for (var i = 0; i < needCountR; i++){
                ddz.gameModel.shareToGetreward(ddz.waitGetRevial.sharePoint || ddz.Share.SharePointType.firstFail);
            }
            this.node.destroy();
        }
        // ddz.matchModel.matchBack(this.matchDes.roomId, this.matchDes.matchId);
    },

    onClickCenterButton:function (event,number) {
        // hall.LOGW(null,"============onClickCenterButton============="+number);
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        if(this.isOnShare){
            return;
        }
        this.isOnShare = true;
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if(this.conditionType == "share"){
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeRevial);
        }else if(this.conditionType == "ad"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["watchVideo",this.matchName]);
            var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];
            this.nowAdId = adId;
            hall.adManager.showRewardedVideo(adId,this.matchName);
        }
    },
    close: function() {
        this.node.destroy();
    },
    onClose:function (event) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["abandonWatchVideo",this.matchName]);
        if(this.matchName == "arena"){
            ddz.matchModel.matchGiveUp(this.matchDes.roomId, this.matchDes.matchId);
        }
        this.isOnShare = false;
        this.node.destroy();
    },

    onBlack : function () {

    },
    onDestroy : function () {
        ddz.matchRevivalPanel = null;
        ddz.matchModel.isShowingMatchRevivalPanel = false;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
