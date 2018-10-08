/**
 * Created by tuyoo on 2018/2/5.
 */

var matchDefaultCfg = {
    roomId:6789
};

var delayTime = 3;

ddz.matchModel = {
    LAST_REWARD_DATE: 'last_reward_Date', //首页提示窗的最后展示时间
    LAST_FAIL_DATE: 'LAST_FAIL_DATE', //上一次失败时间
    LAST_RANK_WEEK: 'last_rank_week', //首页提示窗的最后展示时间
    SHOW_LOGIN_REWARD: 'show_login_reward', //待提示的每次登录奖励信息
    MATCH_REWARD_DES: 'match_reward_des', //奖池奖励
    UPDATE_NOTIFY_INFO: 'update_notify_info', //通告是否被点击
    ONHIDE_DATE : 'onhide_date',
    isGameFlow : false,
    isDiZhuWin : false,
    isStartMatch:false,

    /**
     * 获取比赛详情
     */
    getMatchDes:function () {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_des",
                "gameId": 6,
                "roomId": matchDefaultCfg.roomId
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 比赛报名
     */
    matchSignin:function (roomId) {
        roomId = roomId || matchDefaultCfg.roomId;
        var pars = {
            "cmd": "room",
            "params": {
                "action": "signin",
                "gameId": 6,
                "roomId": roomId,
                "signinParams": {
                    "feeIndex": 0
                }
            }
        };

        hall.MsgFactory._sendCmd(pars);
        if (this._curWaitInfo){
            this._curWaitInfo.stageIndex = 1;
        }
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },

    /**
     * 放弃当前比赛进度
     */
    matchGiveUp:function (roomId) {
        roomId = roomId || matchDefaultCfg.roomId;
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_giveup",
                "gameId": 6,
                "roomId": roomId,
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 继续下一关
     */
    matchChallenge:function () {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_challenge",
                "gameId": 6,
                "roomId": matchDefaultCfg.roomId
            }
        };

        hall.MsgFactory._sendCmd(pars);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },

    /**
     * 复活
     */
    matchBack:function () {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_back",
                "gameId": 6,
                "roomId": matchDefaultCfg.roomId
            }
        };

        hall.MsgFactory._sendCmd(pars);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },

    /**
     * 获取奖池信息
     */
    matchUpdate:function () {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "update",
                "gameId": 6,
                "roomId": matchDefaultCfg.roomId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },


    getStageIndex:function () {
        return this._stageIndex;
    },

    parseWait:function (value) {
        hall.LOGE('', "++++++++++++parseWait++++++++++++"+JSON.stringify(value));
        // {
        //     "cmd":"room",
        //     "result":{
        //         "gameId":6,
        //         "cardCount":1,
        //         "isLevelUp":true,
        //         "stageIndex":2,
        //         "matchId":6789,
        //         "userId":10127,
        //         "state":2,
        //         "action":"wait",
        //         "roomId":67891000
        //     }
        // }

        this._curWaitInfo = value;
        this._stageIndex = this._curWaitInfo.stageIndex;

        var state = this._curWaitInfo.state;
        var preFabPath = "";
        var comName = "";
        var gameFlow = this._curWaitInfo.gameFlow;

        if(ddz.friendModel.isEnterTable){
            ddz.MsgFactory.saveMatch();
        }

        if (state == 3){
            ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
            //开局之前的等待(3可以在任意场景弹出)
            preFabPath = "ani/ddz_matching/Matching";
            comName = "DdzMatching";
            ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
            this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                var com = preFabNode.getComponent(comName);
                com.playAni(true);
            });
        }

        /*
         1 在牌桌打牌中
         2 报名或者晋级成功，等待闯关
         3 开始挑战
         4 闯关失败 等待复活
         5 游戏结束
         */
        if (hall.GlobalFuncs.isInAtScene("TableScene") && (state == 2 || state == 4)){
            if (ddz.matchModel.isGameFlow){
                return;
            }
            if (ddz.matchResultPanel){
                //已经存在面板了,不要在重复弹出(这种情况存在于牌桌内断线重连的情况,重连后又会收到一次协议,导致重复弹出面板)
                ddz.LOGD(null, "已经存在面板,不要重复弹出!");
                if (ddz.waitGetRevial && ddz.waitGetRevial.type == 'back'){
                    ddz.matchResultPanel.shut();
                    this.matchBack();
                    ddz.waitGetRevial = null;
                }
                return;
            }
            //只有在牌桌上,才弹出2,4等待窗口

            var isLevelUp = state == 2;
            if (isLevelUp && !gameFlow){
                //赢了一局,晋级
                preFabPath = "prefabs/match/ddz_success";
                comName = "ddz_success";
            }
            else{
                //1、失败了,等待复活 2、托管状态下赢
                preFabPath = "prefabs/match/ddz_fail";
                comName = "ddz_fail";
            }

            // cc.loader.loadRes(preFabPath, function (err, prefab) {
            //     var newNode = cc.instantiate(prefab);
            //     cc.director.getScene().addChild(newNode);
            //     ddz.GlobalFuncs.setToCenter(newNode);
            // });


            var stageIndex = this._curWaitInfo.stageIndex - 2;
            if (stageIndex < 0){
                stageIndex = 0;
            }

            var  timerFunc = function () {
                // hall.LOGE("===","====timerFunc===timerFunc========");
                var curScene = cc.director.getScene();
                var tableScene = curScene.children[0].getComponent('DdzTableScene');
                if(tableScene && tableScene.tableInfo().ftInfo){
                    return;
                }
                ty.NotificationCenter.ignore(ddz.EventType.GAME_HIDE, this.onGameHide, this);
                this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var com = preFabNode.getComponent(comName);
                    if (comName == "ddz_success"){
                        com.progress.getComponent("ddz_progress").setProgress(stageIndex, isLevelUp);
                        com.resultTitle.getComponent('ddz_resultTitle').setTitle(stageIndex, isLevelUp);
                    }
                    else{
                        if(gameFlow){
                            if(ddz.matchModel.isDiZhuWin){
                                com.gameFlowOver(ddz.matchModel.getStageIndex()-1,"因队友托管，不算你输，可重闯本关");
                            }else {
                                com.gameFlowOver(ddz.matchModel.getStageIndex()-1,"托管不记录成绩,请重闯本关");
                            }
                        }else {
                            com.setDiamondCount(ddz.matchModel.getStageIndex() - 1);
                        }
                    }
                    ddz.matchResultPanel = com;

                    ddz.GlobalFuncs.showWaitLottreyWin();

                });
            }.bind(this);

            ty.Timer.setTimer(cc.director,timerFunc, delayTime, 0);
            ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,function () {
                // hall.LOGE("===","====cancelTimer===timerFunc========");
                ty.Timer.cancelTimer(cc.director,timerFunc);
                ty.NotificationCenter.ignore(ddz.EventType.GAME_HIDE,this);
            }, this);

        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_WAIT_INFO,ddz.matchModel.getStageIndex());

    },

    getCurWaitInfo:function () {
        return this._curWaitInfo;
    },

    cleanWaitInfo:function () {
        if (this._curWaitInfo){
            this._curWaitInfo = null;
        }
    },

    showPopWinByPreFab:function (preFabPath, func) {
        cc.loader.loadRes(preFabPath, function (err, prefab) {
            var preFabNode = cc.instantiate(prefab);
            cc.director.getScene().addChild(preFabNode);
            ddz.GlobalFuncs.setToCenter(preFabNode);
            if (preFabPath == "ani/ddz_matching/Matching"){
                preFabNode.y += 160;
            }
            func(preFabNode);
        });
    },

    parseGiveUp:function (value) {
        if (this.waitSignin){
            this.matchSignin();
            this.waitSignin = null;
        }
    },

    parseOver:function (value) {
        if (ddz.matchModel.isGameFlow){
            return;
        }
        this._curOverInfo = value;



        var preFabPath;
        var comName;
        var that = this;

        if (ddz.matchResultPanel){
            ddz.LOGD(null, "已经存在面板,不要重复弹出!");
            //已经存在面板了,不要在重复弹出(这种情况存在于牌桌内断线重连的情况,重连后又会收到一次协议,导致重复弹出面板)
            that._curWaitInfo = null;
            ty.UserInfo.loc = '0.0.0.0';
            return;
        }

        if (this._curOverInfo.reason == ddz.MATCH_REASON.WIN){
            //赢了,弹出等待窗口
            preFabPath = "prefabs/match/ddz_congratulation";
            comName = "ddz_congratulation";
            var that = this;
            this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                that._curWaitInfo = null;
                ty.UserInfo.loc = '0.0.0.0';
                ddz.matchResultPanel = preFabNode.getComponent(comName);
                ddz.matchResultPanel.setMcountDetail(that._curOverInfo.mcount);
                ddz.GlobalFuncs.showWaitLottreyWin();
            });
        }
        else{
            // this._curWaitInfo = null;
            preFabPath = "prefabs/match/ddz_fail";
            comName = "ddz_fail";
            this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                var com = preFabNode.getComponent(comName);
                ddz.matchResultPanel = com;
                ddz.GlobalFuncs.showWaitLottreyWin();
                // if (ddz.matchModel.getStageIndex() == 1){
                    //不可复活的关卡失败
                com.over(ddz.matchModel.getStageIndex()-1);
                that._curWaitInfo = null;
                ty.UserInfo.loc = '0.0.0.0';
                // }
                // else{
                //     // com.setDiamondCount(ddz.matchModel.getStageIndex() - 1);
                // }
            });
        }
    },

    parseMatchInfo:function (value) {

        // {
        //     'cmd': 'room',
        //     'result': {
        //         'lotteryInfo': {
        //             'winnerCount': 0,
        //             'lotteryTime': u '21:00',
        //             'leftSeconds': 31651,
        //             'desc': u '20万元奖金'
        //         },
        //         'gameId': 6,
        //         'matchId': 6789,
        //         'userId': 10007,
        //         'action': 'update',
        //         'roomId': 67891000
        //     }
        // }

        this._curUpdateInfo = value;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MATCH_INFO);
    },

    getCurUpdateInfo:function () {
        return this._curUpdateInfo;
    },

    getCurWinnerCount:function () {
        var histories = this._curDesInfo.histories;
        if (histories){
            var curLottery = histories.curLottery;
            if (curLottery){
                return curLottery.winnerCount;
            }
            return 1;
        }
        return 1;
    },

    parseDes:function (value) {
        this._curDesInfo = value;
        ddz.Share.shareKeywordReplace.curWinnerCount = this.getCurWinnerCount();
        // this._curDesInfo.histories.lastLottery = {
        //     "winnerCount":2,
        //     "lotteryTime":"2018-04-08 19:40",
        //     "rewards":[
        //         {
        //             "count":2,
        //             "itemId":"item:1311"
        //         },
        //         {
        //             "count":1200000,
        //             "itemId":"user:chip"
        //         },
        //         {
        //             "count":12010,
        //             "itemId":"user:coupon"
        //         }
        //     ]
        // };

        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MATCH_DES);
        ddz.GlobalFuncs.showLotteryWin(2);
        var histories = value.histories;
        // hall.LOGD(this._TAG, "parseDes -------------------------"+ JSON.stringify(histories));

        //TODO
        if(debugMode){
            return;
        }

        var couponCount = hall.ME.udataInfo.m_couponCount;
        var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
        var sumReward = couponCount + exchangedCoupon;
        sumReward = sumReward / 100;
        ddz.Share.shareKeywordReplace.curSumReward = sumReward;
        ddz.GlobalFuncs.upDateRankData(sumReward+"");

        // if(histories && histories.weekInfo){
        //     hall.MsgFactory.getTimeStamp();
        //     ty.NotificationCenter.listen(ddz.EventType.GET_TIMESTAMP, this.reciveTimeStamp, this);
        // }
    },
    // reciveTimeStamp : function (result) {
    //
    //     ty.NotificationCenter.ignore(ddz.EventType.GET_TIMESTAMP);
    //
    //     // "result":{
    //     //     //     "action":"sync_timestamp",
    //     //     //         "gameId":9999,
    //     //     //         "userId":10200,
    //     //     //         "current_ts":1520826049
    //     //     // }1523203200
    //     var nowStamp = result.current_ts;
    //     var week = parseInt((nowStamp-1523203200)/(7*24*3600));
    //     ddz.GlobalFuncs.upDateRankDataWeek(week+"");
    //     hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_RANK_WEEK, week+"");
    //     // var nowWeek = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_RANK_WEEK, "");
    // },

    getCurDes:function () {
        return this._curDesInfo;
    },

    parseMatchList:function (value) {
        this._curMatchListInfo = value['matches'];
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_MATCH_LIST_INFO);
    },
    getMatchListInfo:function () {
        return this._curMatchListInfo;
    },

    ///
    parse:function (value) {
        switch (value.result.action){
            case "match_des" : {
                this.parseDes(value.result);
                break;
            }
            case "wait" : {
                this.parseWait(value.result);
                break;
            }
            case "over" : {

                ty.Timer.setTimer(cc.director, function () {
                    this.parseOver(value.result);
                }.bind(this), delayTime, 0);

                break;
            }
            case "match_giveup" : {
                if (value.error){
                    hall.MsgBoxManager.showToast({title:value.error.info + ";错误码:" + value.error.code})
                }
                else{
                    this.parseGiveUp(value.result);
                }
                break;
            }
            case "update" : {
                this.parseMatchInfo(value.result);
                break;
            }
            case "lottery" : {
                //解析开奖消息
                this.parseLottery(value.result);
                break;
            }
            // case "signin" : {
            //     this.parseSignInInfo(value);
            //     break;
            // },
            case ddz.EventType.ACTION_SAVE : {
                this.parseSave(value.result);
                break;
            }
            case  ddz.EventType.ACTION_RESUME : {
                this.parseResume(value.result);
                break;
            }
        }
    },

    parseSave:function (result) {
        // {
        //     "cmd":"room",
        //     "result":{
        //         "action":"save",
        //         "gameId":6,
        //         "roomId":67891000,
        //         "matchId":6789,
        //         "userId":10014,
        //         "save":1,
        //         "tips":"您的比赛进度已保存"
        //     }
        // }

        if (result.save === 1){
            this._curWaitInfo = null;
            ty.NotificationCenter.trigger(ddz.EventType.SAVE_MATCH_SUCCESS);
            if(ddz.friendModel.isEnterTable){
                ddz.friendModel.enterFTTable(ddz.Share.shareKeywordReplace.inviteFriendID);
            }
        }else {
            ddz.friendModel.isEnterTable = false;
        }
    },

    parseResume:function (result) {

        // var result = {
        //     "cmd":"room",
        //     "result":{
        //         "action":"resume",
        //         "gameId":6,
        //         "roomId":67891000,
        //         "matchId":6789,
        //         "userId":10014,
        //         "save":1,
        //         "tips":"您的比赛进度已恢复，请继续闯关吧",
        //         "wati":"{"cmd":"room","result":{"action":"wait","gameId":6,"roomId":67891000,"matchId":6789,"userId":10014,"stageIndex":2,"isLevelUp":true,"cardCount":1,"state":2,"reConnect":true,"gameFlow":true}}"
        //     }
        // }

        // var result = {
        //     "cmd":"room",
        //     "result":{
        //         "action":"resume",
        //         "gameId":6,
        //         "roomId":67891000,
        //         "matchId":6789,
        //         "userId":10014,
        //         "save":0
        //     },
        //     "error":{
        //         "code":-1,
        //         "info":"您已经在比赛中，请稍后报名"
        //     }
        // }

        if (result.save === 1){
            //成功了,解析携带过来的wait消息
            var waitInfo = JSON.parse(result.wati);
            this.parseWait(waitInfo.result);
            hall.LOGE("===","====parseResume===="+ JSON.stringify(waitInfo.result));
        }else {

        }

        if (!this.isStartMatch){
            return;
        }
        if (this._curWaitInfo){
            if (this._curWaitInfo.state == 2){
                this.matchChallenge();
            } else{
                this.showGetDiamondWindow(this);
            }
        }else {
            this.matchSignin();
        }
        this.isStartMatch = false;
        // ty.NotificationCenter.trigger(ddz.EventType.RESUME_MATCH, result.save === 1);
    },


    parseLottery:function (result) {
        // {
        //     "cmd":"room",
        //     "result":{
        //         "lotteryInfo":{
        //             "winnerCount":661,
        //             "lotteryTime":"18:00",
        //             "leftSeconds":86399,
        //             "desc":"10000\u5143\u5956\u91d1"
        //         },
        //         "gameId":6,
        //         "matchId":6789,
        //         "userId":10051,
        //         "date":"2018-04-10",
        //         "time":"18:00",
        //         "action":"lottery",
        //         "roomId":67891000,
        //         "lotteryReward":[
        //             {
        //                 "count":1512,
        //                 "name":"\u7ea2\u5305\u5238",
        //                 "iconPath":"http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/coupon_1.png",
        //                 "icon":"user:coupon"
        //             }
        //         ]
        //     }
        // }

        var dateStr = result.date + " " + result.time;
        var getMoney = result.lotteryReward[0].count;
        var getWinCount = 1;
        var getDesc = result.lotteryInfo.desc;

        this._curLotteryInfo = result;
        ddz.GlobalFuncs.showLotteryWin(1, [dateStr, getMoney, getWinCount, getDesc]);
        ty.NotificationCenter.trigger(ddz.EventType.CHANE_COUNT_LABEL, false);

        // this.getMatchDes();
    },

    getCurLotteryInfo:function () {
        return this._curLotteryInfo;
    },
    // parseSignInInfo:function (value) {
    //     // if(value && value.error && value.error.code && value.error.code != 0){
    //     //     ddz.matchModel.waitSignin = true;
    //     //     ddz.matchModel.matchGiveUp();
    //     // }
    // },

    getDiamondCountNeeded : function () {
        var guan = ddz.matchModel.getStageIndex()-1;
        var desInfo = ddz.matchModel.getCurDes();
        if(desInfo && desInfo.detailStages){
            var stageInfo = desInfo.detailStages;
            if(stageInfo && stageInfo.length > guan){
                var des = stageInfo[guan];
                var count = des.count;
                if(count){
                    return count;

                }
            }
        }
        return "1";
    },

    showGetDiamondWindow : function (manager) {
        var guans = 1;
        if (this._curWaitInfo){
            guans = this._curWaitInfo.stageIndex;
        }
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = manager;
            var buttonS = "";
            var tipS = "";
            var diamondCount = hall.ME.udataInfo.diamondCount;
            var count = ddz.matchModel.getDiamondCountNeeded();
            if (diamondCount >= count){
                buttonS = "使用";
                tipS = "使用钻石继续挑战";
            }else {
                buttonS = "邀请得";
                tipS = "使用钻石继续挑战";
            }
            var testArray = [{
                title :"重新闯关",
                bottomType : 0

            }, {
                title :buttonS,
                right :"dda_button_diamond",
                bottomType :1
            }
            ];
            window.setTitleContentAndButtons("提示",tipS,testArray);
            window.changeContentLabelString(guans);
        });
    },

    //显示开始闯关or继续闯关
    showBack:function () {
        if (this._curWaitInfo){
            return true;
        }
        if (ddz.gameModel._matchRecords){
            //有比赛记录,也认为是可以返回
            return true;
        }
        //wait被清除,显示开始
        return false;
    },

    startMatchProgress : function () {
        hall.LOGD("","file = [MatchModel] fun = [startMatchProgress]" );
        if (this._curWaitInfo){
            if (this._curWaitInfo.state == 2){
                this.matchChallenge();
            } else{
                // this.showGetDiamondWindow(this);
                if(this._curWaitInfo.stageIndex == 1){
                    this.matchSignin();
                }else {
                    this.showGetDiamondWindow(this);
                }
            }
            return;
        }
        if (ddz.gameModel._matchRecords){
            this.isStartMatch = true;
            ddz.MsgFactory.resumeMatch();
            return;
        }
        this.matchSignin();
    },
    onClickLeftButton:function (event) {
        this.waitSignin = true;
        this.matchGiveUp();
    },
    onClickRightButton:function (event) {
        var diamondCount = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();
        if (diamondCount >= count) {
            this.matchBack();
        }else{
            ddz.Share.shareWithType(ddz.Share.clickStatShareType.clickStatShareTypeGetDiamondFail);
        }
    }
    // testMatching : function () {
    //     var preFabPath = "ani/ddz_matching/Matching";
    //     var  comName = "DdzMatching";
    //     ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
    //     this.showPopWinByPreFab(preFabPath, function (preFabNode) {
    //         var com = preFabNode.getComponent(comName);
    //         com.playAni(true);
    //     });
    // },
};