"use strict";
cc._RF.push(module, '2c541TAMJ1GmJ20gp3FBmrE', 'boxTipsNode');
// Script/ComponentScript/component/boxTipsNode.js

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
        betLabel: cc.Label,

        boxText: cc.RichText,

        boxSprite: cc.Sprite,
        boxSpriteFrame: [cc.SpriteFrame]
    },

    onLoad: function onLoad() {},

    setBoxTips: function setBoxTips(windoubles, desc, index) {
        if (desc == "黄金宝箱" || desc == "春天宝箱") {
            this.boxText.string = "<color=#1A6951>" + desc + "</c><br/><color=#F64E50><size=23> (内含红包)</c>";
        } else {
            this.boxText.string = "<color=#1A6951>" + desc + "</c>";
        }

        if (windoubles == "") {
            this.betLabel.string = "春天";
            this.boxSprite.spriteFrame = this.boxSpriteFrame[3];
        } else {
            this.betLabel.string = windoubles + "倍";
            this.boxSprite.spriteFrame = this.boxSpriteFrame[index];
        }
    }
});

cc._RF.pop();