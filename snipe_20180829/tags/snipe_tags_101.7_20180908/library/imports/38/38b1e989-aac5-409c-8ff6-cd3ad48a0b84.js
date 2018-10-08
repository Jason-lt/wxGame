"use strict";
cc._RF.push(module, '38b1emJqsVAnI/2zTrUiguE', 'shot_toast_tips');
// Script/ComponentScript/component/shot_toast_tips.js

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
            // foo: {
            //     // ATTRIBUTES:
            //     default: null,        // The default value will be used only when the component attaching
            //                           // to a node for the first time
            //     type: cc.SpriteFrame, // optional, default is typeof default
            //     serializable: true,   // optional, default is true
            // },
            // bar: {
            //     get () {
            //         return this._bar;
            //     },
            //     set (value) {
            //         this._bar = value;
            //     }
            // },
        } },
    setTitleWithString: function setTitleWithString(titleString) {
        // this.bgSprite.width = titleString.length * 10;
        this.titleLabel.string = titleString;
        ty.Timer.setTimer(this, this.closeAction, 1.5);
    },

    closeAction: function closeAction() {
        this.node.destroy();
        shot.msgBoxNode = null;
    },
    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();