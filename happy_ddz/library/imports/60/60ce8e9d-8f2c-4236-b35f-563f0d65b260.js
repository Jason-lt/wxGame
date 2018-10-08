"use strict";
cc._RF.push(module, '60ce86djyxCNrNfVj8NZbJg', 'ddz_tipswindow_createRoom_item');
// Script/ComponentScript/component/ddz_tipswindow_createRoom_item.js

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
        titleLabel: {
            default: null,
            type: cc.Label
        },
        selectedSprite: {
            default: null,
            type: cc.Sprite
        }
    },
    onLoad: function onLoad() {},
    setSelectedState: function setSelectedState(selected) {
        this.selectedSprite.node.active = selected;
        if (selected) {
            this.titleLabel.color = cc.color(253, 80, 81, 1);
        } else {
            this.titleLabel.color = cc.color(26, 105, 81, 1);
        }
    },
    setTitleString: function setTitleString(titleString) {
        this.titleLabel.string = titleString;
    }
    // update (dt) {},
});

cc._RF.pop();