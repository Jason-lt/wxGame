"use strict";
cc._RF.push(module, 'cf422bCsrlGaKgLY7CCCNty', 'countDown');
// Script/ComponentScript/component/countDown.js

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
        // countLabel : {
        //     default : null,
        //     type : cc.Label
        // },
        countSprite: {
            default: null,
            type: cc.Sprite
        },
        countSpriteFramelist: [cc.SpriteFrame],
        count: 3
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        ty.Timer.setTimer(this, this.countDown, 1, 4);
    },
    onBlack: function onBlack() {},
    countDown: function countDown() {
        this.count--;
        if (this.count > 0) {
            this.countSprite.spriteFrame = this.countSpriteFramelist[this.count - 1];
            // this.countLabel.string = this.count + "";
        } else {
            ty.Timer.cancelTimer(this, this.countDown);
            // ty.NotificationCenter.trigger(shot.EventType.GAME_RESTART,"resurgence");
            this.node.destroy();
        }
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // update (dt) {},
});

cc._RF.pop();