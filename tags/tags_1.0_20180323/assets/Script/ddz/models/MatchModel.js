/**
 * Created by tuyoo on 2018/2/5.
 */

var matchDefaultCfg = {
    roomId:6789
};

var delayTime = 3;

ddz.matchModel = {
    LAST_REWARD_DATE: 'last_reward_Date', //首页提示窗的最后展示时间
    MATCH_REWARD_DES: 'match_reward_des', //奖池奖励
    ONHIDE_DATE : 'onhide_date',
    isGameFlow : false,
    /**
     * 获取比赛列表
     */
    getMatchList:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "async_upgrade_hero_match",
                "gameId": 6
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },
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
    },

    /**
     * 比赛报名
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
     * 开始闯关
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

    /**
     * 获取排行榜列表
     */
    getRankList:function () {
        var pars = {
            "cmd": ddz.EventType.CMD_CUSTOM_RANK,
            "params": {
                "action": "query",
                "rankKey": "hero_match_success_rank",
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    getStageIndex:function () {
        return this._stageIndex;
    },

    parseWait:function (value) {
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

        if (state == 3){
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
            ty.Timer.setTimer(cc.director, function () {
                this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var com = preFabNode.getComponent(comName);
                    if (comName == "ddz_success"){
                        com.progress.getComponent("ddz_progress").setProgress(stageIndex, isLevelUp);
                        com.resultTitle.getComponent('ddz_resultTitle').setTitle(stageIndex, isLevelUp);
                    }
                    else{
                        if(gameFlow){
                            com.gameFlowOver(ddz.matchModel.getStageIndex()-1);
                        }else {
                            com.setDiamondCount(ddz.matchModel.getStageIndex() - 1);
                        }
                    }
                    ddz.matchResultPanel = com;
                });
            }.bind(this), delayTime, 0);
        }

        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_WAIT_INFO);

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
            return;
        }

        if (this._curOverInfo.reason == ddz.MATCH_REASON.WIN){
            //赢了,弹出等待窗口
            preFabPath = "prefabs/match/ddz_congratulation";
            comName = "ddz_congratulation";
            this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                that._curWaitInfo = null;
                ddz.matchResultPanel = preFabNode.getComponent(comName);
            });
        }
        else{
            // this._curWaitInfo = null;
            preFabPath = "prefabs/match/ddz_fail";
            comName = "ddz_fail";
            this.showPopWinByPreFab(preFabPath, function (preFabNode) {
                var com = preFabNode.getComponent(comName);
                ddz.matchResultPanel = com;
                // if (ddz.matchModel.getStageIndex() == 1){
                    //不可复活的关卡失败
                com.over(ddz.matchModel.getStageIndex()-1);
                that._curWaitInfo = null;
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

    parseDes:function (value) {
        this._curDesInfo = value;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MATCH_DES);
    },

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

        }
    },

    parseGame:function (value) {
        switch (value.result.action){
            case "async_upgrade_hero_match" : {
                this.parseMatchList(value.result);
                break;
            }
        }
    },

    showBack:function () {
        if (this._curWaitInfo){
            // if (this._curWaitInfo.isLevelUp){
            //     //上次赢了,显示继续
            //     return true;
            // }
            // else{
            //     //输了,打到第5局了,也显示继续
            //     if (this._curWaitInfo.stageIndex >= 5){
            //         return true;
            //     }
            // }
            return true;
        }
        //wait被清除,显示开始
        return false;
    }
};