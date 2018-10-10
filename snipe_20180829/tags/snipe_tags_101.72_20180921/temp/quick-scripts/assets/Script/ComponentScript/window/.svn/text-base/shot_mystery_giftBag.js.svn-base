(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/shot_mystery_giftBag.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'baf4253o7JO549V4jcM5e5g', 'shot_mystery_giftBag', __filename);
// Script/ComponentScript/window/shot_mystery_giftBag.js

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
        centerBtn: cc.Button,
        aniSpriteNode: cc.Node,
        tips: cc.Label,
        tipsRich: cc.RichText,
        btnText: cc.RichText
    },

    onLoad: function onLoad() {
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node, 1.13);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        this.updateTips();
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeMysteryGiftBag || shareType == shot.Share.onShareType.clickStatShareTypeMysteryGiftBagGetReward) {
            var _config = shot.GameWorld.gunnerShareSchemeConfig;
            if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS) {
                var reultType = shot.Share.resultType;
                switch (reultType) {
                    case 1:
                        hall.MsgBoxManager.showToast({ title: '分享到群才有效哦~' });
                        break;
                    case 2:
                        hall.MsgBoxManager.showToast({ title: '这个群今天已经打扰过了哦~' });
                        break;
                    case 3:

                        break;
                    default:
                        break;
                }
            } else {
                hall.MsgBoxManager.showToast({ title: "快进群抢礼包吧~" });
            }
            shot.Share.resultType = 0;
        }
    },

    updateTips: function updateTips() {
        // var _config = shot.GameWorld.gunnerShareSchemeConfig;
        // if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS){
        //     this.btnText.string = "<color=#ffffff><b><size=44>分享/b></color>";
        //     this.tips.string = "分享到群领钻石";
        // }else {
        //     this.btnText.string = "<color=#ffffff><b>进群抢钻石</b></color>";
        //     this.tips.string = "先到先得，抢完为止\n自己也能抢哦~";
        // }

        this.btnText.string = "<color=#ffffff><b><size=44>分享礼包</b></color>";
        this.tipsRich.string = "<color=#622508>分享到群里可以和朋友一起抢</c><img src='shot_gift_diamond'/><color=#622508>哦</c>";
    },

    updateInfo: function updateInfo(result) {
        // if (result.boxId && result.boxId != "") {
        //     shot.Share.shareKeywordReplace.mysteryGiftBagBoxId = result.boxId;
        // }
    },

    onClickCenterButton: function onClickCenterButton() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["mysteryGifgBag"]);
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS) {
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeMysteryGiftBagGetReward);
        } else {
            shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeMysteryGiftBag);
        }
    },

    onClose: function onClose() {
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
    },

    onBlack: function onBlack() {},

    update: function update(dt) {
        // this.aniSpriteNode.rotation += 1;
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
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
        //# sourceMappingURL=shot_mystery_giftBag.js.map
        