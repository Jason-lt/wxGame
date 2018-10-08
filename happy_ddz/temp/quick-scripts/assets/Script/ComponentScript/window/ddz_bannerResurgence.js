(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_bannerResurgence.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a10afWirvRK6a3Yt450rdcf', 'ddz_bannerResurgence', __filename);
// Script/ComponentScript/window/ddz_bannerResurgence.js

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
        btnText: cc.Label,
        closeAdBtn: cc.Button,
        yindao: cc.Node
    },

    onLoad: function onLoad() {
        this.closeAdBtn.interactable = false;
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.closeAdBtn.node.y = backButtonH;
        }
        this.updateBtnTextTimer();

        // if (!ddz.resurgenceBannerAd){
        //     hall.adManager.showResurgenceBannerAd('adunit-811cc4e234425489');
        // }
        hall.adManager.showResurgenceBannerAd('adunit-811cc4e234425489');
        var ani = this.yindao.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        anim.once("finished", function () {});
        anim.play();
    },

    updateBtnTextTimer: function updateBtnTextTimer() {
        var bc = ddz.gameModel.getBannerResurgenceConfigJson();
        var timer = 15;
        if (bc) {
            if (bc.delay) {
                timer = bc.delay;
            }
        }
        this.setBtnSize(timer);
        var that = this;
        var callBack = function callBack() {
            timer--;
            if (timer <= 0) {
                ty.Timer.cancelTimer(that, function () {});
                that.closeAdBtn.interactable = true;
                that.setBtnSize("关闭广告");
            } else {
                that.setBtnSize(timer);
            }
        };
        ty.Timer.setTimer(this, callBack, 1);
    },

    setBtnSize: function setBtnSize(_string) {
        this.btnText.string = _string;
        var size = this.closeAdBtn.node.getContentSize();

        if (_string == "关闭广告") {
            size.width = 160;
        } else {
            size.width = 80;
        }
        this.closeAdBtn.node.setContentSize(size);
        this.btnText.node.x = size.width / 2;
    },

    onClickCenterBtn: function onClickCenterBtn() {
        var matchCondition = ddz.GlobalFuncs.getFailCondition("match", ddz.GlobalFuncs.checkFailCount("match"));
        if (matchCondition) {
            var _toNext = matchCondition.resurgenceCondition.toNext;
            if (_toNext) {
                ddz.matchModel.matchBackNextLevel();
                this.onClose();
                return;
            } else {
                var needCount = ddz.matchModel.getDiamondCountNeeded();
                ddz.waitGetRevial = {
                    type: 'waitRecive',
                    curCount: 0,
                    needCount: needCount
                };
            }
            var needCountR = ddz.waitGetRevial.needCount;
            //发送得钻石的消息
            for (var i = 0; i < needCountR; i++) {
                ddz.gameModel.shareToGetreward(ddz.waitGetRevial.sharePoint || ddz.Share.SharePointType.firstFail);
            }
            this.onClose();
        } else {
            this.onClose();
        }
    },

    onClose: function onClose() {
        ddz.bannerResurgenceWindow = null;
        var ani = this.yindao.getComponent(cc.Animation);
        ani.stop();
        this.yindao.removeFromParent();
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        // hall.adManager.destroyResurgenceBannerAd();
        hall.adManager.destroyWidthBannerAd();
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
        //# sourceMappingURL=ddz_bannerResurgence.js.map
        