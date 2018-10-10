(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/double_result.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '67eabQgCl5LlaIqSuS36Isq', 'double_result', __filename);
// Script/ComponentScript/window/double_result.js

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
        nowScoreLabel: {
            default: null,
            type: cc.Label
        },
        bestScoreLabel: {
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
    onLoad: function onLoad() {},

    updateResultInfo: function updateResultInfo() {
        this.nowScoreLabel.string = double.GameWorld.totalScore + "";

        var bestScore = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_BEST_SCORE, "0");
        if (bestScore < double.GameWorld.totalScore) {
            bestScore = double.GameWorld.totalScore;
            hall.GlobalFuncs.setInLocalStorage(double.gameModel.GAME_BEST_SCORE, bestScore);
        }
        this.bestScoreLabel.string = "本周最佳:" + bestScore;

        this.setRankInfo();
    },
    setRankInfo: function setRankInfo() {
        var openDataContext = double.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 580;
        sharedCanvas.height = 300;
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

    showAllRank: function showAllRank() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["showAllRank"]);
        double.GlobalFuncs.showRankList("");
    },
    playNextGame: function playNextGame() {
        ty.NotificationCenter.trigger(double.EventType.GAME_START);
        this.node.destroy();
    },
    showBest: function showBest() {
        double.Share.shareWithType(double.Share.onShareType.clickStatShareTypeAddBullet);
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
        //# sourceMappingURL=double_result.js.map
        