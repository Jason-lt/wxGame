"use strict";
cc._RF.push(module, 'd04b4ZZ4fRNlb/8ZQMrpOza', 'ddz_item_ft_chat');
// Script/ComponentScript/component/ddz_item_ft_chat.js

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
        bgSprite: {
            default: null,
            type: cc.Sprite
        },
        msgLabel: {
            default: null,
            type: cc.Label
        }
    },

    setDetailMsg: function setDetailMsg(msg) {
        this.msgLabel.string = msg;
        var allWidth = this.msgLabel.node.width;
        // if(this.isReverse){
        //     this.msgLabel.x = 50-allWidth;
        // }else {
        //     this.msgLabel.x = -50;
        // }
        this.bgSprite.node.width = allWidth + 30;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();