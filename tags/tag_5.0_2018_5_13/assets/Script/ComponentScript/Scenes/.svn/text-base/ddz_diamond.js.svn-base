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
        daylyWork : {
            default : null,
            type : cc.Node
        },
        newInviteNode : {
            default : null,
            type : cc.Node
        },
        personalAssets : {
            default : null,
            type : cc.Node
        },

        backButton : {
            default : null,
            type : cc.Button
        },
        isOnShareAction : false,
        sahreRichText : cc.RichText,
        tableView : {
            default : null,
            type : cc.Node
        },
        tableViewNew : {
            default : null,
            type : cc.Node
        },
        getDayRewardRichText : cc.RichText,
        getDayRewardButton : cc.Button,
        haveSpritr : cc.Sprite,

        inviteType : ""
    },
    backAction : function () {
        ddz.gameModel.queryInviteInfo();
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        // hall.GlobalFuncs.pushScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    setInviteType:function(type) {
        this.inviteType = type;
        if(type == "new"){
            this.newInviteNode.active = true;
            this.daylyWork.active = false;
            ddz.gameModel.queryNewInviteInfo();
            ty.NotificationCenter.listen(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE, this.updateNewRewardMassage, this);
        }else {
            this.newInviteNode.active = false;
            this.daylyWork.active = true;
            this.setDayLyWork();
        }
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
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_COUNT, this.playAnimationAftergetReward, this);//邀请送钻石的钻石动画
    },

    setDayLyWork : function () {
        //分享到群奖励
        this.setShareCountRichText();

        //邀请奖励
        ddz.gameModel.queryInviteInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);//分享到群结果类型
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND,this.getDiamondNotification ,this);//获得分享奖励钻石钻石动画

        //今日领取奖励
        this.setDayLoginState();
    },

    //分享到群
    shareButtonAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShare",this.inviteType]);
        if(!this.isOnShareAction){
            this.isOnShareAction = true;
            if(this.inviteType != 'new'){
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
            }else {
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeInviteNewFriend);
            }
        }
        if(this.inviteType == 'new'){
            this.isOnShareAction = false;
        }
    },
    playAnimationAfterShareWithType : function () {
        hall.LOGE("===","==playAnimationAfterShareWithType===="+ ddz.Share.resultType);
        this.setShareCountRichText();
        var type = ddz.Share.resultType;
        switch (type) {
            case 1:
                ddz.GlobalFuncs.showTipsWindowWithString("<color=#1A6951>只有分享到微信群才有效哦~</color>");
                break;
            case 2:
                ddz.GlobalFuncs.showTipsWindowWithString("<color=#1A6951>这个群已经分享过啦，分享到其他群吧</color>","分享到群");
                break;
            case 3:
                break;
            default:
                break;
        }
        ddz.Share.resultType = 0;
        this.isOnShareAction = false;
    },
    setShareCountRichText : function () {
        ddz.gameModel.checkShareReward(67890002);
        var toDay = hall.GlobalTimer.getCurDay();
        var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.LAST_SHARE_TIME, "");
        var count =  0;
        if(toDay == lastShareTime){
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.SHARETICKETS_LIST, "");
            var shareMap = JSON.parse(shareTickets);
            var keyS = '67890002';
            if(!shareMap[keyS]){
                count = 0;
            }else {
                var list = shareMap[keyS];
                count = list.length;
            }
        }
        var showCount = count>3?3:count;

        var lossCount = 1;

        this.sahreRichText.string = "<color=#1A6951><size=36>分享到群（"+showCount+"/3）</size><br/><size=30>奖励：" +
            "<img src='dda_button_diamond_black' height=34 width=42/> +"+lossCount+"</size></color>";
        // this.changeDiamondCount();
    },
    getDiamondNotification : function () {
        ddz.GlobalFuncs.playZuanShi();
    },
    //邀请得钻石
    updateRewardMassage : function () {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        this.setShareCountRichText();
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(ddz.gameModel.inviteShowList);
    },

    updateNewRewardMassage : function () {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE, this.updateNewRewardMassage, this);
        var window = this.tableViewNew.getComponent('ddz_tableView');
        window.setDataArray(ddz.gameModel.inviteNewShowList);
    },

    playAnimationAftergetReward : function (rewardCount) {
        ddz.GlobalFuncs.playShareZuanShi(rewardCount);
    },

    //每日登录
    getDayRewardAction : function (event) {
        ddz.gameModel.getDayLoginReward();
        // this.getDayRewardButton.interactable = false;
        this.getDayRewardButton.node.active = false;
        this.haveSpritr.node.active = true;
        ty.NotificationCenter.listen(ddz.EventType.DAY_LOGIN_REWARD,this.getDayLoginRewardresult,this);
    },
    getDayLoginRewardresult : function (result) {
        ty.NotificationCenter.ignore(ddz.EventType.DAY_LOGIN_REWARD,this.getDayLoginRewardresult,this);
        ddz.LOGD("","file = [ddz_diamond] fun = [getDayLoginRewardresult] result = " + JSON.stringify(result));
        if(parseInt(result.count) != 0){
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_DIAMOND_COUNT,result.count+"");
            // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_DIAMOND_COUNT,result.count+"");
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
        this.haveSpritr.node.active = false;
        var loginCount = ddz.GlobalFuncs.setDayLoginRewardCount();
        if(loginCount == 0){//没有可领取的
            this.getDayRewardButton.interactable = false;
        }else if(loginCount == 1){
            this.getDayRewardButton.interactable = true;
        }else {//已领取
            this.getDayRewardButton.node.active = false;
            this.haveSpritr.node.active = true;
        }
        var getCount = ddz.gameModel.dayLoginCount;
        this.getDayRewardRichText.string = "<color=#1A6951><size=36>每日领奖("+getCount+"/2)<size><br/><size=30>奖励：" +
            "<img src='dda_button_diamond_black' height=34 width=42/> +1</color>";
    },

    onClickCenterButton:function (event) {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }


    // start () {
    //
    // },

    // update (dt) {},
});
