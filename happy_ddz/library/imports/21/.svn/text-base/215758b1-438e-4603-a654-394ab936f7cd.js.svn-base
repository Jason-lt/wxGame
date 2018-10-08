"use strict";
cc._RF.push(module, '21575ixQ45GA6ZUOUq5NvfN', 'award_tips');
// Script/ComponentScript/window/award_tips.js

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
        backBg: {
            default: null,
            type: cc.Button
        },
        coloseButton: {
            default: null,
            type: cc.Button
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
    },

    playEndAnimation: function playEndAnimation() {
        // var animation = this.getComponent(cc.Animation);
        this.node.destroy();
    },

    onClose: function onClose(event) {
        if (this.isAction) {
            return;
        }
        this.isAction = true;
        this.playEndAnimation();
    },
    onDestroy: function onDestroy() {}
});

cc._RF.pop();