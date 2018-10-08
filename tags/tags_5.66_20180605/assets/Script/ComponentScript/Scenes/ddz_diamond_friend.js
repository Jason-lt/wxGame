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

        tableViewNew : {
            default : null,
            type : cc.Node
        }
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
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

        ddz.gameModel.queryNewInviteInfo();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE, this.updateNewRewardMassage, this);

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_COUNT, this.playAnimationAftergetReward, this);//登录得钻石动画
        ty.NotificationCenter.listen(ty.EventType.GET_DIAMOND, this.playZuanShiAnimation, this);//分享送钻石的钻石动画
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);//获得分享结果
    },
    // playAnimationAfterShareWithType : function (shareType) {
    //     // hall.LOGW("=="," file = [ddz_diamond_friend] fun = [playAnimationAfterShareWithType] ");
    //     // if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeInviteNewFriend) {
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

    //分享到群
    shareButtonAction : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShareFriend"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeInviteNewFriend);
        // ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeMatchFirst);
    },

    shareToMoments : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShareToMoments"]);
        // ddz.GlobalFuncs.showShareMomentsItem("showy_highTotal");
        ddz.GlobalFuncs.showShareMomentsItem("invite");
    },
    //邀请新人得钻石
    updateNewRewardMassage : function () {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE, this.updateNewRewardMassage, this);
        var window = this.tableViewNew.getComponent('ddz_tableView');
        window.setDataArray(ddz.gameModel.inviteNewShowList);
    },

    playAnimationAftergetReward : function (rewardCount) {
        ddz.GlobalFuncs.playShareZuanShi(rewardCount);
    },
    playZuanShiAnimation : function () {
        ddz.GlobalFuncs.playZuanShi();
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});
