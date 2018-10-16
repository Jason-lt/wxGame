"use strict";
cc._RF.push(module, '790bbpMzfZFToVeafB/1VMX', 'box_up');
// Script/ComponentScript/component/box_up.js

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

        boxSprite_1: cc.Sprite,
        boxSprite_2: cc.Sprite,

        boxSpriteFrame: [cc.SpriteFrame]
    },

    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
    },

    setBoxSprite: function setBoxSprite(box_type) {
        this.node.active = true;
        switch (box_type) {
            case "青铜宝箱":
                this.boxSprite_1.spriteFrame = this.boxSpriteFrame[2];
                this.boxSprite_2.spriteFrame = this.boxSpriteFrame[0];
                break;
            case "白银宝箱":
                this.boxSprite_1.spriteFrame = this.boxSpriteFrame[0];
                this.boxSprite_2.spriteFrame = this.boxSpriteFrame[1];
                break;
            case "黄金宝箱":
                this.boxSprite_1.spriteFrame = this.boxSpriteFrame[1];
                this.boxSprite_2.spriteFrame = this.boxSpriteFrame[2];
                break;
            case "春天宝箱":
                this.boxSprite_1.spriteFrame = this.boxSpriteFrame[2];
                this.boxSprite_2.spriteFrame = this.boxSpriteFrame[3];
                break;
            default:
                break;
        }

        var ani = this.node.getComponent(cc.Animation);
        var anim1 = ani.getAnimationState('box_up');
        var that = this;
        anim1.once("finished", function () {
            that.node.active = false;
        });
        anim1.play();
    },

    onRemoveAni: function onRemoveAni() {
        var ani = this.node.getComponent(cc.Animation);
        var anim_1 = ani.getAnimationState('box_up');
        anim_1.stop();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    },
    onClose: function onClose() {}
});

cc._RF.pop();