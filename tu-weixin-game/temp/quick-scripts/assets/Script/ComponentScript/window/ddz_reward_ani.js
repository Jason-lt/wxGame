(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_reward_ani.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd8048wxvrZKYrrJFLeUB7Zm', 'ddz_reward_ani', __filename);
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
        //# sourceMappingURL=ddz_reward_ani.js.map
        