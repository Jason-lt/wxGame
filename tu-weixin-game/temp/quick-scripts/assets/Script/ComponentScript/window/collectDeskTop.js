(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/collectDeskTop.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b4655/yhx5BXLWcLHcdaSwJ', 'collectDeskTop', __filename);
// Script/ComponentScript/window/collectDeskTop.js

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

/**
 * 收藏桌面引导
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._TAG = "collectDeskTop";
    },

    properties: {

        bgBtn: {
            default: null,
            type: cc.Button
        },

        closeBtn: {
            default: null,
            type: cc.Button
        },

        hand: cc.Node,

        yindao: cc.Prefab
    },

    onLoad: function onLoad() {
        this.isAction = true;
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode');
        anim1.play();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.hand.y = backButtonH - 50;
        }
        var that = this;
        anim1.on('finished', function () {
            that.isAction = false;
            that.yindaoAni = cc.instantiate(this.yindao);
            that.hand.addChild(that.yindaoAni);
            var ani = that.yindaoAni.getComponent(cc.Animation);
            var clipName = ani.getClips()[0].name;
            var anim = ani.getAnimationState(clipName);
            anim.once("finished", function () {});
            anim.play();
        }, this);
    },

    playEndAnimation: function playEndAnimation() {
        this.isAction = false;
        if (this.yindaoAni) {
            this.yindaoAni.removeFromParent();
        }
        this.node.destroy();
    },

    onClose: function onClose(event) {
        if (this.isAction) {
            return;
        }
        this.playEndAnimation();
    }

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
        //# sourceMappingURL=collectDeskTop.js.map
        