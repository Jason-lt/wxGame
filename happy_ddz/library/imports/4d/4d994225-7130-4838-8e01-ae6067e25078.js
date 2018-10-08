"use strict";
cc._RF.push(module, '4d994IlcTBIOI4BrmBn4lB4', 'ddz_bubble_tips');
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
        } else {
            this.bgSpr.node.setScaleX(-1);
            this.bgSpr.node.setScaleY(-1);
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