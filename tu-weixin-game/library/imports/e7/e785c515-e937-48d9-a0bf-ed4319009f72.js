"use strict";
cc._RF.push(module, 'e785cUV6TdI2aC/7UMZAJ9y', 'ddz_helpBox');
// Script/ComponentScript/window/ddz_helpBox.js

'use strict';

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
        unCoinNumber: cc.Label,
        unDiamondNumber: cc.Label,
        getCoinNumber: cc.Label,
        getDiamondNumber: cc.Label,
        centerBtn: cc.Button,
        emptyBox: cc.Node,
        reward_di: cc.Node

    },

    onLoad: function onLoad() {
        var that = this;
        var ani_2 = that.node.getComponent(cc.Animation);
        ani_2.play('ddz_helpBox');
        this.scheduleOnce(function () {
            var ani = that.reward_di.getComponent(cc.Animation);
            ani.play('btnTick');
        }, 1);
    },

    updateRewardInfo: function updateRewardInfo(data) {
        var _uncount = 0;
        if (data.rewards) {
            // 未领取
            var _rewards = data.rewards;

            if (_rewards['item:1311'] > 0) {
                this.unDiamondNumber.string = _rewards['item:1311'] + "";
                _uncount = _uncount + _rewards['item:1311'];
            }
            if (_rewards['user:chip'] > 0) {
                this.unCoinNumber.string = _rewards['user:chip'] + "";
                _uncount = _uncount + _rewards['user:chip'];
            }
        }

        if (_uncount == 0) {
            this.boxIsEmpty();
        }

        if (data.drawRewards) {
            // 领取
            var _drawRewards = data.drawRewards;

            if (_drawRewards['item:1311'] > 0) {
                this.getDiamondNumber.string = _drawRewards['item:1311'] + "";
            }
            if (_drawRewards['user:chip'] > 0) {
                this.getCoinNumber.string = _drawRewards['user:chip'] + "";
            }
        }
        ty.NotificationCenter.trigger(ddz.EventType.IS_HAVE_REWARD, data);
    },

    onSeekHelp: function onSeekHelp() {
        // ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
        //     ["diamondShareFriend"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeSeekHelpFriend);
    },

    boxIsEmpty: function boxIsEmpty() {
        this.emptyBox.active = true;
        this.centerBtn.node.active = false;
        var ani_2 = this.node.getComponent(cc.Animation);
        ani_2.stop();
    },

    removeLoopAni: function removeLoopAni() {
        var ani = this.reward_di.getComponent(cc.Animation);
        ani.stop();

        var ani_2 = this.node.getComponent(cc.Animation);
        ani_2.stop();
    },

    shut: function shut() {
        this.removeLoopAni();
        this.node.destroy();
    },

    onClose: function onClose() {
        this.shut();
        ddz.ddz_helpBox = null;
    }
});

cc._RF.pop();