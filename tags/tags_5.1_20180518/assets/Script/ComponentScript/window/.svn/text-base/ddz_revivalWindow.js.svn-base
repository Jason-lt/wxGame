
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

        leftButtonLabel : cc.Label,

        tipsLabel: cc.Label,
        isGreenHand : false, //是否是新手复活
        isOnShare : false, //是否处于分享状态
        isWin : false
    },

    onLoad : function () {
        var animation = this.getComponent(cc.Animation);
        animation.play('tipsWindowNode');
    },

    playEndAnimation : function () {
        this.completeAni();
    },
    completeAni : function () {
        this.isOnShare = false;
        var that = this;
            switch (this.clickType){
            case 0:{
                this.node.destroy();
                break;
            }
            case 1:{
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeRevial, function (result) {
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
                    that.node.destroy();
                },
                function () {
                    ddz.LOGD("ddz_revivalWindow", "取消分享!");
                    that.node.destroy();
                });
                break;
            }
            case 2:{
                this.node.destroy();
                break;
            }
            case 3:{
                break;
            }
        }
    },
    playAnimationAfterShareWithType : function () {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        var type = ddz.Share.resultType;
        hall.LOGW("=====", "=======playAnimationAfterShareWithType======="+type);
        switch (type) {
            case 1:
                hall.MsgBoxManager.showToast({"title":"只有分享到微信群才有效哦~"});
                break;
            case 2:
                hall.MsgBoxManager.showToast({"title":"这个群已经分享过啦，分享到其他群吧"});
                break;
            case 3:
                if(this.isGreenHand){
                    //发送复活消息
                    var needCount = ddz.matchModel.getDiamondCountNeeded();
                    hall.LOGW("=====", "resultType========"+needCount);
                    ddz.waitGetRevial = {
                        type : 'waitRecive',
                        curCount : 0,
                        needCount : needCount
                    };
                    //发送得钻石的消息
                    for (var i = 0; i < needCount; i++){
                        ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstFail);
                    }
                    this.node.destroy();
                }else {
                    if(this.isWin){
                        ddz.gameModel.getWinLoseShareReward(parseInt(1));
                    }else {
                        ddz.gameModel.getWinLoseShareReward(parseInt(0));
                    }
                    ty.NotificationCenter.listen(ddz.EventType.UPDATE_WINLOSESHAREREWARD,this.reciveWinLoseShareReward,this);
                }
                break;
            default:
                this.node.destroy();
                break;
        }
        ddz.Share.resultType = 0;
    },

    reciveWinLoseShareReward : function (result) {
        // hall.LOGW("===","=====reciveWinLoseShareReward====="+JSON.stringify(result));
        ddz.GlobalFuncs.playZuanShi(false,this,result.rewardChip,true);
        this.node.destroy();
    },

    setNeedCount:function (val) {
        this._needCount = val;
    },

    showTips:function () {
        this.tipsLabel.node.active = true;
    },

    onClickCenterButton:function (event,number) {
        // hall.LOGW(null,"============onClickCenterButton============="+number);
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        if(this.isOnShare){
            return;
        }
        this.isOnShare = true;
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.clickType = parseInt(number);
        if(this.clickType == 3){
            //新手福利分享到群,分享引导
            if(this.isGreenHand){
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeRevial);
            }else {
                if(this.isWin){
                    ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeWinAward);
                }else {
                    ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeFailDamage);
                }
            }
            ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        }else {
            this.playEndAnimation();
        }
    },

    changeTypeWithTypeAndParamters : function (isGreenHand,isWin,chipNumber,multiple) {
        this.isOnShare = false;
        this.leftButton.node.active = true;
        this.rightButton.node.active = true;
        this.centerButton.node.active = false;
        this.isGreenHand = isGreenHand;
        if(isGreenHand){
            this.contentRichText.string = "<color=#1A6951>分享到群立即复活<br/>这是新人才有的福利哦~</c>";
            return;
        }
        ddz.Share.shareQuery = multiple+"";
        this.isWin = isWin;
        var resultString;
        var startString;
        var multipleString;
        if(isWin){
            resultString = "奖励";
            startString = "恭喜你！本局共赢 ";
            multipleString = multiple+"倍";
        }else {
            resultString = "补偿";
            startString = "本局共输";
            multipleString = multiple*100+"%";
        }
        this.leftButtonLabel.string = "放弃"+resultString;

        this.contentRichText.string = "<color=#1A6951>"+startString+"<img src='ddz_mall_coin_icon'/> " +
            chipNumber+" <br/> 现在分享到群可获<color=#FD5051>"+multipleString+"</c>"+resultString+"哦~</c>";
    },

    onClose:function (event) {
        this.clickType = 0;
        this.playEndAnimation();
    },

    onDestroy : function () {
        ddz.matchResultPanel2 = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
});
