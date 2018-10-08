
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
        }
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

        // var oldcleanup = this.node._sgNode.cleanup;
        //
        // this.node._sgNode.cleanup = function () {
        //     oldcleanup();
        //     that.onCleanUp();
        // };

        // var that = this;
        // setTimeout(function () {
        //     that.shut()
        // }, 500)
    } ,

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
        this.shut();
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
    }

    // update (dt) {},
});
