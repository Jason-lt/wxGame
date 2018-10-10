"use strict";
cc._RF.push(module, 'a57d1Jz/4tHKq69BnA19O37', 'double_pause');
// Script/ComponentScript/window/double_pause.js

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

    properties: {},

    blackAction: function blackAction() {},
    backAction: function backAction() {},
    mainPageAction: function mainPageAction() {
        ty.NotificationCenter.trigger(double.EventType.GAME_OVER);
        double.GlobalFuncs.showTitlePage();
        this.node.removeFromParent();
    },
    continueAction: function continueAction() {
        this.node.removeFromParent();
        double.GameWorld.gamePause = false;
    },
    shareAction: function shareAction() {
        double.Share.shareWithType(double.Share.onShareType.clickStatShareTypeAddBullet);
    },
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});

cc._RF.pop();