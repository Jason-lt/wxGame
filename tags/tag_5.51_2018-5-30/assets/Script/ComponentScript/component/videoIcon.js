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
        timerText:cc.RichText,

    },

    onLoad:function () {
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WATCH_VIDEO_STATUS, this.updateWatchVideoState,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_VIDEO_REWARD,this.finishGetRewardVideo,this);
        
        this.adId = "adunit-8bde7ac62d379503";
        this.playRideo = false;
        ddz.gameModel.queryWatchVideoReward();
        var that = this;
        this.scheduleOnce(function () {
            that.playLoopAni();
        }, 1);
    },

    //
    updateWatchVideoState : function (result) {
        hall.LOGW("","file = [videoIcon] fun = [updateWatchVideoState] result = " + JSON.stringify(result));
        this.timerText.node.active = true;
        this.adId = result.videoId;
        this.leftSecond = result.seconds;
        if(result.status == 0){
            if (this.leftSecond == 0) {
                ty.Timer.cancelTimer(this,this.timerAction);
                this.playLoopAni();
                this.timerText.string = "<color=#FFFFFF>看广告领奖励</color>";
            }else {
                this.setTimerText(this.leftSecond);
                ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
            }
        }else if(result.status == 1){
            this.playLoopAni();
            this.timerText.string = "<color=#FFFFFF>看广告领奖励</color>";
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
        this.timerText.string =
            "<color=#FFFFFF>" + _minute+":"+_second+"</color>";
    },

    timerAction : function () {
        this.leftSecond --;
        if(this.leftSecond > 0){
            // this.timerText.node.active = true;
            this.stopLoopAni();
            this.setTimerText(this.leftSecond);
        }else {
            ty.Timer.cancelTimer(this,this.timerAction);
            this.playLoopAni();
            this.timerText.string = "<color=#FFFFFF>看广告领奖励</color>";
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
            if (this.playRideo) {
                return
            }
            this.playRideo = true;
            hall.adManager.showRewardedVideo(this.adId,"diamond");

        }
    },

    finishShowRewardVideo : function (adId) {
        // ddz.gameModel.queryWatchVideoReward();
        if(adId == this.adId){
            ddz.gameModel.getWatchVideoReward();
        }
        this.playRideo = false;
    },
    errorShowRewardVideo : function (errMsg) {
        this.playRideo = false;
        hall.MsgBoxManager.showToast({title:errMsg});
    },

    finishGetRewardVideo : function (result) {
        if(result.rewards){
            var rewards = result.rewards;
            if(rewards.itemId == "item:1311"){
                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,false);
            }else {
                ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,true);
            }
            this.leftSecond = result.seconds;
            if (this.leftSecond > 0) {
                //
                this.setTimerText(this.leftSecond);
                ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
            }else {
                this.timerText.string = "<color=#FFFFFF>看广告领奖励</color>";
                ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
            }
        }
    },

    stopLoopAni:function () {
        var animationCom = this.node.getComponent(cc.Animation);
        var ani = animationCom.getAnimationState('rideoBtnTick');
        ani.stop();
    },

    playLoopAni:function () {
        var ani = this.node.getComponent(cc.Animation);
        ani.play('rideoBtnTick');
    },

    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
    },

});
