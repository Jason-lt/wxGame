"use strict";
cc._RF.push(module, '8c4d6hGmHZE3ZNIBF1eODYg', 'ddz_toast_cell');
// Script/ComponentScript/component/ddz_toast_cell.js

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
        bgSprite: {
            default: null,
            type: cc.Sprite
        }
    },

    setTitleWithString: function setTitleWithString(titleString) {
        // this.bgSprite.width = titleString.length * 10;
        this.titleLabel.string = titleString;
        var t_size = this.titleLabel.node.getContentSize();
        var size = this.bgSprite.node.getContentSize();
        size.height = t_size.height + 31;
        this.bgSprite.node.setContentSize(size);
        ty.Timer.setTimer(this, this.closeAction, 3);
    },

    closeAction: function closeAction() {
        if (ddz.toastNode) {
            ty.Timer.cancelTimer(this, function () {});
            this.node.destroy();
            ddz.toastNode = null;
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});

cc._RF.pop();