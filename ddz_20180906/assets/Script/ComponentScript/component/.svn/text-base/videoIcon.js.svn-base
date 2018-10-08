
cc.Class({
    extends: cc.Component,

    properties: {
        timerText:cc.Label,
        redDot:cc.Node,
        guanggao:cc.Node,
        videoBtn:cc.Button,
    },

    onLoad:function () {
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WATCH_VIDEO_STATUS, this.updateWatchVideoState,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_VIDEO_REWARD,this.finishGetRewardVideo,this);
        
        this.adId = "adunit-8bde7ac62d379503";
        ddz.gameModel.queryWatchVideoReward();
        var that = this;
        this.scheduleOnce(function () {
            that.playLoopAni();
        }, 1);
    },

    //
    updateWatchVideoState : function (result) {
        hall.LOGW("","file = [videoIcon] fun = [updateWatchVideoState] result = " + JSON.stringify(result));
        this.timerText.node.active = false;
        this.adId = result.videoId;
        this.leftSecond = result.seconds;
        if(result.status == 0){
            if (this.leftSecond == 0) {
                ty.Timer.cancelTimer(this,this.timerAction);
                this.playLoopAni();
                this.videoBtn.interactable = true;
                // this.timerText.string = "看广告领奖";
            }else {
                this.setTimerText(this.leftSecond);
                ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
            }
        }else if(result.status == 1){
            this.playLoopAni();
            this.videoBtn.interactable = true;
            // this.timerText.string = "看广告领奖";
            // this.redDot.active = true;
        }
    },

    setTimerText:function(_leftSecond){
        var _minute = parseInt(_leftSecond/60);
        if (_minute < 10) {
            _minute = "0" + _minute;
        }
        var _second = _leftSecond%60;
        if (_second < 10) {
            _second = "0" + _second;
        }
        this.timerText.node.active = true;
        // this.redDot.active = false;
        this.timerText.string = _minute+":"+_second;

    },

    timerAction : function () {
        this.leftSecond --;
        if(this.leftSecond > 0){
            // this.timerText.node.active = true;
            this.stopLoopAni();
            this.setTimerText(this.leftSecond);
            this.videoBtn.interactable = false;
        }else {
            ty.Timer.cancelTimer(this,this.timerAction);
            this.playLoopAni();
            this.timerText.node.active = false;
            this.videoBtn.interactable = true;
            // this.
            // this.redDot.active = true;
            ddz.gameModel.queryWatchVideoReward();
        }
    },

    /*
     看广告领取奖励
     */
    seeReardedVideo:function(){
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["watchVideo","diamond"]);

        hall.LOGW("====","file = [videoIcon] fun = [seeReardedVideo]this.adId = "+this.adId);
        if (this.leftSecond > 0) {
            var tipsString = "倒计时结束才能再次领奖哦~";
            var preFabPath = "prefabs/ddz_window_normal";
            var  comName = "ddz_window_normal";
            hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                var window = preFabNode.getComponent(comName);
                var tiString = "确定";
                window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tipsString + "</c>",[{title:tiString,callFunc:function () {
                }}]);
            });
        }else {
            hall.adManager.checkVideoAd();
            if (hall.adManager.canPlay) {
                hall.adManager.showRewardedVideo(this.adId,"diamond");
            }else {
                hall.MsgBoxManager.showToast({title : "今日已达上限,明天继续哦~"});
            }
        }
    },

    finishShowRewardVideo : function (isEnded) {
        hall.LOGW("finishShowRewardVideo","收到广告播放完毕消息!");
        // ddz.gameModel.queryWatchVideoReward();
        if(isEnded){
            ddz.gameModel.getWatchVideoReward();
        }


    },
    errorShowRewardVideo : function (parArr) {
        // var errMsg = '广告播放失败,但您仍可获得奖励!';
        // hall.MsgBoxManager.showToast({title:errMsg});
        hall.LOGW("","file = [videoIcon] fun = [errorShowRewardVideo] parArr = " + JSON.stringify(parArr));
        this.finishShowRewardVideo(parseInt(parArr[1]))
    },

    finishGetRewardVideo : function (result) {
        if(result.rewards){
            var rewards = result.rewards;
            if(rewards.itemId == "item:1311"){
                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,false);
            }else if (rewards.itemId == "item:1363"){

                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,true,false,true);

                // if (ddz.gameModel.firstUseJiPaiQiPoint > 0) {
                //     ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstUseJiPaiQi);
                // }else {
                //     ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.adGetJiPaiQi);
                // }
            }else {
                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,true);
            }
            this.leftSecond = result.seconds;
            if (this.leftSecond > 0) {
                //
                this.setTimerText(this.leftSecond);
                ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
            }else {
                // this.timerText.string = "看广告领奖";
                this.videoBtn.interactable = true;
                this.timerText.node.active = false;
                // this.redDot.active = true;
                ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
            }
        }
    },

    stopLoopAni:function () {
        // var animationCom = this.guanggao.getComponent(cc.Animation);
        // var ani = animationCom.getAnimationState('shipin');
        // ani.stop();
    },

    playLoopAni:function () {
        // var ani = this.guanggao.getComponent(cc.Animation);
        // ani.play('shipin');
    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
    },

});
