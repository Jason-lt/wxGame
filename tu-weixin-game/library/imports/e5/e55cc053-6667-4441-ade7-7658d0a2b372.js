"use strict";
cc._RF.push(module, 'e55ccBTZmdEQa3ndljQorNy', 'treasure_box_newer');
// Script/ComponentScript/window/treasure_box_newer.js

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
        chipNode: cc.Node,
        diamondNode: cc.Node,
        chipNumberLabel: {
            default: null,
            type: cc.Label
        },
        diamondNumberLabel: {
            default: null,
            type: cc.Label
        },
        countDownRich: {
            default: null,
            type: cc.RichText
        },
        lastNumber: 0
    },

    onBlack: function onBlack() {},

    playEndAnimation: function playEndAnimation() {
        if (this.node) {
            this.node.destroy();
        }
    },
    onClose: function onClose(event) {
        if (this.isAction) {
            return;
        }
        this.isAction = true;
        this.playEndAnimation();
        ddz.ddz_newUserBox = null;
    },

    onHelp: function onHelp() {
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeNewUserGifts);
    },

    setCountDownWithNumber: function setCountDownWithNumber(number) {
        this.chipNode.active = false;
        this.diamondNode.active = false;
        var new_gift_reward = ddz.matchModel.new_gift_reward;
        ddz.Share.shareKeywordReplace.newerTreasureID = new_gift_reward.giftId;
        var reward = new_gift_reward.rewards;
        for (var i = 0; i < reward.length; i++) {
            var rewardInfo = reward[i];
            if (rewardInfo.itemId == "item:1311") {
                this.diamondNode.active = true;
                this.diamondNumberLabel.string = rewardInfo.count;
            } else if (rewardInfo.itemId == "user:chip") {
                this.chipNode.active = true;
                this.chipNumberLabel.string = rewardInfo.count;
            }
        }
        // this.lastNumber = new_gift_reward.cdTime;
        this.lastNumber = number;
        this.countDownRich.string = "消失倒计时 " + hall.GlobalFuncs.formatMinSeconds(this.lastNumber);
        ty.Timer.setTimer(this, this.countDown, 0.1, this.lastNumber);
    },
    countDown: function countDown() {
        this.lastNumber--;
        if (this.lastNumber > 0) {
            this.countDownRich.string = "消失倒计时 " + hall.GlobalFuncs.formatMinSeconds(this.lastNumber);
        } else {
            this.onClose();
        }
    },

    onLoad: function onLoad() {
        this.isAction = true;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('awad_tips_show');
        anim1.on('finished', function () {
            this.isAction = false;
        }, this);
        anim1.play();

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        // if (!ddz.curAllWidthBannerAd){
        //     hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
        // }
        hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');

        // this.setCountDownWithNumber();
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeNewUserGifts) {
            return;
        }
        hall.MsgBoxManager.showToast({ title: "分享到更多群邀请更多好友吧～" });
    },

    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
        ty.NotificationCenter.ignoreScope(this);
        hall.adManager.destroyWidthBannerAd();
    }

    // LIFE-CYCLE CALLBACKS:


    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();