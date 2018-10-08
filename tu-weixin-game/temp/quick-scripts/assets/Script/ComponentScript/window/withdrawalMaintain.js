(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/withdrawalMaintain.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1d87dydaNBBS5mhE0g9wnbD', 'withdrawalMaintain', __filename);
// Script/ComponentScript/window/withdrawalMaintain.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        tips: cc.Label,
        backSprite: {
            default: null,
            type: cc.Sprite
        },
        texture: cc.Texture2D,
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    onLoad: function onLoad() {
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 491;
        tempCanvas.height = 383;
        var context = tempCanvas.getContext("2d");
        var image = wx.createImage();
        image.src = ty.SystemInfo.cdnPath + "res/raw-assets/resources/main/withdrawal_icon.png";
        var that = this;
        image.onload = function (event) {
            var img = event.target;
            context.drawImage(img, 0, 0, 491, 383);
            that.texture = new cc.Texture2D();
            that.spriteFrame = new cc.SpriteFrame(this.texture);
            that.texture.initWithElement(tempCanvas);
            that.texture.handleLoadedTexture();
            that.backSprite.spriteFrame = that.spriteFrame;
            that.backSprite.spriteFrame._refreshTexture(that.texture);
        };
    },

    setTips: function setTips(timerStr) {
        this.tips.string = timerStr;
    }
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
        //# sourceMappingURL=withdrawalMaintain.js.map
        