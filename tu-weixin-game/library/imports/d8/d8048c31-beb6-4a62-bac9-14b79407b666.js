"use strict";
cc._RF.push(module, 'd8048wxvrZKYrrJFLeUB7Zm', 'ddz_reward_ani');
// Script/ComponentScript/window/ddz_reward_ani.js

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
        aniNode: cc.Node,
        number: cc.Label
    },

    onLoad: function onLoad() {},

    playAni: function playAni() {
        var ani = this.aniNode.getComponent(cc.Animation);
        var anim = ani.getAnimationState("huode_01");
        anim.play();
    },

    stopAni: function stopAni() {
        var ani = this.aniNode.getComponent(cc.Animation);
        var anim = ani.getAnimationState("huode_01");
        anim.stop();
    },

    setNumber: function setNumber(num) {
        this.playAni();
        this.number.string = "x" + num + "元";
    },

    onClose: function onClose() {
        this.stopAni();
        this.node.destroy();
        ddz.rewardAni = null;
    }

    // update (dt) {},
});

cc._RF.pop();