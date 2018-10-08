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
        haveSprite : cc.Sprite
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.gameModel.queryInviteInfo();
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

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_COUNT, this.playAnimationAftergetReward, this);//登录得钻石动画
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND, this.playZuanShiAnimation, this);//分享送钻石的钻石动画
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);//获得分享结果
    },
    playAnimationAfterShareWithType : function (shareType) {
        hall.LOGW("=="," file = [ddz_diamond] fun = [playAnimationAfterShareWithType] ");
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeGetDiamondHall) {
            return;
        }
        var type = ddz.Share.resultType;
        switch (type) {
            case 1:
                hall.MsgBoxManager.showToast({"title":"只有分享到微信群才有效哦~"});
                break;
            case 2:
                hall.MsgBoxManager.showToast({"title":"这个群已经分享过啦，分享到其他群吧"});
                break;
            case 3:
                break;
            default:
                break;
        }
    },

    //分享到群
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

    playAnimationAftergetReward : function (rewardCount) {
        ddz.GlobalFuncs.playShareZuanShi(rewardCount);
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
