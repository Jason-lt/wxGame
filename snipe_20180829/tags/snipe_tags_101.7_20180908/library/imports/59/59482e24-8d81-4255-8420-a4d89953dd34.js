"use strict";
cc._RF.push(module, '594824kjYFCVYQgpNiZU900', 'main_toast');
// Script/ComponentScript/component/main_toast.js

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
        avatarSprite: {
            default: null,
            type: cc.Sprite
        },
        nameLabel: {
            default: null,
            type: cc.Label
        },
        countLabel: {
            default: null,
            type: cc.Label
        }
    },
    changeName: function changeName(userName, count, picUrl) {
        var showName;
        if (userName) {
            showName = hall.GlobalFuncs.sliceStringToLength(userName, 10);
        }
        this.nameLabel.string = " " + showName || "好友";
        var showCount = count || 1;
        this.countLabel.string = " x" + showCount;
        ty.Timer.setTimer(this, this.closeAction, 2.5);
        ty.SystemInfo.getImageWithURL(picUrl, this.avatarSprite);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},

    closeAction: function closeAction() {
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});

cc._RF.pop();