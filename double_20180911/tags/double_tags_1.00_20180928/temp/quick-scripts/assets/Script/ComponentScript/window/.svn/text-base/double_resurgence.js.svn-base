(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/double_resurgence.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bf3fctA0qNCtLX/FYld5MWM', 'double_resurgence', __filename);
// Script/ComponentScript/window/double_resurgence.js

'use strict';

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
        scoreLabel: {
            default: null,
            type: cc.Label
        },

        rankTexture: cc.Texture2D,
        rankSpriteFrame: cc.SpriteFrame,
        rankSprite: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:


    blackAction: function blackAction() {},
    backAction: function backAction() {},
    onLoad: function onLoad() {
        ty.NotificationCenter.listen(double.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        this.scoreLabel.string = double.GameWorld.totalScore + "";
        this.setRankNextInfo();
    },

    setRankNextInfo: function setRankNextInfo() {
        var openDataContext = double.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 584;
        sharedCanvas.height = 110;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        var main = function main() {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, 1 / 10, 5000);

        double.GlobalFuncs.getThirdRankInfo();
    },

    justNowAction: function justNowAction() {
        double.GlobalFuncs.showGameOverResult();
        this.node.destroy();
    },
    resurgenceAction: function resurgenceAction() {
        double.Share.shareWithType(double.Share.onShareType.clickStatShareTypeAddBullet);
    },
    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {

        if (shareType && shareType == double.Share.onShareType.clickStatShareTypeOpenSecretBoxB) {
            var resultType = double.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({ title: '分享到群才有效哦~' });
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({ title: '这个群今天已经打扰过了哦~' });
                    break;
                case 3:
                    ty.NotificationCenter.trigger(double.EventType.GAME_START, true);
                    this.node.destroy();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({ title: '分享失败' });
                    break;
                default:
                    hall.MsgBoxManager.showToast({ title: '分享失败了' });
                    break;
            }
        }
        double.Share.resultType = 0;
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

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
        //# sourceMappingURL=double_resurgence.js.map
        