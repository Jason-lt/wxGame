"use strict";
cc._RF.push(module, '4a3d1pI1TNANZocVs8awXkR', 'getJiPaiQi');
// Script/ComponentScript/component/getJiPaiQi.js

"use strict";

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
        jipaiqiAdId: "adunit-8bde7ac62d379503"
    },

    onLoad: function onLoad() {

        // ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        // ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_JIPAIQI,this.updateGetReward,this);
    },

    finishShowRewardVideo: function finishShowRewardVideo(isEnded) {
        hall.LOGW("=====", "file = [getJiPaiQi] fun = [finishShowRewardVideo]" + isEnded);

        if (isEnded) {
            if (ddz.gameModel.firstUseJiPaiQiPoint > 0) {
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstUseJiPaiQi);
            } else {
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.adGetJiPaiQi);
            }
        }
    },

    errorShowRewardVideo: function errorShowRewardVideo(parArr) {
        hall.LOGW("=====", "file = [ddz_fail] fun = [errorShowRewardVideo]");
        this.isOnShare = false;
        this.finishShowRewardVideo(parseInt(parArr[1]));
    },

    updateGetReward: function updateGetReward() {
        // if (hall.ME.udataInfo.jiPaiQiCount >= 6) {
        //     this.videoIcon.active = false;
        // }
    },

    onClickCenterBtn: function onClickCenterBtn() {
        hall.adManager.showRewardedVideo(this.jipaiqiAdId, "getJiPaiQi");
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["watchVideo", "getJiPaiQi"]);
    }

    // update (dt) {},
});

cc._RF.pop();