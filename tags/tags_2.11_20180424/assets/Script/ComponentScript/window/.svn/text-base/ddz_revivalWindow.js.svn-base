
cc.Class({
    extends: cc.Component,

    properties: {
        backBg : {
            default : null,
            type  : cc.Button
        },
        coloseButton : {
            default : null,
            type : cc.Button
        },
        btnOk:cc.Button,
        tipsLabel: cc.Label
    },

    onLoad : function () {
        var animation = this.getComponent(cc.Animation);
        animation.play('tipsWindowNode');
    },

    playEndAnimation : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('tipsWindowNode2');
        anim1.on('finished', this.completeAni,this);
        anim1.play();
    },
    completeAni : function () {

        var that = this;
        switch (this.clickType){
            case 0:{
                //好像没啥事可干
                this.node.removeFromParent();
                break;
            }
            case 1:{
                ddz.Share.shareWithType(ddz.Share.clickStatShareType.clickStatShareTypeRevial, function (result) {
                    //分享成功,
                    if (result.hasOwnProperty('shareTickets')){
                        //分享到了群,
                        ddz.LOGD("ddz_revivalWindow", "分享到了群!");
                        var needCount = ddz.matchModel.getDiamondCountNeeded();
                        ddz.waitGetRevial = {
                            type : 'send',
                            needCount : needCount
                        }
                    }
                    else{
                        ddz.LOGD("ddz_revivalWindow", "分享到了个人!");
                        ddz.waitGetRevial = {
                            type : 'showWindow'
                        };
                    }
                    that.node.removeFromParent();
                },
                function () {
                    ddz.LOGD("ddz_revivalWindow", "取消分享!");
                    that.node.removeFromParent();
                });
                break;
            }
        }
        // this.node.removeFromParent();
    },

    setNeedCount:function (val) {
        this._needCount = val;
    },

    showTips:function () {
        this.tipsLabel.node.active = true;
    },

    onClickCenterButton:function (event) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.clickType = 1;
        this.playEndAnimation();
    },

    onClose:function (event) {
        this.clickType = 0;
        this.playEndAnimation();
    },

    onDestory : function () {
        this.unscheduleAllCallbacks();
    }

});
