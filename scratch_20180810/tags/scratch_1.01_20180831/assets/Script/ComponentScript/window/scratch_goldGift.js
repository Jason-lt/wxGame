// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        topNode : {
            default : null,
            type : cc.Node
        },
        bottomNode : {
            default : null,
            type : cc.Node
        },

        rewardVideoCountRich : {
            default: null,
            type : cc.RichText
        },
        rewardVideoGetCountLabel : {
            default : null,
            type : cc.Label
        },

        inviteCountLabel : {
            default : null,
            type : cc.Label
        },
        getRewardNode : {
            default : null,
            type : cc.Node
        },
        getRewardButton : {
            default : null,
            type : cc.Button
        },

        inviteRewardGetLabel : {
            default : null,
            type : cc.Label
        },

        inviteNode : {
            default : null,
            type : cc.Node
        },
        watchCount : 0

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {

        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType || ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 ){
            this.topNode.y = cc.director.getWinSize().height/2-100;
            this.bottomNode.y = -cc.director.getWinSize().height/2+70;
        }else {
            this.topNode.y = cc.director.getWinSize().height/2;
            this.bottomNode.y = -cc.director.getWinSize().height/2;
        }

        this.updateUI();

        scratch.gameModel.queryNewInviteStatus();

        ty.NotificationCenter.listen(scratch.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(scratch.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(scratch.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);
        ty.NotificationCenter.listen(scratch.EventType.GET_INVITE_STATUS,this.updateUI ,this);
    },

    updateUI : function () {
        this.inviteNode.active = !ty.SystemInfo.isCheckVersion;
        // this.inviteCountLabel.string = "已邀请新朋友("+scratch.gameModel.currInviteNum+"/"+scratch.gameModel.maxInviteNum+")";
        // this.inviteCountLabel.string = "成功邀请"+scratch.GameWorld.currInviteNum+"名好友";
        this.inviteCountLabel.string = "成功邀请"+scratch.GameWorld.getRewardCount+"名好友";

        this.getRewardButton.enableAutoGrayEffect = true;
        this.inviteRewardGetLabel.string =hall.GlobalFuncs.getChipStringWithChipCount(scratch.GameWorld.normalConfig.inviteGetRewardCount*scratch.GameWorld.getRewardCount);
        if(!scratch.GameWorld.getRewardCount){
            this.getRewardButton.interactable = false;
            this.getRewardNode.active = false;
        }else {
            this.getRewardButton.interactable = true;
            this.getRewardNode.active = true;
        }

        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(scratch.gameModel.LAST_WATCH_TIME, "");

        if(toDay != lastShareTime){
            var dic = {};
            dic[toDay] = 0;
            hall.GlobalFuncs.setInLocalStorage(scratch.Share.WATCH_TIME_LIST, JSON.stringify(dic));
            hall.GlobalFuncs.setInLocalStorage(scratch.Share.LAST_WATCH_TIME, toDay);
        }else {
            var watchListS = hall.GlobalFuncs.ReadStringFromLocalStorage(scratch.Share.WATCH_TIME_LIST, "");
            var watchList = JSON.parse(watchListS);
            this.watchCount = watchList[toDay];
        }
        this.watchCount = this.watchCount> scratch.GameWorld.normalConfig.videoDayWatch ? scratch.GameWorld.normalConfig.videoDayWatch : this.watchCount;


        this.rewardVideoCountRich.string = "<color=#FFDB3C><b>观看广告("+this.watchCount+"/"+scratch.GameWorld.normalConfig.videoDayWatch+")</b></c>";
        this.rewardVideoGetCountLabel.string = "看一次广告，可得"+hall.GlobalFuncs.getChipStringWithChipCount(scratch.GameWorld.normalConfig.videoGetRewardCount)+"金币";
    },

    backAction : function () {
        this.node.destroy();
    },
    onBlack : function () {

    },

    seeRewardVideoAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["rewardVideo"]);
        hall.adManager.showRewardedVideo("gold");
    },

    inviteFriendAction : function () {
        scratch.Share.shareWithType(scratch.Share.onShareType.goldcoininvitenewfriends);
    },

    getRewardAction : function () {
        scratch.gameModel.getNewInviteReward(scratch.GameWorld.getRewardCount);
    },

    rewardVideoComplete : function(isEnd){
        if(hall.adManager.rewardedVideoType != "gold"){
            return;
        }
        if(isEnd){
            if(this.watchCount >= scratch.GameWorld.normalConfig.videoDayWatch){
                return;
            }
            scratch.gameModel.shareToGetReward(scratch.Share.SharePointType.watchVideoToGetChip);
            this.watchCount ++;
            this.watchCount = this.watchCount> scratch.GameWorld.normalConfig.videoDayWatch ? scratch.GameWorld.normalConfig.videoDayWatch : this.watchCount;
            var toDay = hall.GlobalTimer.getCurDay();
            hall.GlobalFuncs.setInLocalStorage(scratch.Share.WATCH_TIME_LIST, JSON.stringify({toDay:this.watchCount}));
            hall.GlobalFuncs.setInLocalStorage(scratch.Share.LAST_WATCH_TIME, toDay);
            this.rewardVideoCountRich.string = "<color=#FFDB3C><b>观看广告("+this.watchCount+"/"+scratch.GameWorld.normalConfig.videoDayWatch+")</b></c>";
        }else {
            hall.MsgBoxManager.showToast({"title":"视频播放未完成"});
        }
    },
    rewardVideoCompleteError : function (errorMsg) {
        if(hall.adManager.rewardedVideoType != "gold"){
            return;
        }
        hall.MsgBoxManager.showToast({"title":errorMsg});
    },

    playAnimationAfterShareWithType : function (shareType) {
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
    // start () {
    //
    // },

    // update (dt) {},
});
