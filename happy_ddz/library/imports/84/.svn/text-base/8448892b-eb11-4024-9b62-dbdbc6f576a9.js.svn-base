"use strict";
cc._RF.push(module, '84488kr6xFAJJti29vG9Xap', 'huzhubaoxiang');
// Script/ComponentScript/component/huzhubaoxiang.js

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
        haveReward: cc.Node

    },

    onLoad: function onLoad() {
        var that = this;
        ty.NotificationCenter.listen(ddz.EventType.IS_HAVE_REWARD, this.isHaveReward, this);
        this.scheduleOnce(function () {
            that.playLoopAni();
        }, 1);
    },

    openBox: function openBox() {
        ddz.isClickOpenBox = true;
        ddz.gameModel.getOpenBox();
    },

    isHaveReward: function isHaveReward(data) {
        var _count = 0;
        if (data.rewards) {
            // 未领取
            var _rewards = data.rewards;
            if (_rewards['item:1311'] > 0) {
                _count = _count + _rewards['item:1311'];
            }
            if (_rewards['user:chip'] > 0) {
                _count = _count + _rewards['user:chip'];
            }
        }
        this.haveReward.active = _count > 0;
    },

    stopLoopAni: function stopLoopAni() {
        var animationCom = this.node.getComponent(cc.Animation);
        var ani = animationCom.getAnimationState('baoxiang');
        ani.stop();
    },

    playLoopAni: function playLoopAni() {
        var ani = this.node.getComponent(cc.Animation);
        ani.play('baoxiang');
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }

});

cc._RF.pop();