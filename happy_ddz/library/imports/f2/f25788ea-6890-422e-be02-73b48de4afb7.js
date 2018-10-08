"use strict";
cc._RF.push(module, 'f2578jqaJBCLr4Cc7SN5K+3', 'ddz_redPacket');
// Script/ComponentScript/component/ddz_redPacket.js

"use strict";

// var ddz_redpacket = cc.instantiate(this.ddz_redpacket);
// this.node.addChild(ddz_redpacket);
// var window = ddz_redpacket.getComponent('ddz_redPacket');
// window.setRedPacketNumber(numberString);

cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: {
            default: null,
            type: cc.Label
        },
        numberLabel: {
            default: null,
            type: cc.Label
        },
        tipsLabel: {
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
    setRedPacketNumber: function setRedPacketNumber(numberString) {
        this.numberLabel.string = numberString;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
});

cc._RF.pop();