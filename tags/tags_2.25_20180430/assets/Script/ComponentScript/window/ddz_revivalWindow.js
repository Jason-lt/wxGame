
cc.Class({
    extends: cc.Component,

    properties: {
        backBg : {
            default : null,
            type  : cc.Button
        },
        contentRichText : cc.RichText,
        leftButton : cc.Button,
        centerButton : cc.Button,
        rightButton : cc.Button,

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
            case 2:{
                //好像没啥事可干
                this.node.removeFromParent();
                break;
            }
            case 3:{
                break;
            }
        }
    },
    playAnimationAfterShareWithType : function () {
        var type = ddz.Share.resultType;
        hall.LOGE("=====", "=======playAnimationAfterShareWithType======="+type);
        switch (type) {
            case 1:
                hall.MsgBoxManager.showToast({"title":"只有分享到微信群才有效哦~"});
                // this.tipsLabel.string = "只有分享到微信群才有效哦~";
                // this.showTips();
                break;
            case 2:
                hall.MsgBoxManager.showToast({"title":"这个群已经分享过啦，分享到其他群吧"});
                // this.tipsLabel.string = "这个群已经分享过啦，分享到其他群吧";
                // this.showTips();
                break;
            case 3:
                //发送复活消息
                var needCount = ddz.matchModel.getDiamondCountNeeded();
                hall.LOGE("=====", "resultType========"+needCount);
                ddz.waitGetRevial = {
                    type : 'waitRecive',
                    curCount : 0,
                    needCount : needCount
                };
                //发送得钻石的消息
                for (var i = 0; i < needCount; i++){
                    ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstFail);
                }
                // this.node.removeFromParent();
                this.node.destroy();
                break;
            default:
                this.node.removeFromParent();
                break;
        }
        ddz.Share.resultType = 0;
    },

    setNeedCount:function (val) {
        this._needCount = val;
    },

    showTips:function () {
        this.tipsLabel.node.active = true;
    },

    onClickCenterButton:function (event,number) {
        hall.LOGE(null,"============onClickCenterButton============="+number);
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.clickType = parseInt(number);
        if(this.clickType == 3){
            //新手福利分享到群
            ddz.Share.shareWithType(ddz.Share.clickStatShareType.clickStatShareTypeRevial);
            ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        }else {
            this.playEndAnimation();
        }
    },

    setShowType : function (type) {
        if(type == 2){
            this.leftButton.node.active = true;
            this.rightButton.node.active = true;
            this.centerButton.node.active = false;
            this.contentRichText.string = "<color=#1A6951>分享到群立即复活<br/>这是新人才有的福利哦~</c>";
        }
    },

    onClose:function (event) {
        this.clickType = 0;
        this.playEndAnimation();
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
