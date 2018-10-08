"use strict";
cc._RF.push(module, '68e5d9Q/7pA0Jl0fmbtLEHD', 'ddz_success');
// Script/ComponentScript/window/ddz_success.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        resultTitle: {
            default: null,
            type: cc.Node
        },
        progress: {
            default: null,
            type: cc.Node
        },
        buttons: {
            default: null,
            type: cc.Node
        },
        backButton: {
            default: null,
            type: cc.Button
        },

        topButton: cc.Button,

        bottomBtnText: cc.RichText,

        getDiamondIcon: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backButton.node.y = backButtonH;
        }
        // var window = this.resultTitle.getComponent('ddz_resultTitle');
        // window.setTitle(1,true);

        // var windowP = this.progress.getComponent('ddz_progress');
        // windowP.setProgress(4);
        // ddz.AudioHelper.stopMusic();
        ddz.AudioHelper.playMusic('/resources/sound/Upgrade.mp3', false);

        var winSize = cc.director.getWinSize();

        var bg = this.node.getChildByName('ddz_scene_bg_0');

        //全屏适配
        this.node.width = winSize.width;
        this.node.height = winSize.height;

        bg.width = winSize.width;
        bg.height = winSize.height;

        // if (!ddz.curBannerAd) {
        //     hall.adManager.showBannerAd('adunit-115c604197e9e3a6');
        // }

        // if (!ddz.curAllWidthBannerAd){
        //     hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
        // }

        ty.NotificationCenter.listen(ddz.EventType.REMOVE_ALL_MATCH_RESULT_PANEL, this.shut, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE, this.finishShowRewardVideo, this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.errorShowRewardVideo, this);

        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_JIPAIQI,this.updateGetReward,this);
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        // var _shareType = ddz.Share.onShareType.clickStatShareTypeCustomsSuccess;
        // this.bottomBtnText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";

        // hall.GlobalFuncs.btnScaleEffect(this.topButton.node,1.13);

        this.isGetJiPaiQi = false;

        this.jipaiqiAdId = "adunit-8bde7ac62d379503";

        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.addApplet);
    },

    onClickGetDiamondBtn: function onClickGetDiamondBtn() {
        hall.GlobalFuncs.onOfficialAccountGuide(true);
    },

    updateButtonText: function updateButtonText(data) {
        if (data.pointId == ddz.Share.SharePointType.addApplet) {
            if (data.leftCount && data.leftCount > 0 && ddz.GlobalFuncs.judgeweChatVersion()) {
                this.getDiamondIcon.active = true;
                var ani = this.getDiamondIcon.getComponent(cc.Animation);
                ani.play('getdiamond_ani');
            } else {
                this.getDiamondIcon.active = false;
            }
        }
    },

    showResults: function showResults(isShow) {
        this.node.active = isShow;
        if (isShow) {
            hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
            ty.NotificationCenter.trigger(ty.EventType.CREATE_TABLE_AD);
        }
        if (isShow && !ty.UserInfo.isInBSGS) {
            if (ddz.gameModel.throughCount == 0) {
                var bc = ddz.gameModel.getSkipCustomsConfigJson();
                if (bc && bc.newCustoms > 0) {
                    hall.GlobalFuncs.onSkipCustom(1);
                }
            }
        }
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        // 分享领取通关红包
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeCustomsSuccess) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({ title: '请分享到微信群哦~' });
                }
                break;
            case 2:
                if (!ddz.gameModel.isBringVersion) {
                    hall.MsgBoxManager.showToast({ title: '请不要频繁分享到一个群~' });
                }

                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    backAction: function backAction() {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        this.removeAni();
        hall.GlobalFuncs.popScene();
    },

    seeAdGetJiPaiQi: function seeAdGetJiPaiQi() {
        hall.LOGD("=====", "file = [ddz_success] fun = [seeAdGetJiPaiQi] this.jipaiqiAdId = " + this.jipaiqiAdId);
        this.isGetJiPaiQi = true;
        hall.adManager.showRewardedVideo(this.jipaiqiAdId, "getJiPaiQi");
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["watchVideo", "ddzSuccessGetJiPaiQi"]);
    },

    finishShowRewardVideo: function finishShowRewardVideo(isEnded) {
        if (isEnded && this.isGetJiPaiQi) {
            if (ddz.gameModel.firstUseJiPaiQiPoint > 0) {
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstUseJiPaiQi);
            } else {
                ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.adGetJiPaiQi);
            }
            this.isGetJiPaiQi = false;
        }
    },
    errorShowRewardVideo: function errorShowRewardVideo(parArr) {
        this.finishShowRewardVideo(parseInt(parArr[1]));
    },

    onTopButtonAction: function onTopButtonAction() {
        var shareType = ddz.Share.onShareType.clickStatShareTypeCustomsSuccess;
        ddz.Share.shareWithType(shareType);
    },

    onBottomButtonAction: function onBottomButtonAction() {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.matchModel.matchChallenge();
        ddz.GlobalFuncs.removeMatchResultPanel(this);
    },

    shut: function shut() {
        ddz.matchResultPanel = null;
        // this.topButton.node.stopAllActions();
        this.removeAni();
        this.node.destroy();
    },
    _onPreDestroy: function _onPreDestroy() {
        this._super();
        //删除动画
        this.removeAni();
    },
    removeAni: function removeAni() {

        if (this.resultTitle) {
            this.resultTitle.removeFromParent();
        }
        if (this.progress) {
            this.progress.removeFromParent();
        }

        var ani_2 = this.getDiamondIcon.getComponent(cc.Animation);
        ani_2.stop();
        this.getDiamondIcon.removeFromParent();
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        hall.adManager.destroyWidthBannerAd();
        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("tableAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("tableAdNode").hideAdNode();
        }
    }

    // update (dt) {},
});

cc._RF.pop();