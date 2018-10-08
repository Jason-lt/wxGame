(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_bubble_tips.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4d994IlcTBIOI4BrmBn4lB4', 'ddz_bubble_tips', __filename);
// Script/ComponentScript/component/ddz_bubble_tips.js

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
        bgSpr: cc.Sprite,
        tips: cc.Label,
        bgSpriteFrame: [cc.SpriteFrame]
    },

    onLoad: function onLoad() {},

    setTips: function setTips(str, isTable) {
        this.tips.string = str;
        var t_size = this.tips.node.getContentSize();
        var size = this.bgSpr.node.getContentSize();
        var _interval = 35;
        if (isTable) {
            _interval = 15;
            this.bgSpr.spriteFrame = this.bgSpriteFrame[1];
            this.tips.node.y = -6;
        }
        size.width = t_size.width + _interval;
        this.bgSpr.node.setContentSize(size);
        ty.Timer.setTimer(this, this.closeAction, 5);
    },

    closeAction: function closeAction() {
        this.node.destroy();
    }

    // setBgScale:function(scale){
    //     this.bgSpr.node.setScaleY(scale);
    //     this.tips.node.y = -6;
    // },
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
        //# sourceMappingURL=ddz_bubble_tips.js.map
        