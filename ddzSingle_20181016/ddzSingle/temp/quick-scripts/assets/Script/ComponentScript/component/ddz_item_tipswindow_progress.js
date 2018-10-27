(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_item_tipswindow_progress.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd8e63QwsFpKXIwnPBASJ23Z', 'ddz_item_tipswindow_progress', __filename);
// Script/ComponentScript/component/ddz_item_tipswindow_progress.js

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

        progressSpriteFrameList: [cc.SpriteFrame],
        centerSprite: {
            default: null,
            type: cc.Sprite
        },
        rightSprite: {
            default: null,
            type: cc.Sprite
        }
    },
    setDissolvePregross: function setDissolvePregross(progress) {
        this.centerSprite.node.active = false;
        this.rightSprite.node.active = false;
        if (progress.length > 1) {
            var progress2 = progress[1];
            this.centerSprite.node.active = true;
            if (progress2 == 1) {
                this.centerSprite.spriteFrame = this.progressSpriteFrameList[3];
            } else if (progress2 == 0) {
                this.centerSprite.spriteFrame = this.progressSpriteFrameList[1];
            } else {
                this.centerSprite.node.active = false;
            }
        }
        if (progress.length > 2) {
            var progress3 = progress[2];
            this.rightSprite.node.active = true;
            if (progress3 == 1) {
                this.rightSprite.spriteFrame = this.progressSpriteFrameList[2];
            } else if (progress3 == 0) {
                this.rightSprite.spriteFrame = this.progressSpriteFrameList[0];
            } else {
                this.rightSprite.node.active = false;
            }
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
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
        //# sourceMappingURL=ddz_item_tipswindow_progress.js.map
        