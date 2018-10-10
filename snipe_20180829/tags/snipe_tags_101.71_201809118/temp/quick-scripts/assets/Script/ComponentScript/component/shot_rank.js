(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/shot_rank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f3bePyovBA7L8v+8b9sGVr', 'shot_rank', __filename);
// Script/ComponentScript/component/shot_rank.js

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
        backButton: {
            default: null,
            type: cc.Button
        },
        seeHolkButton: {
            default: null,
            type: cc.Button
        },
        startGameButton: {
            default: null,
            type: cc.Button
        },
        titleLabel: cc.RichText,

        rankSprite: cc.Sprite,

        texture: cc.Texture2D,
        spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },

        shareTicket: ""
    },
    backAction: function backAction() {
        ty.NotificationCenter.trigger(shot.EventType.UPDATE_RESULT_RANK);
        shot.LOGD(null, "backAction");
        this.node.destroy();
    },
    onBlack: function onBlack() {},
    useModel: function useModel() {},
    // LIFE-CYCLE CALLBACKS:
    ctor: function ctor() {},
    onLoad: function onLoad() {
        shot.GlobalFuncs.drawGameCanvas();
        var backButtonH = shot.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backButton.node.y = backButtonH;
        }

        var openDataContext = shot.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 566;
        sharedCanvas.height = 1890;

        shot.GlobalFuncs.showOrigin();
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function main() {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, 1 / 10, 1000);
        // ddz.matchModel.getRankList();
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType != shot.Share.onShareType.clickStatShareTypeRankList) {
            return;
        }
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config) {
            var reultType = shot.Share.resultType;
            switch (reultType) {
                case 1:
                    hall.MsgBoxManager.showToast({ title: '分享到群才有效哦~' });
                    break;
                default:
                    break;
            }
        } else {
            hall.MsgBoxManager.showToast({ title: "可入群查看自己的排行哦~" });
        }

        shot.Share.resultType = 0;
    },
    showRankListForShare: function showRankListForShare() {
        // hall.LOGD("==","file = [ddz_rank] fun = [showRankListForShare] data = " + JSON.stringify(this.shareTicket));
        this.unscheduleAllCallbacks();
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if (!openDataContext) {
            return;
        }
        var sharedCanvas = openDataContext.canvas;
        if (!this.shareTicket || this.shareTicket == "") {
            shot.GlobalFuncs.showFriendRank();
        } else {
            shot.GlobalFuncs.showGroupRank(this.shareTicket);
        }
        // shot.GlobalFuncs.showGroupRank(this.shareTicket,this.rankType);
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function main() {
            texture.initWithElement(sharedCanvas);
            texture.handleLoadedTexture();
            sprite.spriteFrame = spriteFrame;
            sprite.spriteFrame._refreshTexture(texture);
        };
        ty.Timer.setTimer(this, main, 1 / 10, 1000);
    },
    changeButtonToRank: function changeButtonToRank(shareTicket) {
        this.shareTicket = shareTicket;
        this.showRankListForShare();
        if (shareTicket && shareTicket != "") {
            this.titleLabel.string = "<color=#F1A955><b>群排行</b></c>";
            this.seeHolkButton.node.active = false;
            this.startGameButton.node.active = true;
        } else {
            this.titleLabel.string = "<color=#F1A955><b>好友排行</b></c>";
            this.seeHolkButton.node.active = true;
            this.startGameButton.node.active = false;
        }
    },
    onRankButton: function onRankButton() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["groupRankAtRank"]);
        var shareType = shot.Share.onShareType.clickStatShareTypeRankList;
        shot.Share.shareWithType(shareType);
    },
    onStartButton: function onStartButton() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["startGameAtRank"]);
        this.hideBackButton();
        var curScene = cc.director.getScene();
        if (curScene.name == 'shot_main') {
            ty.NotificationCenter.trigger(shot.EventType.GAME_START, "start");
        } else {
            var sceneName = 'shot_main';
            var onLaunched = function onLaunched() {};
            cc.director.loadScene(sceneName, onLaunched);
        }
        this.node.destroy();
    },
    start: function start() {},
    onDestroy: function onDestroy() {
        shot.gameModel.rankWindow = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    },
    hideBackButton: function hideBackButton() {
        this.backButton.node.active = false;
    },

    showBackButton: function showBackButton() {
        this.backButton.node.active = true;
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
        //# sourceMappingURL=shot_rank.js.map
        