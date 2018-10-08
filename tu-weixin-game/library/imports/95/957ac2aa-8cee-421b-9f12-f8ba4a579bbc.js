"use strict";
cc._RF.push(module, '957acKqjO5CG58S+LpKV5u8', 'LaiZiAni');
// Script/ComponentScript/component/LaiZiAni.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
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
    },

    showLaiziCard: function showLaiziCard(val) {
        //在屏幕上添加癞子牌
        ty.NotificationCenter.trigger(ddz.EventType.SHOW_LAIZI_ON_TABLE);
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();