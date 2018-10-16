(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ProgressBarSub.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c0cd3aWaHRGdYx4eepbO1RJ', 'ProgressBarSub', __filename);
// Script/ComponentScript/component/ProgressBarSub.js

'use strict';

/**
 *比赛进度条节点
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {},

    properties: {
        ptLeft: cc.Sprite,
        ptRight: cc.Sprite,
        txtLeft: cc.Label,
        txtRight: cc.Label,

        lineMask: cc.Mask,
        lineDarkR: cc.Mask,
        spFrameLight: cc.SpriteFrame,
        spFrameDark: cc.SpriteFrame
    },

    initWith: function initWith(obj) {

        this._type = obj['type'];
        this._numLeft = obj['numLeft'];
        this._numRight = obj['numRight'];
        this._needShowLeft = obj['needShowLeft'];
        this._needShowRight = obj['needShowRight'];

        this.txtLeft.string = this._numLeft + "";
        this.txtRight.string = this._numRight + "";

        this.ptLeft.node.active = this._needShowLeft;
        this.lineDarkR.node.active = this._needShowRight;

        if (this._type == 0) {
            //未达成
            this.lineMask.node.width = 0;
            this.ptRight.spriteFrame = this.spFrameDark;
        } else if (this._type == 1) {
            //已经达成
            this.lineMask.node.width = 70;
            this.ptRight.spriteFrame = this.spFrameLight;
        }
    },

    reset: function reset() {
        this._type = 0;
        this._numLeft = 0;
        this._numRight = 0;
        this._needShowLeft = false;
        this._needShowRight = false;

        this.ptLeft.node.active = false;
        this.lineDarkR.node.active = false;
        this.lineMask.width = 0;
        this.ptRight.spriteFrame = this.spFrameDark;
    },

    forward: function forward() {

        var that = this;
        var ani = this.getComponent(cc.Animation);
        var aniState = ani.getAnimationState('forward');
        aniState.once('finished', function () {
            that.ptRight.spriteFrame = that.spFrameLight; //更新节点背景
            ty.NotificationCenter.trigger(ddz.EventType.STAGE_FORWARD, that._numRight);
        }, this);

        aniState.play();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update:function (dt) {
    //
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
        //# sourceMappingURL=ProgressBarSub.js.map
        