(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_icon_newer_gifts.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0b1dbSUxiVOrqD4HACqyek1', 'ddz_icon_newer_gifts', __filename);
// Script/ComponentScript/component/ddz_icon_newer_gifts.js

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
        timerLabel: {
            default: null,
            type: cc.Label
        },
        lastNumber: 0
    },

    onLoad: function onLoad() {
        this.setCountDownWithNumber();
    },
    setCountDownWithNumber: function setCountDownWithNumber() {
        var new_gift_reward = ddz.matchModel.new_gift_reward;
        ddz.Share.shareKeywordReplace.newerTreasureID = new_gift_reward.giftId;

        this.lastNumber = parseInt(new_gift_reward.cdTime) * 10;
        this.timerLabel.string = hall.GlobalFuncs.formatMinSeconds(this.lastNumber);
        if (new_gift_reward.isFirst) {
            this.onCenterButton();
        }
        ty.Timer.setTimer(this, this.countDown, 0.1, this.lastNumber);
    },
    countDown: function countDown() {
        this.lastNumber--;
        if (this.lastNumber > 0) {
            this.timerLabel.string = hall.GlobalFuncs.formatMinSeconds(this.lastNumber);
        } else {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

    onCenterButton: function onCenterButton() {
        // hall.GlobalFuncs.onNewUserGifts(this.lastNumber);
    },
    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:


    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ddz_icon_newer_gifts.js.map
        