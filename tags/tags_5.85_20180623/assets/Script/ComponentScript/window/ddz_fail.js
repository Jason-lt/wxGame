
// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor:function () {
        this._curGuangQia = 0;
    },

    properties: {
        resultTitle : {
            default : null,
            type : cc.Node
        },
        buttons : {
            default : null,
            type : cc.Node
        },
        numberlabel :{
            default : null,
            type : cc.RichText
        },
        noticelabel :{
            default : null,
            type : cc.RichText
        },
        backButton : {
            default : null,
            type : cc.Button
        },
        restartButton : {
            default : null,
            type : cc.Button
        },
        adResurgenceTitle : "",
        diamondResurgenceTitle : "",

        titleS : "使用",
        count : "1",

        isOnShare : false,

        conditionType : "",
        failCondition : null,
        toNext : false,
        requestCount : 1,
        nowCount : 0,
        adCount : 1,

        adIds : [],
        nowAdId : ''
    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        // var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },
    setDiamondCount:function (guangQiaNum) {
        ddz.LOGD("","file = [ddz_fail] fun = [setDiamondCount] guangQiaNum = " + guangQiaNum);
        var countNunber = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();

        this._curGuangQia = guangQiaNum;

        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);

        this.numberlabel.string ="<color=#ffffff>已有 </c><img src='dda_button_diamond' height=17 width=21 /><size='36' color='#ffffff'> "+countNunber+" </color>";
        this.diamondResurgenceTitle = "邀请得钻石";
        if (countNunber >= count){
            this.diamondResurgenceTitle = "使用"+count+"个钻石复活";
        }else {
            this.titleS = "邀请得";
            this.diamondResurgenceTitle = "邀请得"+"<img src='dda_button_diamond' height=34 width=42/>";
            if (guangQiaNum && guangQiaNum == 5){
                this.titleS = "分享得";
                var labelS = "<color=#ffffff>分享</color><img src='dda_button_diamond' height=34 width=42/><color=#ffffff>+1</color>";
                this.diamondResurgenceTitle = labelS;
                ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failSix);
            }
        }
        var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
        if(this.adResurgenceTitle && this.adResurgenceTitle != ""){
            comBtnList.setButtonListWithButtons2([{title :this.adResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithAd.bind(this)},
                {title :this.diamondResurgenceTitle,bottomType :1,callFunc : this.resurgenceWithDiamond.bind(this)}]);
        }else {
            comBtnList.setButtonListWithButtons2([{title :this.diamondResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithDiamond.bind(this)}]);
        }
        this.restartButton.node.active = true;
        this.numberlabel.node.active = true;
    },
    over:function (guangQiaNum) {
        ddz.LOGD("","file = [ddz_fail] fun = [over] guangQiaNum = " + guangQiaNum);
        this._curGuangQia = guangQiaNum;
        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);
        var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
        if(this.adResurgenceTitle && this.adResurgenceTitle != ""){
            comBtnList.setButtonListWithButtons2([{title :this.adResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithAd.bind(this)}]);
            this.restartButton.node.active = true;
        }else {
            comBtnList.setButtonListWithButtons2([{title :'重新闯关',left:'ddz_table_again', bottomType :0,callFunc : this.restartQuizAction.bind(this)}]);
        }

        this.overed = true;
    },
    gameFlowOver:function (guangQiaNum,tipsString) {
        ddz.LOGD("","file = [ddz_fail] fun = [gameFlowOver] guangQiaNum = " + guangQiaNum);
        this.noticelabel.node.active = true;
        this.noticelabel.string = tipsString;
        this._curGuangQia = guangQiaNum;
        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);
        var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
        comBtnList.setButtonListWithButtons2([{title :'重闯本关',left:'ddz_table_again', bottomType :1,callFunc :this.gameFlowAction.bind(this)}]);
        this.gameFlow = true;
    },

    // onTopButtonAction : function () {
    //     ddz.LOGD(null, "onTopButtonAction");
    //     if(this.gameFlow){
    //         //TODO:流局的局数判断
    //         ddz.matchModel.matchChallenge();
    //         ddz.GlobalFuncs.removeMatchResultPanel(this);
    //     } else{
    //         if(this.adResurgenceTitle && this.adResurgenceTitle != ""){
    //             this.resurgenceWithAd();
    //         }else {
    //             this.restartQuizAction();
    //         }
    //     }
    // },
    // onTempButtonAction : function () {
    //     ddz.LOGD(null, "onTempButtonAction");
    //     this.resurgenceWithDiamond();
    // },
    //看广告复活
    resurgenceWithAd:function () {
        hall.LOGW("====","====resurgenceWithAd===");
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
        if(this.conditionType == "share"){
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeRevial);
        }else{
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["watchVideo",this.matchName]);
            var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];
            this.nowAdId = adId;

            if (!hall.adManager.canPlay) {
                // banner广告复活
                var bc = ddz.gameModel.getBannerResurgenceConfigJson();
                if (bc) {
                    ddz.GlobalFuncs.showBannerResurgenceWindow();
                    this.isOnShare = false;
                }else {
                    hall.adManager.showRewardedVideo(adId,this.matchName);
                }
            }else {
                hall.adManager.showRewardedVideo(adId,this.matchName);
            }
        }
    },
    getDiamondToRevival : function () {
        ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
        //TODO: 替换文案
        var centerString = hall.GlobalFuncs.replaceKeyWordInString(this.failCondition.buttonText1);
        this.adResurgenceTitle = centerString;
        var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
        if(this.overed){
            comBtnList.setBottomTextWithButton(this.adResurgenceTitle);
        }else {
            comBtnList.setTopTextWithButton(this.adResurgenceTitle);
        }
        hall.LOGW("=====","==================="+this.nowCount);
        if(this.nowCount >= this.requestCount){
            if (this.toNext){
                ddz.matchModel.matchBackNextLevel();
                // this.node.destroy();
                return;
            }
            else{
                var needCount = ddz.matchModel.getDiamondCountNeeded();
                ddz.waitGetRevial = {
                    type : 'waitRecive',
                    curCount : 0,
                    needCount : needCount
                };
            }
            var needCountR = ddz.waitGetRevial.needCount;
            //发送得钻石的消息
            for (var i = 0; i < needCountR; i++){
                ddz.gameModel.shareToGetreward(ddz.waitGetRevial.sharePoint || ddz.Share.SharePointType.firstFail);
            }
            // this.node.destroy();
        }
        // ddz.matchModel.matchBack(this.matchDes.roomId, this.matchDes.matchId);
    },
    //使用钻石复活or邀请得钻石
    resurgenceWithDiamond : function () {
        ddz.LOGD(null, "resurgenceWithDiamond");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        var countNunber = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();
        if (countNunber >= count){
            ddz.matchModel.matchBack();
            ddz.GlobalFuncs.removeMatchResultPanel(this);
        }
        else{
            if (this._curGuangQia && this._curGuangQia == 5){
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix);
            }else {
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFail);
            }
        }
    },
    //重新闯关
    restartQuizAction : function () {
        ddz.LOGD(null, "restartQuizAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        // var maxIndex = ddz.matchModel.getCurDes().stages.length - 1;
        var maxIndex = 6;
        if (this._curGuangQia > maxIndex - 2){
            this.addTipsWindow(maxIndex - this._curGuangQia+1);
        }
        else{
            if (ddz.matchModel.checkOldVersion() && this._curGuangQia == 0){
                //第一关就死掉,发送重新闯关
                ddz.matchModel.matchSignin();
            }
            else{
                //第一关不再特殊处理
                // 重新闯关弹出二级菜单
                ddz.matchModel.waitSignin = true;
                ddz.matchModel.matchGiveUp();
            }
            ddz.GlobalFuncs.removeMatchResultPanel(this);
        }
    },
    //流局重闯此关
    gameFlowAction : function () {
        ddz.matchModel.matchChallenge();
        ddz.GlobalFuncs.removeMatchResultPanel(this);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        this.restartButton.node.active = false;
        this.numberlabel.node.active = false;
        this.noticelabel.node.active = false;
        this.isOnShare = false;

        ddz.AudioHelper.playMusic('/resources/sound/Failure.mp3', false);

        var matchCondition = ddz.GlobalFuncs.getFailCondition("match",ddz.GlobalFuncs.checkFailCount("match"));
        ddz.LOGD("file = [ddz_fail] fun = [onLoad] matchCondition = " + JSON.stringify(matchCondition));
        if(matchCondition){
            // ddz.GlobalFuncs.showRevivalWindow(matchCondition,"match");
            this.failCondition = matchCondition;
            this.toNext = matchCondition.resurgenceCondition.toNext;
            this.conditionType = matchCondition.resurgenceCondition.conditionType;
            this.requestCount = matchCondition.resurgenceCondition.requestCount;
            ddz.Share.shareKeywordReplace.repeatNumber = this.requestCount;
            this.nowCount = 0;
            ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
            this.adIds = matchCondition.resurgenceCondition.adIds;

            if (matchCondition.resurgenceCondition.requestCount > 1 &&  matchCondition.buttonText1.indexOf("hadNumber/repeatNumber") ==-1){
                matchCondition.buttonText1 += "(hadNumber/repeatNumber)";
            }
            var centerString = hall.GlobalFuncs.replaceKeyWordInString(matchCondition.buttonText1);
            //TODO:观看不了广告
            this.adResurgenceTitle = centerString;
            var bc = ddz.gameModel.getBannerResurgenceConfigJson();
            if (bc){
                hall.adManager.checkVideoAd();
                if (!hall.adManager.canPlay) {
                    if (centerString.indexOf("观看广告") >=0) {
                        var _toNext = matchCondition.resurgenceCondition.toNext;
                        this.adResurgenceTitle = "观看广告复活";
                        if (_toNext) {
                            this.adResurgenceTitle = "观看广告晋级";
                        }
                    }
                }
            }
        }

        if (!ddz.curAllWidthBannerAd){
            hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
        }

        ty.NotificationCenter.listen(ddz.EventType.REMOVE_ALL_MATCH_RESULT_PANEL, this.shut, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);
    },
    finishShowRewardVideo : function (isEnded) {
        hall.LOGW("=====","==================="+isEnded);
        this.isOnShare = false;
        if(isEnded){
            this.nowCount ++;
            this.getDiamondToRevival();
        }
    },
    errorShowRewardVideo : function (parArr) {
        var errMsg = '广告播放失败,但您仍可复活!';
        this.isOnShare = false;
        hall.MsgBoxManager.showToast({title:errMsg});
        this.finishShowRewardVideo(parseInt(parArr[1]));
    },
    playAnimationAfterShareWithType : function (shareType) {
        this.isOnShare = false;
        if (!shareType || shareType == "") {
            return
        }
        if (!shareType){
            return
        }
        var reultType = ddz.Share.resultType;
        if (shareType == ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix) {
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failSix);
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
        }else if(shareType == ddz.Share.onShareType.clickStatShareTypeRevial){
            switch (reultType) {
                case 1:
                    if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                        this.nowCount ++;
                        this.getDiamondToRevival();
                        return;
                    }else {
                    }
                    break;
                case 2:
                    if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                        this.nowCount ++;
                        this.getDiamondToRevival();
                        return;
                    }else {
                    }
                    break;
                case 3:
                    this.nowCount ++;
                    break;
                default:
                    break;
            }

            ddz.Share.resultType = 0;
            this.getDiamondToRevival();
        }
    },

    updateButtonText:function(data){
        if (data.pointId != ddz.Share.SharePointType.failSix){
            return;
        }
        var _shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix;
        var titileS = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        if (!data.leftCount || data.leftCount <= 0) {
            titileS = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle() +"</c>";
        }else {
            titileS = "<color=#FFFFFF>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
        }
        this.diamondResurgenceTitle = titileS;
        var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
        if(this.adResurgenceTitle && this.adResurgenceTitle != ""){
            comBtnList.setTopTextWithButton(this.diamondResurgenceTitle);
        }else {
            comBtnList.setBottomTextWithButton(this.diamondResurgenceTitle);
        }
    },

    addTipsWindow : function (loss) {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :"确定",
                    bottomType : 0
                },
                {
                    title :that.titleS,
                    right :"dda_button_diamond",
                    bottomType :1
                }
            ];
            window.setTitleContentAndButtons("提示","距离领奖就差"+loss+"关了,确定重新闯关?", testArray);
        });
    },

    onClickLeftButton:function () {
        //重新闯关
        ddz.matchModel.waitSignin = true;
        ddz.matchModel.matchGiveUp();
        ddz.GlobalFuncs.removeMatchResultPanel(this);
    },

    onClickRightButton:function () {
        var countNunber = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();
        if (countNunber >= count){
            //使用钻石
            ddz.matchModel.matchBack();
            ddz.GlobalFuncs.removeMatchResultPanel(this);
        }else {
            //邀请得钻石
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFail);
        }
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
    } ,
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
        hall.adManager.destroyWidthBannerAd();
    }

    // update (dt) {},
});
