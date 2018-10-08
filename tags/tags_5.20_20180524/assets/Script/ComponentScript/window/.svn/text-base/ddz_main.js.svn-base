


// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_main');
// window.setTitleString("闯八关平分100万奖金");
// window.setDetailInformation("12345678","12:54:51");

cc.Class({
    extends: cc.Component,
    ctor:function () {
        this._counter = 0;
        this._TAG = "ddz_main.js";
    },

    properties: {

        leftSeconds:0,
        winnerCount : 0,
        rewardDes : "",
        titleLabel: {
            default : null,
            type : cc.Label
        },
        detailLabel : {
            default : null,
            type : cc.RichText
        },
        timeLabel: {
            default : null,
            type : cc.Label
        },
        detailButton : {
            default : null,
            type : cc.Button
        },
        countLabel: {
            default : null,
            type : cc.RichText
        },
        startButtonList : {
            default : null,
            type : cc.Node
        },
        buttom : {
            default : null,
            type : cc.Node
        },

        noticeNode: {
            default : null,
            type : cc.Node
        },

        noticeLabel: {
            default : null,
            type : cc.Label
        },

        inviteeList :[],

        noticeWindow : {
            default : null,
            type : cc.Prefab
        },

        topButtonNode : {
            default : null,
            type : cc.Node
        },
        messageNode : {
            default : null,
            type : cc.Node
        },

        notifyList :[],

        parentScene: {
            default: null,
            serializable: false
        },

        notifyNode : {
            default : null,
            type : cc.Node
        },

        guideIconNode : {
            default : null,
            type : cc.Node
        },
        startRichText : {
            default : null,
            type : cc.RichText
        },

        ledNode : {
            default : null,
            type : cc.Node
        },

        ledBg : {
            default : null,
            type : cc.Sprite
        },

        ledRichText : {
            default : null,
            type : cc.RichText
        },

        count : "",
        money : ""
    },
    onLoad :function () {
        var couponCount = hall.ME.udataInfo.m_couponCount;
        // hall.MsgFactory.getBagInfo();
        // this.addTipsWindowWith("4","10","5");
        this.rewardDes = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.MATCH_REWARD_DES, "闯七关瓜分100万红包");
        this.setTitleString("" + this.rewardDes);
        
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_INFO, this.onUpDateMatchInfo, this);

        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.updateMatchInfo, this);

        this.updateNotifyInfo(ddz.gameModel.notifyInfo);
        // ddz.gameModel.queryInviteInfo();
        // ddz.gameModel.queryInviteConfig();
        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_MASSAGE, this.updateRewardMassage, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COMMON_CONFIG, this.updateNotifyInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_NOTIFY_COUNT, this.updateNotifyCount, this);
        ty.NotificationCenter.listen(ddz.EventType.CHANE_COUNT_LABEL, this.changeCountLabel, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_DDZ_MAIN_ANI, this.onRemoveAni, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_GUIDE_ICON_STATE, this.updateGuideNodeState, this);
        ty.NotificationCenter.listen(ddz.EventType.CMD_LED_RECEIVE, this.playLed,this);

        this.detailButton.node.x = -this.detailLabel.node.width/2 + 20;
        this.detailLabel.node.active = false;

        this.ledNode.active = false;
        // this.noticeButton.node.active = false;
        // var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        // if (backButtonH) {
        //     this.noticeButton.node.active = true;
        //     this.noticeButton.node.y = backButtonH;
        // }
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH && backButtonH != 0){
            this.topButtonNode.y = backButtonH;
        }
        this.updateMessageCount();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_REWARD_COUNT, this.updateMessageCount.bind(this), this);
    },

    updateGuideNodeState:function(isShow){
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this.guideIconNode.active = isShow;
            if (hall.adManager.icoBtn) {
                this.guideIconNode.y = -150;
            }
        }else {
            this.guideIconNode.active = false;
        }
    },

    playLed : function (result) {
        var model = hall.gameWorld.model;
        model.m_ledBeWork = true;
        var _ledList = model.m_ledList; // {"text": result[i].text, "color": cc.color(result[i].color), "size": 22}
        this.ledNode.active = true;
        var index = 0;
        var _moveTime = 0.6;
        var that = this;
        var _playLed = function(){
            var data = _ledList[index];
            if (data && data.length > 0) {
                that.ledRichText.string = "<color=#" + data[0].color+ ">"+ data[0].text + "</color>";
                var size = that.ledBg.node.getContentSize();
                var textSize = that.ledRichText.node.getContentSize();
                that.ledRichText.node.y = -size.height;
                var showMove = cc.moveTo(_moveTime, cc.p(-200, 0));
                var hideMove = cc.moveTo(_moveTime, cc.p(-200, size.height));
                var delay = cc.delayTime(3);
                that.ledRichText.node.stopAllActions();
                that.ledRichText.node.runAction(cc.sequence(showMove,delay,hideMove,cc.callFunc(function(){
                    _playLed();
                    if (index == model.m_ledCapacity) {
                        model.m_ledBeWork = false;
                        // this.ledNode.active = false;
                        model.m_ledLast = 0;
                    }
                }, that)));
                index += 1;
            }else {
                that.ledNode.active = false;
                model.m_ledBeWork = false;
                model.m_ledLast = 0;
            }
        };
        _playLed();
    },

    loadingAction : function () {
        this.buttom.active = false;
        this.startButtonList.active = false;
        // this.timeLabel.node.active = false;
        // this.detailLabel.node.active = false;
        // this.timeLabel.node.active = false;
        this.topButtonNode.active = false;
    },
    unLoadingAction : function () {
        this.buttom.active = true;
        this.startButtonList.active = true;
        // this.timeLabel.node.active = true;
        // this.detailLabel.node.active = true;
        // this.timeLabel.node.active = true;
        this.topButtonNode.active = true;
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.topButtonNode.y = backButtonH;
        }
    },
    onUpDateMatchInfo:function () {
        var info = ddz.matchModel.getCurUpdateInfo();
        if(!info || !info.lotteryInfo){
            return;
        }
        var num ;
        if(info.lotteryInfo.winnerCount){
            num = info.lotteryInfo.winnerCount;
        }else {
            num = "1";
        }
        var rewardDes = info.lotteryInfo.desc;
        ddz.Share.shareKeywordReplace.bonusTotal = rewardDes;

        this.leftSeconds = info.lotteryInfo.leftSeconds;
        var timeStr = ddz.GlobalFuncs.formatTime(this.leftSeconds);

        if (this.winnerCount == num){
            // this.timeLabel.string = timeStr;
        }else {
            this.winnerCount = num;
            this.setDetailInformation(num, timeStr);
        }
        if (this.rewardDes != rewardDes){
            this.rewardDes = rewardDes;
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.MATCH_REWARD_DES, rewardDes);
            this.setTitleString("" + rewardDes);
        }
    },

    changeCountLabel:function (val) {
        // this.countLabel.node.active = val;
    },
    updateMatchInfo: function () {
        /*
         　"histories":{
         　　　　　　"winnerCount":2,
         　　　　　　"matchCount":2,
         　　　　　　"curLottery":{
         　　　　　　　　"winnerCount":2,
         　　　　　　　　"lotteryTime":"2018-04-08 19:15",
         　　　　　　　　"rewards":[
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":2,
         　　　　　　　　　　　　"itemId":"item:1311"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":1200000,
         　　　　　　　　　　　　"itemId":"user:chip"
         　　　　　　　　　　},
         　　　　　　　　　　{
         　　　　　　　　　　　　"count":10000,
         　　　　　　　　　　　　"itemId":"user:coupon"
         　　　　　　　　　　}
         　　　　　　　　]
         　　　　　　},
         　　　　　　"records":Array[2]
         　　　　},

         "saveInfo":{
         "record":{
         "stageIndex":2,
         "state":2,
         "gameFlow":false,
         "enterTime":1526141228
         },
         "needResume":0
         }
         */
        var matchDes = ddz.matchModel.getCurDes();
        this.changeCountLabel(false);
        var histories = matchDes.histories;
        if (histories){
            var todayM = histories.curLottery;
            if(todayM && todayM.winnerCount && todayM.winnerCount > 0){
                ddz.Share.shareKeywordReplace.curWinnerCount = todayM.winnerCount;
                var winnerCount = todayM.winnerCount + "";
                var info = ddz.matchModel.getCurUpdateInfo();
                var lotteryTime;
                if(info && info.lotteryInfo && info.lotteryInfo.lotteryTime){
                    lotteryTime = info.lotteryInfo.lotteryTime;
                }else {
                    lotteryTime = "21:00"
                }
                var tips = "<color=#FFFFFF>本期已通关"+winnerCount+"</color><color=#FFFFFF>次，奖励将于" + lotteryTime + "发放</c>";
                this.countLabel.string = tips;
                this.changeCountLabel(true);
            }
        }

        var savaInfo = matchDes.saveInfo;
        if(matchDes.matchId == 6789 && savaInfo && savaInfo.record &&  savaInfo.record.stageIndex){
            this.changeEnterBtnState(savaInfo.record.stageIndex);
        }
    },
    changeEnterBtnState:function (_stageIndex) {
        if (_stageIndex && _stageIndex > 1) {
            this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第"+_stageIndex+ "关" + " </color>";
        }else {
            this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff>   开始闯关</color>";
        }
    },
    setTitleString : function (titleString) {
        hall.LOGD(this._TAG, "setTitleString -------------------------"+titleString.length);
        var fontSize = 48;
        if(titleString.length > 11){
            fontSize = 45;
        }
        this.titleLabel.fontSize = fontSize;
        this.titleLabel.string = titleString;
    },

    setDetailInformation:function (peopel,timeS) {
        // <img src='ddz_main_acticityDetail' height=40 width=40 />
        this.detailLabel.node.active = true;
        this.detailLabel.string =
            "<img src = 'ddz_main_acticityDetail'/><color=#ffffff> 今天已有"+peopel+"人次领取红包 </c>";
        this.detailButton.node.x = -this.detailLabel.node.width/2 + 20;
        // this.timeLabel.string = timeS;
        // // 个人财产信息
        // var wimdow = this.personalAssets.getComponent("personalAssets");
        // wimdow.updateInfo();
    },
    updataTime :function () {
        this.leftSeconds--;
        var timeStr = ddz.GlobalFuncs.formatTime(this.leftSeconds);
        // this.timeLabel.string = timeStr;
    },

    onClickCenterButton:function (event) {
        var shareType = ddz.Share.onShareType.clickStatShareTypeMainTips;
        ddz.Share.shareWithType(shareType);
    },
    update:function (dt) {
        this._counter++;
        if (this._counter >= 360){
            //6秒刷新一次奖池信息
            ddz.matchModel.matchUpdate();
            this._counter = 0;
            ddz.LOGD(this._TAG, "刷新一次奖池信息");
        }else if(this._counter%60 == 0){
            if (this.leftSeconds > 0){
                this.updataTime();
            }
        }
    },
    onDestroy:function () {
        var model = hall.gameWorld.model;
        model.m_ledBeWork = false;
        ty.NotificationCenter.ignoreScope(this);
    },

    updateRewardMassage : function (result) {
    //     // "result":{
    //     //     "gameId":6,
    //     //         "bindRewardCount":2,
    //     //         "state":1,
    //     //         "action":"query_invite_info",
    //     //         "totalReward":0,
    //     //         "inviteeList":[
    //     //         {
    //     //             "rewardState":1,
    //     //             "pic":"http://ddz.dl.tuyoo.com/cdn37/hall/avatar/New_avatar_170803.png",
    //     //             "userId":10666,
    //     //             "name":"来宾029aseFGg"
    //     //         }
    //     //     ]
    //     // }
    //
    //     var resultMap;
    //     if(result){
    //         resultMap = result.result;
    //     }
    //     var showList = [];
    //     if(resultMap && resultMap.inviteeList && resultMap.inviteeList.length > 0){
    //         var inviteeList = resultMap.inviteeList;
    //         for (var i = 0; i < inviteeList.length; i ++){
    //             if(inviteeList[i].rewardState == 1){
    //                 inviteeList[i].bindRewardCount = resultMap.bindRewardCount;
    //                 inviteeList[i].type = 1;
    //                 showList.push(inviteeList[i]);
    //             }
    //         }
    //     }
    //
    //     //查询未展示的登录奖励
    //     var tips =   hall.GlobalFuncs.ReadValueFromLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD, []);
    //     if(tips[0]){
    //         var tipsList = tips[0].split(',');
    //         if(tipsList && tipsList.length > 0){
    //             for (var i = 0 ; i < tipsList.length ; i ++ ){
    //                 var reward = {};
    //                 reward.type = 2;
    //                 reward.bindRewardCount = tipsList[i];
    //                 showList.push(reward);
    //             }
    //         }
    //     }
    //
    //     if(showList.length > 0){
    //         this.showTipsButton();
    //         this.tipsLabel.string = showList.length;
    //         this.inviteeList = showList;
    //     }
    // },

        var resultMap;
        if(result){
            resultMap = result.result;
        }
        var showList = [];
        if(resultMap && resultMap.inviteeList && resultMap.inviteeList.length > 0){
            var inviteeList = resultMap.inviteeList;
            for (var i = 0; i < inviteeList.length; i ++){
                if(inviteeList[i].rewardState == 1){
                    inviteeList[i].bindRewardCount = resultMap.bindRewardCount;
                    inviteeList[i].type = 1;
                    showList.push(inviteeList[i]);
                }
            }
        }

        //查询未展示的登录奖励
        var tips =   hall.GlobalFuncs.ReadValueFromLocalStorage(ddz.matchModel.SHOW_LOGIN_REWARD, []);
        if(tips[0]){
            var tipsList = tips[0].split(',');
            if(tipsList && tipsList.length > 0){
                for (var i = 0 ; i < tipsList.length ; i ++ ){
                    var reward = {};
                    reward.type = 2;
                    reward.bindRewardCount = tipsList[i];
                    showList.push(reward);
                }
            }
        }

        if(showList.length > 0){
            this.inviteeList = showList;
        }
    },

    updateNotifyInfo:function(result) {
        var _config = result.config;
        var _info = [];
        if (_config && _config.info && _config.info.length > 0){
            _info = _config.info;
            var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
            var indexList = JSON.parse(indexStr);
            var count = 0;
            for (var i = 0; i < _info.length; i++){
                if (indexList.indexOf(_info[i].index) == -1) {
                    count = count + 1;
                }
            }
            hall.LOGW(this._TAG, "updateNotifyInfo count = " + count );
            if (count > 0) {
                this.noticeNode.active = true;
                this.noticeLabel.string = count;
            }else {
                this.noticeNode.active = false;
            }
        }

        this.notifyList = _info;
        // this.notifyList.reverse();
    },
    
    updateNotifyCount:function(){
        var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        var indexList = JSON.parse(indexStr);

        if (this.notifyList.length <= 0){
            return;
        }
        var count = 0;
        for (var i = 0; i < this.notifyList.length; i++){
            if (indexList.indexOf(this.notifyList[i].index) == -1) {
                count = count + 1;
            }
        }
        if (count > 0) {
            this.noticeNode.active = true;
            this.noticeLabel.string = count;
        }else {
            this.noticeNode.active = false;
        }
    },

    onNoticeButton : function() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["notice"]);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);

        var noticeList = this.notifyList;
        hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
            var window = preFabNode.getComponent('ddz_notifyWindow');
            window.setOrigData(noticeList);

            window.updateWind(true);
            window.setTitleLabe("公告");
            if (noticeList.length <= 0){
                window.setShowInitialLabel(true);
            }else {
                window.setShowInitialLabel(false);
            }
        });

        // var nofityW = cc.instantiate(this.noticeWindow);
        // this.notifyNode.addChild(nofityW);
        // var window = nofityW.getComponent('ddz_notifyWindow');
        // // window.parentScene = this;
        // window.setOrigData(this.notifyList);
        //
        // window.updateWind(true);
        // window.setTitleLabe("公告");
        // if (this.notifyList.length <= 0){
        //     window.setShowInitialLabel(true);
        // }else {
        //     window.setShowInitialLabel(false);
        // }
    },
    updateMessageCount : function () {
        var count = ddz.gameModel.allCount;
        hall.LOGD("=="," file = [ddz_main] fun = [updateMessageCount] count = " + count);
        if (count && count > 0) {
            this.messageNode.active = true;
            // if (count > 99){
            //     count = 99;
            // }
            // this.messageCount.string = count;
        }else {
            this.messageNode.active = false;
        }
    },

    onRemoveAni:function () {
        hall.LOGD("=="," file = [ddz_main] fun = [onRemoveAni] ");
        this.notifyNode.removeAllChildren();
    },

});
