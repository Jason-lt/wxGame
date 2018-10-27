
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
        windowBtnText : "",

        titleS : "使用",
        count : "1",

        conditionType : "",
        failCondition : null,
        toNext : false,
        requestCount : 1,
        nowCount : 0,
        adCount : 1,

        adIds : [],
        nowAdId : '',
        videoIcon:cc.Node,
        topButton:cc.Button,

        getDiamondIcon:cc.Node,

    },
    backAction : function () {
        ddz.LOGD(null, "backAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        // var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);

        this.removeAni();

        hall.GlobalFuncs.popScene();
    },

    onClickGetDiamondBtn:function(){
        hall.GlobalFuncs.onOfficialAccountGuide(true);
    },

    setDiamondCount:function (guangQiaNum) {
        ddz.LOGD("","file = [ddz_fail] fun = [setDiamondCount] guangQiaNum = " + guangQiaNum);
        var countNunber = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();

        if (count > 0) {
            this.noticelabel.node.active = true;
            this.noticelabel.string = "<color=#ffffff>使用 </c><img src='dda_button_diamond' height=34 width=42/>" +
                "<color=#ffffff> "+ count +" 可继续挑战本关\n已有</color><img src='dda_button_diamond' height=34 width=42/>" +
                "<color=#ffffff> "+ countNunber +"</color>";
        }

        this._curGuangQia = guangQiaNum;

        var window = this.resultTitle.getComponent('ddz_resultTitle');
        window.setTitle(this._curGuangQia, false);

        // this.numberlabel.string ="<color=#ffffff>已有 </c><img src='dda_button_diamond' height=17 width=21 /><size='36' color='#ffffff'> "+countNunber+" </color>";
        this.diamondResurgenceTitle = "分享";
        this.windowBtnText = "分享";
        var isHaveDiamond = false;
        if (countNunber >= count){
            this.diamondResurgenceTitle = "<color=#ffffff>使用 </c><img src='dda_button_diamond' height=34 width=42/>";
            this.windowBtnText = "<color=#ffffff>使用 </c><img src='dda_button_diamond' height=34 width=42/>";
            isHaveDiamond = true;
        }else {

            var _config = ddz.gameModel.getCongratulationGetRewardJson();
            if (_config){
                var shareConfig;
                if (ty.UserInfo.isInBSGS) {
                    shareConfig = _config.bsgsCity;
                }else {
                    shareConfig = _config.otherCity;
                }
            }

            //分享次数达到配置,没有分享价值
            var shareNumber = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 0);
            if ((shareConfig && shareConfig.fail != null && shareNumber >= shareConfig.fail) || !ty.UserInfo.sharePredict){
                this.titleS = "获取";

                hall.adManager.checkVideoAd();
                if (hall.adManager.canPlay) {
                    this.diamondResurgenceTitle = "看广告得钻石";
                    this.windowBtnText = "看广告得钻石";
                }else {
                    //判断是否有分享价值
                    this.diamondResurgenceTitle = "分享";
                    this.windowBtnText = "分享";
                    ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failWindw);
                }
            }else{
                this.titleS = "获取";
                this.diamondResurgenceTitle = "分享";
                this.windowBtnText = "分享";
                ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failSix);
                ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failWindw);
            }
        }

        this.restartButton.node.active = true;
        this.numberlabel.node.active = false;

        var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
        if(this.adResurgenceTitle && this.adResurgenceTitle != ""){
            if (ddz.gameModel.isBringVersion) {
                // comBtnList.hideBottomBtn(false);
                comBtnList.setButtonListWithButtons2([{title :this.adResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithAd.bind(this)}]);
            }else {
                hall.adManager.checkVideoAd();
                if (this.conditionType == "share") {
                    comBtnList.setButtonListWithButtons2([{title :this.adResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithAd.bind(this)},
                        {title :this.diamondResurgenceTitle,bottomType :1,callFunc : this.resurgenceWithDiamond.bind(this)}]);
                }else {
                    if (hall.adManager.canPlay) {
                        comBtnList.setButtonListWithButtons2([{title :this.adResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithAd.bind(this)},
                            {title :this.diamondResurgenceTitle,bottomType :1,callFunc : this.resurgenceWithDiamond.bind(this)}]);
                    }else {
                        if (isHaveDiamond) {
                            comBtnList.setButtonListWithButtons2([{title :this.diamondResurgenceTitle,bottomType :1,callFunc : this.resurgenceWithDiamond.bind(this)}]);
                        }else {
                            comBtnList.setButtonListWithButtons2([{title :'重新闯关',left:'ddz_table_again', bottomType :0,callFunc : this.restartQuizAction.bind(this)}]);
                            this.restartButton.node.active = false;
                        }
                    }
                }
            }
        }else {

            hall.adManager.checkVideoAd();
            if (hall.adManager.canPlay || isHaveDiamond) {
                comBtnList.setButtonListWithButtons2([{title :this.diamondResurgenceTitle,bottomType :0,callFunc : this.resurgenceWithDiamond.bind(this)}]);
            }else {
                comBtnList.setButtonListWithButtons2([{title :'重新闯关',left:'ddz_table_again', bottomType :0,callFunc : this.restartQuizAction.bind(this)}]);
                this.restartButton.node.active = false;
            }
        }
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
            this.restartButton.node.active = false;
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
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        if(this.conditionType == "share"){
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeRevial);
        }else{
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
                ["watchVideo","failResurgence"]);
            var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];
            // this.nowAdId = adId;

            // if (!hall.adManager.canPlay) {
            //     // banner广告复活
            //     var bc = ddz.gameModel.getBannerResurgenceConfigJson();
            //     if (bc) {
            //         ddz.GlobalFuncs.showBannerResurgenceWindow();
            //     }else {
            //         hall.adManager.showRewardedVideo(adId,"failResurgence");
            //     }
            // }else {
            //     hall.adManager.showRewardedVideo(adId,"failResurgence");
            // }
            hall.adManager.showRewardedVideo(adId,"failResurgence");
        }
    },

    seeAdGetJiPaiQi:function(){
        hall.LOGD("=====","file = [ddz_fail] fun = [seeAdGetJiPaiQi] this.jipaiqiAdId = " + this.jipaiqiAdId);
        this.isGetJiPaiQi = true;
        hall.adManager.showRewardedVideo(this.jipaiqiAdId,"getJiPaiQi");
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["watchVideo","ddzFailGetJiPaiQi"]);
    },

    getDiamondToRevival : function () {
        ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
        //TODO: 替换文案
        var centerString = "";
        if (this.failCondition && this.failCondition.buttonText1) {
            centerString = hall.GlobalFuncs.replaceKeyWordInString(this.failCondition.buttonText1);
        }

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
            this.getReward();
            // if (this._curGuangQia && this._curGuangQia == 5){
            //     ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix);
            // }else {
            //     ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFail);
            // }
        }
    },

    //看广告的奖励还是分享
    getReward:function(isWindow){
        var _config = ddz.gameModel.getCongratulationGetRewardJson();
        if (_config){
            var shareConfig;
            if (ty.UserInfo.isInBSGS) {
                shareConfig = _config.bsgsCity;
            }else {
                shareConfig = _config.otherCity;
            }
        }

        var shareNumber = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 0);
        if ((shareConfig && shareConfig.fail != null && shareNumber >= shareConfig.fail) || !ty.UserInfo.sharePredict){
            hall.adManager.checkVideoAd();
            if (hall.adManager.canPlay) {
                this.seeVideoGetReward();
            }else {
                if (isWindow) {
                    ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailWindow);
                }else {
                    ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix);
                }

            }
        }else{
            if (isWindow) {
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailWindow);
            }else {
                ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix);
            }
        }
    },

    seeVideoGetReward:function(){
        hall.LOGW("====","====seeVideoGetReward===");
        this.isGetReward = true;

        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK){
            hall.MsgBoxManager.showToast({title : "正在登录，请稍候"});
            ddz.LOGD(null, "TCP is not ok! Please wait!");
            return;
        }
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["seeVideoGetReward","fail"]);
        // var adId = this.adIds[hall.GlobalFuncs.getRandomNumberBefore(this.adIds.length)];

        hall.adManager.showRewardedVideo("","getReward");
    },


    //重新闯关
    restartQuizAction : function () {
        ddz.LOGD(null, "restartQuizAction");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        // var maxIndex = ddz.matchModel.getCurDes().stages.length - 1;
        if (this._curGuangQia > 0){
            this.addTipsWindow();
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

        ddz.AudioHelper.playMusic('/resources/sound/Failure.mp3', false);

        var matchCondition = ddz.GlobalFuncs.getFailCondition("match",ddz.GlobalFuncs.checkFailCount("match"));
        ddz.LOGD("file = [ddz_fail] fun = [onLoad] matchCondition = " + JSON.stringify(matchCondition));
        if(matchCondition){
            // ddz.GlobalFuncs.showRevivalWindow(matchCondition,"match");
            this.failCondition = matchCondition;
            this.toNext = matchCondition.resurgenceCondition.toNext;
            this.requestCount = matchCondition.resurgenceCondition.requestCount;
            ddz.Share.shareKeywordReplace.repeatNumber = this.requestCount;
            this.nowCount = 0;
            ddz.Share.shareKeywordReplace.hadNumber = this.nowCount;
            this.adIds = matchCondition.resurgenceCondition.adIds;
            if (matchCondition.resurgenceCondition.requestCount > 1 &&  matchCondition.buttonText1.indexOf("hadNumber/repeatNumber") ==-1){
                matchCondition.buttonText1 += "(hadNumber/repeatNumber)";
            }
            var centerString = hall.GlobalFuncs.replaceKeyWordInString(matchCondition.buttonText1);
            
            this.adResurgenceTitle = centerString;
            this.conditionType = matchCondition.resurgenceCondition.conditionType;
            hall.adManager.checkVideoAd();
            if(this.conditionType == "share" && !ty.UserInfo.sharePredict && hall.adManager.canPlay) {
                this.conditionType = "video";
                this.adResurgenceTitle = "观看广告复活";
                this.adIds = ["adunit-8bde7ac62d379503"];
            }

            hall.GlobalFuncs.btnScaleEffect(this.topButton.node,1.13);
            //TODO:观看不了广告
            var bc = ddz.gameModel.getBannerResurgenceConfigJson();
            if (bc){
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
        
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_ALL_MATCH_RESULT_PANEL, this.shut, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.updateButtonText, this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE,this.finishShowRewardVideo,this);
        ty.NotificationCenter.listen(ddz.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.errorShowRewardVideo,this);

        ty.NotificationCenter.listen(ddz.EventType.UPDATE_DIAMOND_NUMBER,this.updateDiamond,this);
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_JIPAIQI,this.updateGetReward,this);

        var winSize = cc.director.getWinSize();

        // if(ddz.matchModel.new_gift_reward){
        //     var newGiftNode = cc.instantiate(this.newGiftPrefab);
        //     newGiftNode.x = -winSize.width/2+80;
        //     newGiftNode.y = 50;
        //     this.node.addChild(newGiftNode);
        // }

        this.jipaiqiAdId = "adunit-8bde7ac62d379503";
        this.isGetJiPaiQi = false;
        // var ani = this.videoIcon.getComponent(cc.Animation);
        // ani.play('jieidan');
        //
        // if (hall.ME.udataInfo.jiPaiQiCount >= 6) {
        //     this.videoIcon.active = false;
        // }

        ddz.gameModel.checkShareReward(ddz.Share.SharePointType.addApplet);
    },

    updateDiamond:function(){
        var gindex = ddz.matchModel.getStageIndex()-1;
        this.setDiamondCount(gindex);
    },


    showResults:function(isShow){
        this.node.active = isShow;

        if (isShow){
            hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
            ty.NotificationCenter.trigger(ty.EventType.CREATE_TABLE_AD);
        }

        if (isShow && !ty.UserInfo.isInBSGS){
            if (ddz.gameModel.throughCount == 0) {
                var bc = ddz.gameModel.getSkipCustomsConfigJson();
                if (bc && bc.newCustoms > 0) {
                    hall.GlobalFuncs.onSkipCustom(1);
                }
            }
        }
    },

    finishShowRewardVideo : function (isEnded) {
        hall.LOGW("=====","file = [ddz_fail] fun = [finishShowRewardVideo]"+isEnded);

        if (this.isGetReward) {
            var sharePoint = hall.GlobalFuncs.getSharePoint(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix);
            ddz.gameModel.shareToGetreward(sharePoint);
            // ddz.gameModel.saveRewardToBox(sharePoint);
            var comBtnList = this.buttons.getComponent('ddz_buttonList_2');

            hall.adManager.checkVideoAd();
            if (!hall.adManager.canPlay) {
                comBtnList.hideBottomBtn(false);
            }
            // comBtnList.hideBottomBtn(false);
            this.isGetReward = false;
        }else {
            if (this.isGetJiPaiQi) {
                if(isEnded){
                    if (ddz.gameModel.firstUseJiPaiQiPoint > 0) {
                        ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.firstUseJiPaiQi);
                    }else {
                        ddz.gameModel.shareToGetreward(ddz.Share.SharePointType.adGetJiPaiQi);
                    }
                }
                this.isGetJiPaiQi = false;
            }else {
                if(isEnded){
                    this.nowCount ++;
                    this.getDiamondToRevival();
                }
            }
        }
    },

    errorShowRewardVideo : function (parArr) {
        hall.LOGW("=====","file = [ddz_fail] fun = [errorShowRewardVideo]");
        this.finishShowRewardVideo(parseInt(parArr[1]));
    },
    
    // updateGetReward:function(){
    //     if (hall.ME.udataInfo.jiPaiQiCount >= 6) {
    //         this.videoIcon.active = false;
    //     }
    // },

    playAnimationAfterShareWithType : function (shareType) {
        var reultType = ddz.Share.resultType;
        if (shareType == ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix) {
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failSix);
            switch (reultType) {
                case 1:
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                    }
                    break;
                case 2:
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                    }
                    
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
                    // if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                    //     this.nowCount ++;
                    //     this.getDiamondToRevival();
                    //     return;
                    // }else {
                    // }
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                    }
                    break;
                case 2:
                    // if(!this.failCondition.resurgenceCondition.holk ||  this.failCondition.resurgenceCondition.holk == 0){
                    //     this.nowCount ++;
                    //     this.getDiamondToRevival();
                    //     return;
                    // }else {
                    // }
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
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
        }else if(shareType == ddz.Share.onShareType.clickStatShareTypeGetDiamondFail){
            if (reultType > 0) {
                hall.MsgBoxManager.showToast({title : '群友点入获得钻石，使用钻石可复活!'});
            }
            ddz.Share.resultType = 0;
        }else if(shareType == ddz.Share.onShareType.clickStatShareTypeGetDiamondFailWindow){
            ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failWindw);
            switch (reultType) {
                case 1:
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                    }
                    break;
                case 2:
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                    }

                    break;
                case 3:
                    break;
                default:
                    break;
            }
            ddz.Share.resultType = 0;
        }
    },

    updateButtonText:function(data){
        if (data.pointId == ddz.Share.SharePointType.failSix){
            var _config = ddz.gameModel.getCongratulationGetRewardJson();
            if (_config){
                var shareConfig;
                if (ty.UserInfo.isInBSGS) {
                    shareConfig = _config.bsgsCity;
                }else {
                    shareConfig = _config.otherCity;
                }
            }

            var shareNumber = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 0);
            if ((shareConfig && shareConfig.fail != null && shareNumber >= shareConfig.fail) || !ty.UserInfo.sharePredict){
                return
            }
            var _shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix;
            var titileS = "<color=#ffffff>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</color>";
            if (!data.leftCount || data.leftCount <= 0) {
                titileS = "<color=#ffffff>"+ hall.GlobalFuncs.getButtonTitle() +"</color>";
            }else {
                titileS = "<color=#ffffff>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</color>";
            }
            this.diamondResurgenceTitle = titileS;
            var comBtnList = this.buttons.getComponent('ddz_buttonList_2');
            // if(this.adResurgenceTitle && this.adResurgenceTitle != ""){
            //     comBtnList.setBottomTextWithButton(this.diamondResurgenceTitle);
            // }else {
            //     comBtnList.setBottomTextWithButton(this.diamondResurgenceTitle);
            // }
            comBtnList.setBottomTextWithButton(this.diamondResurgenceTitle);

            if(!this.adResurgenceTitle || this.adResurgenceTitle == ""){
                if (ddz.gameModel.isBringVersion) {
                    comBtnList.hideBottomBtn(false);
                }
            }
        }else if (data.pointId == ddz.Share.SharePointType.addApplet){
            if (data.leftCount && data.leftCount > 0 && ddz.GlobalFuncs.judgeweChatVersion()){
                this.getDiamondIcon.active = true;
                var ani = this.getDiamondIcon.getComponent(cc.Animation);
                ani.play('getdiamond_ani');
            }else {
                this.getDiamondIcon.active = false;
            }
        }else if (data.pointId == ddz.Share.SharePointType.failWindw){
            var _config = ddz.gameModel.getCongratulationGetRewardJson();
            if (_config){
                var shareConfig;
                if (ty.UserInfo.isInBSGS) {
                    shareConfig = _config.bsgsCity;
                }else {
                    shareConfig = _config.otherCity;
                }
            }

            var shareNumber = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.Share.YESTERDAY_SHARE_NUMBER, 0);
            if ((shareConfig && shareConfig.fail != null && shareNumber >= shareConfig.fail) || !ty.UserInfo.sharePredict){
                return
            }
            var _shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondFailWindow;
            var titileS = "<color=#ffffff>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</color>";
            if (!data.leftCount || data.leftCount <= 0) {
                titileS = "<color=#ffffff>"+ hall.GlobalFuncs.getButtonTitle() +"</color>";
            }else {
                titileS = "<color=#ffffff>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</color>";
            }
            this.windowBtnText = titileS;
        }
    },

    addTipsWindow : function () {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;

        var countNunber = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();

        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :"重闯第一关",
                    bottomType : 0
                },
                {
                    title :that.titleS,
                    right :"dda_button_diamond",
                    bottomType :1
                }
            ];

            var tips = "<color=#1A6951>使用 </c><img src='dda_button_diamond_black' height=34 width=42/>" +
                "<color=#1A6951> "+ count +" 可继续挑战本关\n已有</color><img src='dda_button_diamond_black' height=34 width=42/>" +
                "<color=#1A6951> "+ countNunber +"</color>";

            // window.setTitleContentAndButtons("提示","距离领奖就差"+loss+"关了,确定重新闯关?", testArray);
            window.setTitleContentAndButtons("提示",tips, testArray);
            
            window.setRightBtnText(that.windowBtnText);

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
            // ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondFailSix);
            this.getReward(true);
        }
    },

    shut:function () {
        ddz.matchResultPanel = null;
        this.topButton.node.stopAllActions();
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
        // var ani = this.videoIcon.getComponent(cc.Animation);
        // ani.stop();
        // this.videoIcon.removeFromParent();

        var ani_2 = this.getDiamondIcon.getComponent(cc.Animation);
        ani_2.stop();
        this.getDiamondIcon.removeFromParent();
    } ,
    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
        hall.adManager.destroyWidthBannerAd();
        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("tableAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("tableAdNode").hideAdNode();
        }
    }

    // update (dt) {},
});
