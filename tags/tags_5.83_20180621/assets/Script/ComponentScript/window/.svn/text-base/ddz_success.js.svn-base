
cc.Class({
    extends: cc.Component,

    properties: {
        resultTitle : {
            default : null,
            type : cc.Node
        },
        progress : {
            default : null,
            type : cc.Node
        },
        buttons : {
            default : null,
            type : cc.Node
        },
        backButton : {
            default : null,
            type : cc.Button
        },

        bottomBtnText:cc.RichText,
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad :function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
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

        if (!ddz.curBannerAd) {
            hall.adManager.showBannerAd('adunit-115c604197e9e3a6');
        }
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_ALL_MATCH_RESULT_PANEL, this.shut, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        var _shareType = ddz.Share.onShareType.clickStatShareTypeCustomsSuccess;
        this.bottomBtnText.string = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
    },

    playAnimationAfterShareWithType : function (shareType) {
        // 分享领取通关红包
        if (shareType && shareType != ddz.Share.onShareType.clickStatShareTypeCustomsSuccess) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                break;
            case 2:
                hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        this.removeAni();
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    onTopButtonAction : function () {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.matchModel.matchChallenge();
        ddz.GlobalFuncs.removeMatchResultPanel(this);
    },

    onBottomButtonAction : function () {
        var shareType = ddz.Share.onShareType.clickStatShareTypeCustomsSuccess;
        ddz.Share.shareWithType(shareType);
    },

    shut:function () {
        ddz.matchResultPanel = null;
        this.removeAni();
        this.node.destroy();
    },
    _onPreDestroy:function () {
        this._super();
        //删除动画
        this.removeAni();
    },
    removeAni:function () {
        if (this.resultTitle){
            this.resultTitle.removeFromParent();
        }
        if (this.progress){
            this.progress.removeFromParent();
        }
    },
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
        hall.adManager.destroyBannerAd();
    }

    // update (dt) {},
});
