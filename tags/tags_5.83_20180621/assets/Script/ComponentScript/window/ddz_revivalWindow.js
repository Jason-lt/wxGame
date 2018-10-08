
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
        adCount : 1,

        adIds : [],
        nowAdId : '',

        toNext : false

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
        this.toNext = failCondition.resurgenceCondition.toNext;
        this.requestCount = failCondition.resurgenceCondition.requestCount;
        ddz.Share.shareKeywordReplace.repeatNumber = this.requestCount;
        this.nowCount = 0;
        ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
        this.adIds = failCondition.resurgenceCondition.adIds;
        this.titleLabel.string = failCondition.title || "提示";
        var contentString = hall.GlobalFuncs.replaceKeyWordInString(failCondition.content);
        this.contentRichText.string = "<color=#1A6951>"+contentString+"</c>";

        if (this.failCondition.resurgenceCondition.requestCount > 1 &&  failCondition.buttonText1.indexOf("hadNumber/repeatNumber") ==-1){
            failCondition.buttonText1 += "(hadNumber/repeatNumber)";
        }

        var centerString = hall.GlobalFuncs.replaceKeyWordInString(failCondition.buttonText1);
        this.centerRichText.string = "<color=#FFFFFF>"+centerString+"</c>";
        this.ignoreRichText.string = "<color=#1A6951>"+failCondition.buttonText2+"</c>";

        if(this.matchName == "arena"){
            this.setMatchInfo();
            var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(ddz.matchModel._curWaitInfo.matchId);
            this.matchDes = matchDes;
        }
    },

    setRewardAndCompersation : function (isWin,chipNumber,multiple,adCount) {
        this.isOnShare = false;
        var config = ddz.gameModel.rewardAnduchangConfig;
        this.adCount = adCount;
        if (isWin) {  // 奖励
            if (!config) {
                this.adIds = ["adunit-8bde7ac62d379503"];
            }else {
                this.adIds = config.rewardConfig.adIds;
            }
            this.conditionType = "reward";
            this.matchName = "reward";
            this.contentRichText.string = "<color=#1A6951>恭喜你! 本局共赢 </c><img src='ddz_mall_coin_icon' height=36 width=36/>" +
                "<color=#1A6951>"+ chipNumber + "</c><br/><color=#1A6951>现在观看广告可获 "+ multiple + "倍奖励哦~</c>";
        }else {  // 补偿
            if (!config) {
                this.adIds = ["adunit-8bde7ac62d379503"];
            }else {
                this.adIds = config.buChangConfig.adIds;
            }
            this.conditionType = "compensation";
            this.matchName = "compensation";
            var percentage = multiple * 100;
            percentage = percentage + "%";
            this.contentRichText.string = "<color=#1A6951>本局共输 </c><img src='ddz_mall_coin_icon' height=36 width=36/>" +
                "<color=#1A6951>"+ chipNumber + "</c><br/><color=#1A6951>现在观看广告可获 "+ percentage + "补偿哦~~</c>";
        }

        this.setCenterRichText();
        this.ignoreRichText.string = "<color=#1A6951>点击放弃></c>";
    },

    setCenterRichText:function(){
        var btnText = "看广告领取";
        if (this.adCount > 1){
            btnText = "看广告领取 (" + this.nowCount + "/" + this.adCount +")";
        }
        this.centerRichText.string = "<color=#ffffff>"+ btnText +"</c>";
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

        var that = this;
        this.scheduleOnce(function () {
            var ani = that.node.getComponent(cc.Animation);
            ani.play('btnTick');
        }, 1);

        ddz.matchModel.isShowingMatchRevivalPanel = true;
        var animation = this.getComponent(cc.Animation);
        animation.play('tipsWindowNode');
        ty.NotificationCenter.listen(ddz.EventType.ARENA_SEND_MATCH_BACK, this.close, this);

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WINLOSESHAREREWARD,this.reciveWinLoseShareReward,this);
    },

    playAnimationAfterShareWithType : function (type) {
        this.isOnShare = false;
        if (type && type != ddz.Share.onShareType.clickStatShareTypeRevial) {
            return;
        }
        var reultType = ddz.Share.resultType;
        hall.LOGW("=====", "=======playAnimationAfterShareWithType======="+reultType);
        switch (reultType) {
            case 1:
                if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                    this.nowCount ++;
                    this.getDiamondToRevival();
                    return;
                }else {
                }
                break;
            case 2:
                if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                    this.nowCount ++;
                    this.getDiamondToRevival();
                    return;
                }else {
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

    reciveWinLoseShareReward : function (result) {
        ddz.GlobalFuncs.playZuanShi(false,this,result.rewardChip,true);
        this.onClose();
    },

    finishShowRewardVideo : function (isEnded) {
        hall.LOGW("=====","==================="+isEnded);
        this.isOnShare = false;

        if(isEnded){
            this.nowCount ++;
            if(this.conditionType == "reward"){
                this.setCenterRichText();
                if (this.nowCount == this.adCount){
                    ddz.gameModel.getWinLoseShareReward(parseInt(1));
                }
            }else if(this.conditionType == "compensation"){
                this.setCenterRichText();
                if (this.nowCount == this.adCount){
                    ddz.gameModel.getWinLoseShareReward(parseInt(0));
                }
            }else {
                this.getDiamondToRevival();
            }
        }
    },
    errorShowRewardVideo : function (parArr) {
        var errMsg = '广告播放失败,但您仍可复活!';
        hall.MsgBoxManager.showToast({title:errMsg});
        this.finishShowRewardVideo(parseInt(parArr[1]));
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
                if (this.toNext){
                    ddz.matchModel.matchBackNextLevel();
                    this.node.destroy();
                    return;
                }
                else{
                    var needCount = ddz.matchModel.getDiamondCountNeeded();
                    ddz.waitGetRevial = {
                        type : 'waitRecive',
                        curCount : 0,
                        needCount : needCount
                    };
                }
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
            //测试代码
            // if (this.toNext){
            //     ddz.matchModel.matchBackNextLevel();
            //     this.node.destroy();
            //     return;
            // }
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["watchVideo",this.matchName]);
            var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];
            this.nowAdId = adId;
            hall.adManager.showRewardedVideo(adId,this.matchName);
        }else if(this.conditionType == "reward"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["watchVideo","reward"]);
            var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];
            this.nowAdId = adId;
            hall.adManager.showRewardedVideo(adId,"reward");
        }else if(this.conditionType == "compensation"){
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["watchVideo","compensation"]);
            var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];
            this.nowAdId = adId;
            hall.adManager.showRewardedVideo(adId,"compensation");
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
