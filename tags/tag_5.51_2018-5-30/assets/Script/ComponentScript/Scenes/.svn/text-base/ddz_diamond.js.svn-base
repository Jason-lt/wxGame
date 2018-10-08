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
        personalAssets : {
            default : null,
            type : cc.Node
        },

        backButton : {
            default : null,
            type : cc.Button
        },

        tableView : {
            default : null,
            type : cc.Node
        },

        getDayRewardRichText : cc.RichText,
        getDayRewardButton : cc.Button,
        haveSprite : cc.Sprite,

        watchVideoRichText : cc.RichText,
        watchVideoButton : cc.Button,
        adId : "",
        leftSecond : 0
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.gameModel.queryInviteInfo();
        // ddz.gameModel.queryWatchVideoReward();
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        hall.GlobalFuncs.popScene();
    },

    setActiveForFalse : function () {
        this.backButton.node.active = false;
    },

    onLoad :function() {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();

        ddz.gameModel.queryInviteInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        this.setDayLoginState();

        // ddz.gameModel.queryWatchVideoReward();
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_WATCH_VIDEO_STATUS, this.updateWatchVideoState,this);
        // ddz.gameModel.getWatchVideoReward();

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_COUNT, this.playAnimationAftergetReward, this);//登录得钻石动画
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND, this.playZuanShiAnimation, this);//分享送钻石的钻石动画
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);//获得分享结果
    },
    //分享到群
    // playAnimationAfterShareWithType : function (shareType) {
    //     // hall.LOGW("=="," file = [ddz_diamond] fun = [playAnimationAfterShareWithType] ");
    //     // if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeGetDiamondHall) {
    //     //     return;
    //     // }
    //     // var type = ddz.Share.resultType;
    //     // switch (type) {
    //     //     case 1:
    //     //         // hall.MsgBoxManager.showToast({"title":"只有分享到微信群才有效哦~"});
    //     //         break;
    //     //     case 2:
    //     //         // hall.MsgBoxManager.showToast({"title":"这个群已经分享过啦，分享到其他群吧"});
    //     //         break;
    //     //     case 3:
    //     //         break;
    //     //     default:
    //     //         break;
    //     // }
    // },
    shareButtonAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShare"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },
    //邀请第一次登录得钻石
    updateRewardMassage : function () {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(ddz.gameModel.inviteShowList);
    },
    playZuanShiAnimation : function () {
        ddz.GlobalFuncs.playZuanShi();
    },
    //每日登录
    getDayRewardAction : function (event) {
        ddz.gameModel.getDayLoginReward();
        this.getDayRewardButton.node.active = false;
        this.haveSprite.node.active = true;
        ty.NotificationCenter.listen(ddz.EventType.DAY_LOGIN_REWARD,this.getDayLoginRewardresult,this);
    },
    getDayLoginRewardresult : function (result) {
        ty.NotificationCenter.ignore(ddz.EventType.DAY_LOGIN_REWARD,this.getDayLoginRewardresult,this);
        ddz.LOGD("","file = [ddz_diamond] fun = [getDayLoginRewardresult] result = " + JSON.stringify(result));
        if(parseInt(result.count) != 0){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_DIAMOND_COUNT,result.count+"");
        }else {
            hall.MsgBoxManager.showToast({"title":result.msg});
        }
        var dayGetStateString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME, "");
        var dayGetStateDic = JSON.parse(dayGetStateString);
        var day = hall.GlobalTimer.getCurDay();
        if(!dayGetStateDic){
            dayGetStateDic = {};
            dayGetStateDic[day] = [];
        }
        var dayGetStateList = dayGetStateDic[day];
        var nowHour = hall.GlobalTimer.getCurHours();
        dayGetStateList.push(nowHour);
        hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME, JSON.stringify(dayGetStateDic));
        this.setDayLoginState();
    },
    setDayLoginState : function () {
        this.getDayRewardButton.node.active = true;
        this.haveSprite.node.active = false;
        var loginCount = ddz.GlobalFuncs.setDayLoginRewardCount();
        if(loginCount == 0){//没有可领取的
            this.getDayRewardButton.interactable = false;
        }else if(loginCount == 1){
            this.getDayRewardButton.interactable = true;
        }else {//已领取
            this.getDayRewardButton.node.active = false;
            this.haveSprite.node.active = true;
        }
        var getCount = ddz.gameModel.dayLoginCount > 2?2:ddz.gameModel.dayLoginCount;
        this.getDayRewardRichText.string = "<color=#1A6951><size=36>每日领奖("+getCount+"/2)<size><br/><size=30>奖励：" +
            "<img src='dda_button_diamond_black' height=34 width=42/> +1</color>";
    },

    //分享朋友圈
    shareToMoments : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["welfareShareToMoments"]);
        ddz.GlobalFuncs.showShareMomentsItem("invite");
    },
    //观看广告得钻石
    // updateWatchVideoState : function (result) {
    //     this.adId = result.videoId;
    //     this.leftSecond = result.seconds;
    //     if(result.status == 0){
    //         this.watchVideoButton.interactable = false;
    //         if (this.leftSecond == 0) {
    //             ty.Timer.cancelTimer(this,this.timerAction);
    //             // this.watchVideoButton.interactable = true;
    //             this.watchVideoRichText.string = "<color=#1A6951><size=36>看广告免费领奖励<size></color>";
    //         }else {
    //             this.watchVideoRichText.string =
    //                 "<color=#1A6951><size=36>看广告免费领奖励<size><br/><size=30>距下次领奖："
    //                 +parseInt(this.leftSecond/60)+"分"+this.leftSecond%60+"秒</color>";
    //             ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
    //         }
    //     }else if(result.status == 1){
    //         this.watchVideoButton.interactable = true;
    //         this.watchVideoRichText.string = "<color=#1A6951><size=36>看广告免费领奖励<size>";
    //     }
    // },
    // timerAction : function () {
    //     this.leftSecond --;
    //     if(this.leftSecond > 0){
    //         this.watchVideoRichText.string =
    //             "<color=#1A6951><size=36>看广告免费领奖励<size><br/><size=30>距下次领奖："
    //             +parseInt(this.leftSecond/60)+"分"+parseInt(this.leftSecond)%60+"秒</color>";
    //     }else {
    //         ty.Timer.cancelTimer(this,this.timerAction);
    //         // this.watchVideoButton.interactable = true;
    //         // ddz.gameModel.queryWatchVideoReward();
    //         // this.watchVideoRichText.string = "<color=#1A6951><size=36>看广告免费领奖励<size>";
    //     }
    // },
    // onWatchVideo : function () {
    //     ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
    //         ["watchVideo","diamond"]);
    //     this.watchVideoButton.interactable = false;
    //     hall.LOGW("====","======onWatchVideo==============="+this.adId);
    //     hall.GlobalFuncs.btnEffect(this.watchVideoButton.node,1.01,this);
    //     hall.adManager.showRewardedVideo(this.adId,"diamond");
    //     ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
    //     ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
    // },
    // finishShowRewardVideo : function (adId) {
    //     // ddz.gameModel.queryWatchVideoReward();
    //     ty.NotificationCenter.ignore(ddz.EventType.REWARD_VIDEO_COMPLETE,this);
    //     ty.NotificationCenter.ignore(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this);
    //     if(adId == this.adId){
    //         ddz.gameModel.getWatchVideoReward();
    //         ty.NotificationCenter.listen(ddz.EventType.UPDATE_VIDEO_REWARD,this.finishGetRewardVideo,this);
    //     }
    // },
    // errorShowRewardVideo : function (errMsg) {
    //     ty.NotificationCenter.ignore(ddz.EventType.REWARD_VIDEO_COMPLETE,this);
    //     ty.NotificationCenter.ignore(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this);
    //     hall.MsgBoxManager.showToast({title:errMsg});
    // },
    // finishGetRewardVideo : function (result) {
    //     ty.NotificationCenter.ignore(ddz.EventType.UPDATE_VIDEO_REWARD,this.finishGetRewardVideo,this);
    //     if(result.rewards){
    //         var rewards = result.rewards;
    //         if(rewards.itemId == "item:1311"){
    //             ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,false);
    //         }else {
    //             ddz.GlobalFuncs.playZuanShi(false,this,rewards.count,true);
    //         }
    //         this.watchVideoButton.interactable = false;
    //         // this.leftSecond = 60*30;
    //         this.leftSecond = result.seconds;
    //         if (this.leftSecond > 0) {
    //             this.watchVideoRichText.string =
    //                 "<color=#1A6951><size=36>看广告免费领奖励<size><br/><size=30>距下次领奖："
    //                 +parseInt(this.leftSecond/60)+"分"+this.leftSecond%60+"秒</color>";
    //             ty.Timer.setTimer(this,this.timerAction,1,cc.macro.REPEAT_FOREVER,0);
    //         }else {
    //             this.watchVideoRichText.string = "<color=#1A6951><size=36>看广告免费领奖励<size></color>";
    //         }
    //     }
    // },

    playAnimationAftergetReward : function (rewardCount) {
        ddz.GlobalFuncs.playShareZuanShi(rewardCount);
    },
    update : function (dt) {
    },

    onClickCenterButton:function (event) {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }


    // start () {
    //
    // },

});
