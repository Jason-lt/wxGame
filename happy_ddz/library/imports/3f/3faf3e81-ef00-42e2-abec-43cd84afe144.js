"use strict";
cc._RF.push(module, '3faf36B7wBC4qvsQ82Er+FE', 'MatchModel');
// Script/ddz/models/MatchModel.js

"use strict";

/**
 * Created by tuyoo on 2018/2/5.
 */

ddz.ShareRecord = {
    "00000": {
        leftCount: 0,
        pointId: '0000'
    }
};
ddz.ArenaToSharePoint = {
    "6790": "arenaPoint1",
    "6791": "arenaPoint1",
    "6792": "arenaPoint1",
    "6793": "arenaPoint1"
};

var matchDefaultCfg = {
    roomId: 6789
};

var delayTime = 3;

ddz.matchModel = {
    LAST_REWARD_DATE: 'last_reward_Date', //首页提示窗的最后展示时间
    LAST_FAIL_DATE: 'LAST_FAIL_DATE', //上一次失败时间
    FAIL_NUMBER_LIST: 'FAIL_NUMBER_LIST', //今天失败的次数
    LAST_RANK_WEEK: 'last_rank_week', //首页提示窗的最后展示时间
    SHOW_LOGIN_REWARD: 'show_login_reward', //待提示的每次登录奖励信息
    MATCH_REWARD_DES: 'match_reward_des', //奖池奖励
    UPDATE_NOTIFY_INFO: 'update_notify_info', //通告是否被点击
    ONHIDE_DATE: 'onhide_date',
    isGameFlow: false,
    isDiZhuWin: false,
    isStartMatch: false,
    currentGameMode: "default",
    arenaReviveStageCount: 3,
    isShowingRevive: false,
    canShowMatchRevivalPanel: false,
    revivalShareKey: "",
    new_gift_reward: null, //新人限时宝箱

    /**
     * 获取比赛详情
     */
    getMatchDes: function getMatchDes(roomId, matchId) {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_des",
                "gameId": 6,
                "roomId": roomId || matchDefaultCfg.roomId
            }
        };
        if (matchId) {
            pars.params["matchId"] = matchId;
        }

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 比赛报名
     */
    matchSignin: function matchSignin(roomId, matchId, feeIndex) {
        roomId = roomId || matchDefaultCfg.roomId;
        matchId = matchId || 0;
        var that = this;

        var signinFun = function signinFun() {
            var index = 0;
            if (typeof feeIndex != 'undefined') {
                index = feeIndex;
            }
            var pars = {
                "cmd": "room",
                "params": {
                    "action": "signin",
                    "gameId": 6,
                    "roomId": roomId,
                    "signinParams": {
                        "matchId": matchId,
                        "feeIndex": feeIndex
                    }
                }
            };

            hall.MsgFactory._sendCmd(pars);
            if (that._curWaitInfo) {
                that._curWaitInfo.stageIndex = 1;
            }
            ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
            // ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
        };

        if (roomId == matchDefaultCfg.roomId) {
            //检查报名费
            if (this._curDesInfo && this._curDesInfo.type == 'async_upgrade_hero_match') {
                var fees = this._curDesInfo.fees.concat();
                var oi = fees.indexOf('免费');
                if (oi > -1) {
                    fees.splice(oi, 1);
                }
                oi = fees.indexOf('免费报名');
                if (oi > -1) {
                    fees.splice(oi, 1);
                }
                if (fees.length > 0) {
                    var feesStr = fees.join('、');
                    var btns = [{
                        title: "取消",
                        callFunc: function callFunc() {}
                    }, {
                        title: "开始",
                        callFunc: function callFunc() {
                            signinFun();
                        }
                    }];
                    feesStr = feesStr.replace("钻石", "<img src='dda_button_diamond_black' width=42 height=34 /> ");
                    ddz.GlobalFuncs.showNormalTipsWindow("使用" + feesStr + "开始闯关", btns, "提示");
                } else {
                    signinFun();
                }
            }
        } else {
            signinFun();
        }
    },

    /**
     * 比赛恢复
     */
    matchResume: function matchResume(roomId, matchId) {
        roomId = roomId || matchDefaultCfg.roomId;
        matchId = matchId || 0;

        var pars = {
            "cmd": "room",
            "params": {
                "action": "resume",
                "gameId": 6,
                "roomId": roomId,
                "matchId": matchId
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 放弃当前比赛进度
     */
    matchGiveUp: function matchGiveUp(roomId, matchId) {
        roomId = roomId || matchDefaultCfg.roomId;
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_giveup",
                "gameId": 6,
                "roomId": roomId
            }
        };
        if (matchId) {
            pars.params.matchId = matchId;
        }
        hall.MsgFactory._sendCmd(pars);
    },

    matchSave: function matchSave(roomId, matchId) {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "save",
                "gameId": 6,
                "roomId": roomId
            }
        };
        if (matchId) {
            pars.params["matchId"] = matchId;
        }
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 继续下一关
     */
    matchChallenge: function matchChallenge(roomId, matchId) {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_challenge",
                "gameId": 6,
                "roomId": roomId || matchDefaultCfg.roomId
            }
        };
        if (matchId) {
            pars.params["matchId"] = matchId;
        }

        hall.MsgFactory._sendCmd(pars);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        // ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },

    /**
     * 复活
     */
    matchBack: function matchBack(roomId, matchId) {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_back",
                "gameId": 6,
                "roomId": roomId || matchDefaultCfg.roomId
            }
        };
        if (matchId) {
            pars.params.matchId = matchId;
        }

        hall.MsgFactory._sendCmd(pars);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        // ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },
    /**
     * 直接到第二关
     */
    matchBackNextLevel: function matchBackNextLevel(roomId, matchId, nextLevel) {
        var pars = {
            "cmd": "room",
            "params": {
                "action": "match_back_next_level",
                "gameId": 6,
                "roomId": roomId || matchDefaultCfg.roomId
            }
        };
        if (matchId) {
            pars.params.matchId = matchId;
        }

        if (nextLevel) {
            pars.params.nextLevel = nextLevel;
        }

        hall.MsgFactory._sendCmd(pars);
        ty.NotificationCenter.trigger(ddz.EventType.RESET_TABLE);
        // ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },

    /**
     * 获取奖池信息
     */
    matchUpdate: function matchUpdate() {
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

    getStageIndex: function getStageIndex() {
        return this._stageIndex;
    },

    /**
     *  {"action":"match_challenge","gameId":6,"roomId":67901000,"matchId":6792,"userId":10070,"challenge":1}
     */
    parseChallenge: function parseChallenge(value) {
        if (!value.error && (hall.ME.matchInfo.getCurrentMatchData() && value.matchId == hall.ME.matchInfo.getCurrentMatchData().matchId || hall.ME.matchInfo.curMatchAddition && value.matchId == hall.ME.matchInfo.curMatchAddition.matchId)) {
            this.showMatching();
        }
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_CHALLENGE, value);
    },

    onMatchWait: function onMatchWait(stateValue) {
        var des = hall.ME.matchInfo.getMatchDesByMatchId(ddz.matchModel._curWaitInfo.matchId);
        if (des.type && des.type.indexOf("common_arena_match") < 0) {
            return;
        }
        if (stateValue == 1) {
            var preFabPath = "prefabs/match/ddz_arena_start";
            ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
            hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                var com = preFabNode.getComponent("ddz_arena_start");
                var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(ddz.matchModel._curWaitInfo.matchId);
                com.showArenaStageProgress(ddz.matchModel._curWaitInfo.stageIndex, matchDes.stages, false);
            });
        }

        if (stateValue == 4) {
            ddz.matchModel.matchChallenge(ddz.matchModel._curWaitInfo.roomId, ddz.matchModel._curWaitInfo.matchId);
        }
    },

    showMatching: function showMatching() {
        var preFabPath = "ani/ddz_matching/Matching";
        var comName = "DdzMatching";
        ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var com = preFabNode.getComponent(comName);
            com.clearMessageList();
            com.playAni(true);
            ty.NotificationCenter.trigger(ddz.EventType.SHOW_MATCHING);
            ty.NotificationCenter.trigger(ddz.EventType.HIDE_DDZ_MAIN);
        });
    },

    showArenaReviveWindow: function showArenaReviveWindow(matchDes, stageIndex) {
        hall.LOGW('', "++++++++++++showArenaReviveWindow++++++++++++" + ddz.matchModel.canShowMatchRevivalPanel);
        if (ddz.matchModel.canShowMatchRevivalPanel) {
            var matchCondition = ddz.GlobalFuncs.getFailCondition("arena", ddz.GlobalFuncs.checkFailCount("arena"));
            hall.LOGW('', "++++++++++++matchCondition++++++++++++" + matchCondition);
            if (matchCondition) {
                // if (matchCondition.resurgenceCondition.conditionType == "ad" && !hall.adManager.canPlay)
                // {
                //     //当前复活是用广告方式,要检查广告是否播放成功,如果无可播放广告,不再弹出此窗口,让玩家使用钻石复活
                // }
                // else{
                ddz.GlobalFuncs.showRevivalWindow(matchCondition, "arena");
                return;
                // }
            }
        }
        if (ddz.Share.isMatchShare) {
            ddz.Share.isMatchShare = false;
            return;
        }
        if (!ddz.matchModel.isShowingRevive && !ddz.matchRevivalPanel) {
            ddz.GlobalFuncs.showArenaReviveWindow(matchDes, stageIndex);
        } else {
            ty.NotificationCenter.trigger(ddz.EventType.SHOW_MATCH_REVIVE);
        }
    },

    parseWait: function parseWait(value) {
        hall.LOGW('', "++++++++++++parseWait++++++++++++" + JSON.stringify(value));
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

        ddz.Share.shareKeywordReplace.stageIndex = value.stageIndex;

        var state = this._curWaitInfo.state;
        var preFabPath = "";
        var comName = "";
        var gameFlow = this._curWaitInfo.gameFlow;
        var isReConnect = this._curWaitInfo.reConnect;
        /*
         {"action":"wait","gameId":6,"roomId":67901000,"matchId":6791,
         "userId":10070,"stageIndex":2,"rank":1,"rankName":"1/75",
         "isLevelUp":true,"cardCount":1,"tableRank":1,"state":4}
         */
        var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(this._curWaitInfo.matchId);
        var currentMatchData = hall.ME.matchInfo.getCurrentMatchData();
        if (matchDes && matchDes.type.indexOf("common_arena_match") > -1) {
            hall.LOGD("wait0000", JSON.stringify(this._curWaitInfo));
            //当前收到的wait协议就是用户操作的arena比赛协议
            ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
            switch (state) {
                case 1:
                    //开局
                    break;
                case 2:
                    //在打牌
                    break;
                case 3:
                    //从后端common config中拿出相应的配置信息
                    var timerWaitArenaConfig = function () {
                        var arenaConfig = ddz.gameModel.getArenaMatchConfigJson();
                        if (arenaConfig) {
                            var shareTypePoint = arenaConfig[ddz.matchModel._curWaitInfo.matchId.toString()]["reviveSharePoint"];
                            //获取分享点的剩余次数
                            ddz.gameModel.shareToCheckReward(shareTypePoint);
                        }
                    }.bind(this);
                    ty.Timer.setTimer(cc.director, timerWaitArenaConfig, 0.1, 0);
                    break;
                case 4:
                    //晋级
                    break;
                default:
                    break;
            }

            var pausetime = 0;
            if (hall.GlobalFuncs.isInAtScene("TableScene")) {
                //牌桌上收到arena晋级消息,延迟3秒等待动画播放完成
                if (state == 4) {
                    pausetime = delayTime;
                }
            }
            if (state == 3) {
                //延迟0.5秒,等ArenaMatchConfig协议回来,wait返回的太快了
                pausetime = 0.5;
            }
            var timerWait = function () {
                if (state == 4) {
                    var curScene = cc.director.getScene();
                    if (ddz.matchModel._curWaitInfo.isLevelUp == true) {
                        //已晋级,进度保存/进入下一阶段
                        preFabPath = "prefabs/match/ddz_arena_levelup";
                        //comName = "DdzMatching";
                        ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
                        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                            var com = preFabNode.getComponent("ddz_arena_levelup");
                            com.setMatchDes(matchDes);
                            com.setRankString(ddz.matchModel._curWaitInfo.rankName);
                            com.showArenaStageProgress(ddz.matchModel._curWaitInfo.stageIndex, matchDes.stages, true);
                        });
                    }
                }
                if (state == 3) {
                    ddz.matchModel.showArenaReviveWindow(matchDes, ddz.matchModel._curWaitInfo.stageIndex);
                }
                ty.NotificationCenter.trigger(ddz.EventType.RECEIVE_MATCH_WAIT_STATE, state);
            }.bind(this);
            ty.Timer.setTimer(cc.director, timerWait, pausetime, 0);
            ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE, function () {
                // hall.LOGW("===","====cancelTimer===timerFunc========");
                ty.Timer.cancelTimer(cc.director, timerFunc);
                ty.NotificationCenter.ignore(ddz.EventType.GAME_HIDE, this);
            }, this);
            hall.ME.matchInfo.setCurMatchAdditionInfo(this._curWaitInfo);
            return;
        }

        this._stageIndex = this._curWaitInfo.stageIndex;
        if (ddz.friendModel.isEnterTable) {
            ddz.MsgFactory.saveMatch();
        }

        if (state == 3) {
            if (ddz.matchResultPanel) {
                ddz.matchResultPanel.shut();
            }

            ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
            //开局之前的等待(3可以在任意场景弹出)
            preFabPath = "ani/ddz_matching/Matching";
            comName = "DdzMatching";
            ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
            hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                var com = preFabNode.getComponent(comName);
                com.playAni(true);
                ty.NotificationCenter.trigger(ddz.EventType.HIDE_DDZ_MAIN);
            });
        }

        /*
         1 在牌桌打牌中
         2 报名或者晋级成功，等待闯关
         3 开始挑战
         4 闯关失败 等待复活
         5 游戏结束
         */
        if (hall.GlobalFuncs.isInAtScene("TableScene") && (state == 2 || state == 4)) {
            if (ddz.matchModel.isGameFlow) {
                return;
            }
            if (ddz.matchResultPanel) {
                //已经存在面板了,不要在重复弹出(这种情况存在于牌桌内断线重连的情况,重连后又会收到一次协议,导致重复弹出面板)
                ddz.LOGD(null, "已经存在面板,不要重复弹出!");
                // if (ddz.waitGetRevial && ddz.waitGetRevial.type == 'back'){
                //     ddz.matchResultPanel.shut();
                //     this.matchBack();
                //     ddz.waitGetRevial = null;
                // }
                return;
            }
            //只有在牌桌上,才弹出2,4等待窗口

            var isLevelUp = state == 2;
            if (isLevelUp && !gameFlow) {
                //赢了一局,晋级
                preFabPath = "prefabs/match/ddz_success";
                comName = "ddz_success";
            } else {
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
            if (stageIndex < 0) {
                stageIndex = 0;
            }

            var timerFunc = function () {
                // hall.LOGW("===","====timerFunc===timerFunc========");
                if (ddz.matchResultPanel) {
                    //如果已经存在结算面板,就不要再弹出
                    return;
                }
                var curScene = cc.director.getScene();
                var tableScene = curScene.children[0].getComponent('DdzTableScene');
                if (tableScene && tableScene.tableInfo().ftInfo) {
                    return;
                }
                ty.NotificationCenter.ignore(ddz.EventType.GAME_HIDE, this.onGameHide, this);
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var com = preFabNode.getComponent(comName);
                    if (comName == "ddz_success") {
                        com.progress.getComponent("ddz_progress").setProgress(stageIndex, isLevelUp);
                        com.resultTitle.getComponent('ddz_resultTitle').setTitle(stageIndex, isLevelUp);
                    } else {
                        var gindex = ddz.matchModel.getStageIndex() - 1;
                        if (gameFlow) {
                            if (ddz.matchModel.isDiZhuWin) {
                                com.gameFlowOver(gindex, "因队友托管，可重闯本关");
                            } else {
                                com.gameFlowOver(gindex, "托管不记录成绩,请重闯本关");
                            }
                        } else {
                            if (gindex == 0) {
                                //第一关失败,显示Over
                                com.over(gindex);
                            } else {
                                com.setDiamondCount(gindex);
                            }
                        }
                    }
                    ddz.matchResultPanel = com;
                    ddz.matchResultPanel.showResults(false);
                    if (isReConnect) {
                        ddz.matchResultPanel.showResults(true);
                    }
                });
            }.bind(this);

            // ty.Timer.setTimer(cc.director,timerFunc, delayTime, 0);

            timerFunc();

            ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE, function () {
                // hall.LOGW("===","====cancelTimer===timerFunc========");
                ty.Timer.cancelTimer(cc.director, timerFunc);
                ty.NotificationCenter.ignore(ddz.EventType.GAME_HIDE, this);
            }, this);
        }
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_WAIT_INFO, ddz.matchModel.getStageIndex());
    },

    getCurWaitInfo: function getCurWaitInfo() {
        return this._curWaitInfo;
    },

    cleanWaitInfo: function cleanWaitInfo() {
        if (this._curWaitInfo) {
            this._curWaitInfo = null;
        }
    },

    parseGiveUp: function parseGiveUp(value) {
        this._curWaitInfo = null;
        if (this.waitSignin) {
            ty.NotificationCenter.trigger(ddz.EventType.MATCH_GIVE_UP, value);
            this.matchSignin();
            this.waitSignin = null;
        }
    },

    parseOver: function parseOver(value) {
        if (ddz.matchModel.isGameFlow) {
            return;
        }
        this._curOverInfo = value;

        var preFabPath;
        var comName;
        var that = this;

        if (ddz.matchResultPanel) {
            ddz.LOGD(null, "已经存在面板,不要重复弹出!");
            //已经存在面板了,不要在重复弹出(这种情况存在于牌桌内断线重连的情况,重连后又会收到一次协议,导致重复弹出面板)
            that._curWaitInfo = null;
            that._stageIndex = 0;
            ty.UserInfo.loc = '0.0.0.0';
            return;
        }

        var matchDes = hall.ME.matchInfo.matchDesMap[this._curOverInfo.matchId.toString()];
        if (matchDes && matchDes.type.indexOf("common_arena_match") > -1) {
            ddz.matchModel.currentGameMode = "default";
            //arena比赛
            if (this._curOverInfo.reason == ddz.MATCH_REASON.WIN) {
                //赢了,弹出等待窗口
                preFabPath = "prefabs/match/ddz_arena_result_win";
                comName = "ddz_arena_result_win";
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    ddz.arenaResultPanel = preFabNode.getComponent(comName);
                    ddz.arenaResultPanel.setOverInfo(that._curOverInfo);
                });
            } else {
                preFabPath = "prefabs/match/ddz_arena_result_lose";
                comName = "ddz_arena_result_lose";
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    ddz.arenaResultPanel = preFabNode.getComponent(comName);
                    ddz.arenaResultPanel.setOverInfo(that._curOverInfo);
                });
            }
            return;
        }
        var resultFunc = function resultFunc() {
            if (that._curOverInfo.reason == ddz.MATCH_REASON.WIN) {
                //赢了,弹出等待窗口
                preFabPath = "prefabs/match/ddz_congratulation";
                comName = "ddz_congratulation";
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    that._curWaitInfo = null;
                    that._stageIndex = 0;
                    ty.UserInfo.loc = '0.0.0.0';
                    ddz.matchResultPanel = preFabNode.getComponent(comName);
                    ddz.matchResultPanel.setMcountDetail(that._curOverInfo.mcount);
                    if (ddz.gameModel.isAcceptGameWin) {
                        ddz.matchResultPanel.showResults(false);
                        ddz.gameModel.isAcceptGameWin = false;
                    } else {
                        ddz.matchResultPanel.showResults(true);
                    }
                });
            } else {
                // this._curWaitInfo = null;
                preFabPath = "prefabs/match/ddz_fail";
                comName = "ddz_fail";
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var com = preFabNode.getComponent(comName);
                    ddz.matchResultPanel = com;
                    // if (ddz.matchModel.getStageIndex() == 1){
                    //不可复活的关卡失败
                    com.over(ddz.matchModel.getStageIndex() - 1);
                    that._curWaitInfo = null;
                    ty.UserInfo.loc = '0.0.0.0';
                    if (ddz.gameModel.isAcceptGameWin) {
                        ddz.matchResultPanel.showResults(false);
                        ddz.gameModel.isAcceptGameWin = false;
                    } else {
                        ddz.matchResultPanel.showResults(true);
                    }
                    // }
                    // else{
                    //     // com.setDiamondCount(ddz.matchModel.getStageIndex() - 1);
                    // }
                });
            }
        };

        var curDay = hall.GlobalTimer.getCurDay();
        if (ty.UserInfo.lastUpdateTgDate && ty.UserInfo.lastUpdateTgDate != curDay) {
            //有可能过12点了
            ty.UserInfo.tgCount = 1;
        } else {
            //通关,通关次数加1
            ty.UserInfo.tgCount += 1;
        }

        ty.UserInfo.lastUpdateTgDate = curDay;
        ddz.gameModel.setTongGuanCount(ty.UserInfo.tgCount);

        resultFunc();
        // ty.Timer.setTimer(cc.director,function(){
        //     resultFunc();
        // }, 3, 0, 0);
    },

    getCurOverInfo: function getCurOverInfo() {
        return this._curOverInfo;
    },

    parseMatchInfo: function parseMatchInfo(value) {

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

    getCurUpdateInfo: function getCurUpdateInfo() {
        return this._curUpdateInfo;
    },

    getCurWinnerCount: function getCurWinnerCount() {
        var histories = this._curDesInfo.histories;
        if (histories) {
            var winnerCount = histories.winnerCount;
            if (winnerCount) {
                return winnerCount;
            }
            return 0;
        }
        return 0;
    },

    parseDes: function parseDes(value) {
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

        hall.ME.matchInfo.addMatchDesInfo(value);
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_MATCH_DES, value);
        var histories = value.histories;
        hall.LOGD(this._TAG, "parseDes -------------------------" + JSON.stringify(histories));

        var couponCount = hall.ME.udataInfo.m_couponCount;
        var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
        var sumReward = couponCount + exchangedCoupon;
        sumReward = sumReward / 100;
        ddz.Share.shareKeywordReplace.curSumReward = sumReward;
        ddz.Share.shareKeywordReplace.selfTotalBonus = sumReward;
        ddz.Share.shareKeywordReplace.selfAllWinnerCount = histories.winnerCount;
        //TODO
        if (debugMode) {
            return;
        }
        ddz.GlobalFuncs.upDateRankData(sumReward + "");

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

    getCurDes: function getCurDes() {
        return this._curDesInfo;
    },

    parseMatchList: function parseMatchList(value) {
        this._curMatchListInfo = value['matches'];
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_MATCH_LIST_INFO);
    },
    getMatchListInfo: function getMatchListInfo() {
        return this._curMatchListInfo;
    },

    ///
    parse: function parse(value) {
        switch (value.result.action) {
            case "match_des":
                {
                    this.parseDes(value.result);
                    break;
                }
            case "wait":
                {
                    this.parseWait(value.result);
                    break;
                }
            case "over":
                {
                    this.parseOver(value.result);
                    break;
                }
            case "match_giveup":
                {
                    if (value.error && value.error.code != 1) {
                        hall.MsgBoxManager.showToast({ title: value.error.info + ";错误码:" + value.error.code });
                    }
                    this.parseGiveUp(value.result);
                    break;
                }
            case "update":
                {
                    this.parseMatchInfo(value.result);
                    break;
                }
            case "lottery":
                {
                    //解析开奖消息
                    this.parseLottery(value.result);
                    break;
                }
            case "signin":
                {
                    if (value.error) {
                        // "error":{"code":7,"info":"费用不足，请稍后再来"}
                        if (value.error.code == 7) {
                            var todoTaskMsg = {
                                "action": "pop_info_wnd",
                                "params": {
                                    "des": "fuhaoBuyFailed-你的钻石不够啦\n邀请好友进入游戏可以得钻石哟～"
                                }
                            };
                            hall.ToDoTask.runOneTask(todoTaskMsg);
                        } else {
                            hall.MsgBoxManager.showToast({ title: value.error.info });
                        }
                    }
                    this.parseSignInInfo(value);
                    break;
                }
            case ddz.EventType.ACTION_SAVE:
                {
                    this.parseSave(value.result);
                    break;
                }
            case ddz.EventType.ACTION_RESUME:
                {
                    this.checkMsgState(value);
                    this.parseResume(value.result);
                    break;
                }
            case ddz.EventType.ACTION_CHALLENGE:
                {
                    this.parseChallenge(value.result);
                    break;
                }
            case "match_back":
                {
                    if (!value.error) {
                        if (value.result.nextStageIndex > value.result.stageIndex) {
                            if (value.result.stageIndex == 1 && value.result.nextStageIndex == 2) {
                                hall.MsgBoxManager.showToast({ title: '恭喜你,晋级成功!' });
                            } else {
                                hall.MsgBoxManager.showToast({ title: '恭喜你,跳关成功!' });
                            }
                        } else if (value.result.nextStageIndex == value.result.stageIndex) {
                            hall.MsgBoxManager.showToast({ title: '恭喜你,复活成功!' });
                        }
                    } else {
                        hall.MsgBoxManager.showToast({ title: value.error.info });
                    }
                    ty.NotificationCenter.trigger("arena_match_back", value);
                    break;
                }
            case "rank":
                {
                    hall.ME.matchInfo.setCurMatchAdditionInfo(value.result);
                    ty.NotificationCenter.trigger(ddz.EventType.MACH_RANK_CHANGE, value.result);
                    break;
                }
            case "enter_queue":
                {
                    this.parseQueue(value.result);
                    break;
                }
            case "leave_queue":
                {
                    this.parseLeaveQueue(value.result);
                    break;
                }
        }
    },

    checkMsgState: function checkMsgState(msg) {
        if (msg && msg.error && msg.error.code && msg.error.code != 0) {
            ty.NotificationCenter.trigger("signin_fail", msg);
        } else {
            ty.NotificationCenter.trigger("signin_success", msg);
        }
    },

    parseSave: function parseSave(result) {
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

        if (result.save === 1) {
            this._curWaitInfo = null;
            ddz.MsgFactory.getMatchRecords();
            ty.NotificationCenter.trigger(ddz.EventType.SAVE_MATCH_SUCCESS, result);
            if (ddz.friendModel.isEnterTable) {
                ddz.friendModel.enterFTTable(ddz.Share.shareKeywordReplace.inviteFriendID);
            }
        } else {
            ddz.friendModel.isEnterTable = false;
        }
    },

    parseResume: function parseResume(result) {

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

        if (result.save === 1) {
            //成功了,解析携带过来的wait消息
            var waitInfo = JSON.parse(result.wati);
            this.parseWait(waitInfo.result);
            ddz.gameModel._matchRecords = null;
            hall.LOGW("===", "====parseResume====" + JSON.stringify(waitInfo.result));
        } else {}

        if (!this.isStartMatch) {
            return;
        }
        if (this._curWaitInfo) {
            if (this._curWaitInfo.state == 2) {
                this.matchChallenge();
            } else {
                if (this._curWaitInfo.stageIndex == 1) {
                    this.waitSignin = true;
                    this.matchGiveUp();
                } else {
                    this.showGetDiamondWindow(this, this._curWaitInfo.stageIndex);
                }
            }
        } else {
            this.matchSignin();
        }
        this.isStartMatch = false;
        // ty.NotificationCenter.trigger(ddz.EventType.RESUME_MATCH, result.save === 1);
    },

    parseLottery: function parseLottery(result) {
        this._curLotteryInfo = result;
    },

    getCurLotteryInfo: function getCurLotteryInfo() {
        return this._curLotteryInfo;
    },

    parseQueue: function parseQueue(result) {
        // {
        //     "cmd":"room",
        //     "result":{
        //     "action":"enter_queue",
        //         "gameId":6,
        //         "roomId":60181000,
        //         "playMode":"123",
        //         "userId":10042,
        //         "mixedRoomId":"high",
        //         "signs":1
        // }
        // }
        this._queueInfo = result;
        if (result.signs && result.signs == 1) {
            hall.GlobalFuncs.onEnterQueue();
        }
    },

    getCurQueueInfo: function getCurQueueInfo() {
        return this._queueInfo;
    },

    parseLeaveQueue: function parseLeaveQueue(result) {
        // {
        //     "cmd":"room",
        //     "result":{
        //     "action":"leave_queue",
        //         "gameId":6,
        //         "roomId":60181000,
        //         "playMode":"123",
        //         "userId":10042,
        //         "mixedRoomId":null
        // },
        //     "error":{
        //     "code":2,
        //         "info":"无此房间"
        // }
        // }
        if (result.playMode) {
            ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
            hall.GlobalFuncs.gotoRoomListScene();
        } else if (result.reason == -1) {
            hall.GlobalFuncs.gotoDdz();
        }
    },

    parseSignInInfo: function parseSignInInfo(value) {
        this.checkMsgState(value);
    },

    getDiamondCountNeeded: function getDiamondCountNeeded() {
        var guan = ddz.matchModel.getStageIndex() - 1;
        var desInfo = ddz.matchModel.getCurDes();
        if (desInfo && desInfo.detailStages) {
            var stageInfo = desInfo.detailStages;
            if (stageInfo && stageInfo.length > guan) {
                var des = stageInfo[guan];
                if (des && des.count) {
                    return des.count;
                }
            }
        }
        return "1";
    },

    showGetDiamondWindow: function showGetDiamondWindow(manager, guans) {
        // var guans = 1;
        // if (this._curWaitInfo){
        //     guans = this._curWaitInfo.stageIndex;
        // }
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        var preFabPath = "prefabs/ddz_window_tips";
        var comName = "ddz_tipsWindow";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = manager;
            var buttonS = "";
            var diamondCount = hall.ME.udataInfo.diamondCount;
            var count = ddz.matchModel.getDiamondCountNeeded();
            var tipS = "<color=#1A6951>使用 </c><img src='dda_button_diamond_black' height=34 width=42/>" + "<color=#1A6951> " + count + " 可继续挑战本关\n已有</color><img src='dda_button_diamond_black' height=34 width=42/>" + "<color=#1A6951> " + diamondCount + "</color>";

            if (diamondCount >= count) {
                buttonS = "使用";
                // tipS = "使用钻石继续挑战";
            } else {
                buttonS = "分享";
                // tipS = "使用钻石继续挑战";
            }

            var rightSrc = "dda_button_diamond";
            if (buttonS == "分享") {
                rightSrc = "";
            }

            var testArray = [{
                title: "重闯第一关",
                bottomType: 0

            }, {
                title: buttonS,
                right: rightSrc,
                bottomType: 1
            }];
            window.setTitleContentAndButtons("提示", tipS, testArray);
            // window.changeContentLabelString(guans);
        });
    },

    playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        var reultType = ddz.Share.resultType;
        if (shareType == ddz.Share.onShareType.clickStatShareTypeMainRestartWindow) {
            // ddz.gameModel.checkShareReward(ddz.Share.SharePointType.failSix);
            switch (reultType) {
                case 1:
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({ title: '请分享到微信群哦~' });
                    }
                    break;
                case 2:
                    if (!ddz.gameModel.isBringVersion) {
                        hall.MsgBoxManager.showToast({ title: '请不要频繁分享到一个群~' });
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

    //显示开始闯关or继续闯关
    showBack: function showBack() {
        if (this._curWaitInfo) {
            return true;
        }
        if (ddz.gameModel._matchRecords) {
            //有比赛记录,也认为是可以返回
            return true;
        }
        //wait被清除,显示开始
        return false;
    },

    checkOldVersion: function checkOldVersion() {
        if (this._curDesInfo.type == "async_upgrade_hero_match" && this._curDesInfo.fees[0] == '免费') {
            return true;
        }
        return false;
    },

    startMatchProgress: function startMatchProgress() {
        hall.LOGD("", "file = [MatchModel] fun = [startMatchProgress]" + JSON.stringify(this._curWaitInfo) + "==" + JSON.stringify(ddz.gameModel._matchRecords));

        if (this._curWaitInfo && this._curWaitInfo.matchId == 6789) {
            if (this._curWaitInfo.state == 2) {
                this.matchChallenge();
            } else {
                if (this._curWaitInfo.stageIndex == 1) {
                    if (this.checkOldVersion()) {
                        this.matchSignin();
                    } else {
                        //第一关失败,放弃掉
                        ddz.matchModel.waitSignin = true;
                        ddz.matchModel.matchGiveUp();
                    }
                } else {
                    this.showGetDiamondWindow(this, this._curWaitInfo.stageIndex);
                }
            }
            return;
        }
        if (ddz.gameModel._matchRecords) {
            // var records = ddz.gameModel._matchRecords;
            // for (var i = 0 ; i < records.length ; i ++){
            //     var record = records[i];
            //     if(record.roomId.toString().indexOf("6789") > -1){
            //         var state = record.state;
            //         if (state == 2){
            //             this.matchChallenge();
            //         } else{
            //             // this.showGetDiamondWindow(this);
            //             if(record.stageIndex == 1){
            //                 this.matchSignin();
            //             }else {
            //                 this.showGetDiamondWindow(this,record.stageIndex);
            //             }
            //         }
            //         return;
            //     }
            // }
            this.isStartMatch = true;
            ddz.MsgFactory.resumeMatch();
            return;
        }
        this.matchSignin();
    },
    onClickLeftButton: function onClickLeftButton(event) {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_SHARE_STATE, this);
        this.waitSignin = true;
        this.matchGiveUp();
    },

    onClickRightButton: function onClickRightButton(event) {
        ty.NotificationCenter.ignore(ddz.EventType.UPDATE_SHARE_STATE, this);
        var diamondCount = hall.ME.udataInfo.diamondCount;
        var count = ddz.matchModel.getDiamondCountNeeded();
        if (diamondCount >= count) {
            this.matchBack();
        } else {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeMainRestartWindow);
        }
    },

    /**
     *
     {"cmd":"room","result":{"action":"over","gameId":6,"roomId":67901000,"matchId":6792,"userId":10070,"rank":21,"info":"比赛：5元红包赛\n名次：第21名\n奖励：7500金币\n奖励已发放，请您查收。","reason":1,"rewardDesc":"7500金币","rewards":[{"icon":"user:chip","name":"金币","count":7500,"iconPath":"http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t300k_2.png"}],"feeIndex":0,"date":"2018-05-08","time":"00:53","mname":"5元红包赛","mcount":90}}
     * @param value
     */
    testOver: function testOver() {
        var _curOverInfo = {
            "cmd": "room",
            "result": {
                "action": "over",
                "gameId": 6,
                "roomId": 67901000,
                "matchId": 6792,
                "userId": 10070,
                "rank": 46,
                "info": "比赛：5元红包赛\n名次：第21名\n奖励：7500金币\n奖励已发放，请您查收。",
                "reason": 1,
                "rewardDesc": "7500金币",
                "rewards": [{
                    "icon": "user:chip",
                    "name": "金币",
                    "count": 7500,
                    "iconPath": "http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t300k_2.png"
                }, {
                    "icon": "user:diamond",
                    "name": "钻石",
                    "count": 7500,
                    "iconPath": "http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t300k_2.png"
                }],
                "feeIndex": 0,
                "date": "2018-05-08",
                "time": "00:53",
                "mname": "5元红包赛",
                "mcount": 90
            }
        };
        var preFabPath = "prefabs/match/ddz_arena_result_win";
        var comName = "ddz_arena_result_win";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            ddz.arenaResultPanel = preFabNode.getComponent(comName);
            ddz.arenaResultPanel.setOverInfo(_curOverInfo.result);
            //that._curWaitInfo = null;
            //ty.UserInfo.loc = '0.0.0.0';
            //ddz.matchResultPanel = preFabNode.getComponent(comName);
            //ddz.matchResultPanel.setMcountDetail(that._curOverInfo.mcount);
        });
    },

    testSignin: function testSignin() {
        ddz.matchModel.matchSignin(6790, 6793, 0);
    },

    testArenaWin: function testArenaWin() {
        var over = { "cmd": "room", "result": { "action": "over", "gameId": 6, "roomId": 67901000, "matchId": 6791, "userId": 10070, "rank": 6, "info": "比赛：1元红包赛\n名次：第6名\n奖励：3000金币+0.01元\n奖励已发放，请您查收。", "reason": 1, "rewardDesc": "3000金币+0.01元", "rewards": [{ "icon": "user:chip", "name": "金币", "count": 3000, "iconPath": "http://ddz.dl.tuyoo.com/cdn37/hall/pdt/imgs/goods_t300k_2.png" }, { "icon": "user:coupon", "name": "红包券", "count": 1, "iconPath": "http://ddz.dl.tuyoo.com/cdn37/hall/item/imgs/coupon_1.png" }], "feeIndex": 0, "date": "2018-05-11", "time": "15:39", "mname": "1元红包赛", "mcount": 90 } };
        this._curOverInfo = over.result;
        var preFabPath = "prefabs/match/ddz_arena_result_win";
        var comName = "ddz_arena_result_win";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var com = preFabNode.getComponent(comName);
            com.setOverInfo(that._curOverInfo);
            //that._curWaitInfo = null;
            //ty.UserInfo.loc = '0.0.0.0';
            //ddz.matchResultPanel = preFabNode.getComponent(comName);
            //ddz.matchResultPanel.setMcountDetail(that._curOverInfo.mcount);
        });
    },

    testStart: function testStart() {
        var preFabPath = "prefabs/match/ddz_arena_start";
        ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var match_des = {
                "action": "match_des",
                "gameId": 6,
                "roomId": 67901000,
                "matchId": 6791,
                "userId": 10070,
                "name": "1元红包赛",
                "desc": "满90人开赛，等待时间短，轮转速度快。\n9轮1局瑞士移位决出所有名次。",
                "type": "async_common_arena_match",
                "fees": [{
                    "desc": "1钻石",
                    "canPay": false
                }, {
                    "desc": "1000金币",
                    "canPay": true
                }],
                "ranks": [{
                    "start": 1,
                    "end": 1,
                    "desc": "1元"
                }, {
                    "start": 2,
                    "end": 2,
                    "desc": "6000金币+0.02元"
                }, {
                    "start": 3,
                    "end": 3,
                    "desc": "4000金币+0.02元"
                }, {
                    "start": 4,
                    "end": 6,
                    "desc": "3000金币+0.01元"
                }, {
                    "start": 7,
                    "end": 12,
                    "desc": "2000金币"
                }, {
                    "start": 13,
                    "end": 21,
                    "desc": "1500金币"
                }, {
                    "start": 22,
                    "end": 33,
                    "desc": "200金币"
                }, {
                    "start": 34,
                    "end": 45,
                    "desc": "500金币"
                }],
                "stages": [{
                    "index": 1,
                    "name": "90进75",
                    "riseUserCount": 75,
                    "totalUserCount": 90,
                    "canBack": 0,
                    "backFee": "",
                    "backFeeCount": 0
                }, {
                    "index": 2,
                    "name": "75进60",
                    "riseUserCount": 60,
                    "totalUserCount": 75,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 3,
                    "name": "60进45",
                    "riseUserCount": 45,
                    "totalUserCount": 60,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 4,
                    "name": "45进33",
                    "riseUserCount": 33,
                    "totalUserCount": 45,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 5,
                    "name": "33进21",
                    "riseUserCount": 21,
                    "totalUserCount": 33,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 6,
                    "name": "21进12",
                    "riseUserCount": 12,
                    "totalUserCount": 21,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 7,
                    "name": "12进6",
                    "riseUserCount": 6,
                    "totalUserCount": 12,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 8,
                    "name": "6进3",
                    "riseUserCount": 3,
                    "totalUserCount": 6,
                    "canBack": 1,
                    "backFee": "1个钻石",
                    "backFeeCount": 1
                }, {
                    "index": 9,
                    "name": "决赛",
                    "riseUserCount": 1,
                    "totalUserCount": 3,
                    "canBack": 0,
                    "backFee": "",
                    "backFeeCount": 0
                }],
                "histories": {
                    "playCount": 9,
                    "crownCount": 1,
                    "bestRank": 1,
                    "records": [{
                        "time": 1525688021,
                        "desc": "第2名，奖励6000金币+0.02元"
                    }, {
                        "time": 1525688477,
                        "desc": "第3名，奖励4000金币+0.02元"
                    }, {
                        "time": 1525690482,
                        "desc": "第1名，奖励1元"
                    }]
                },
                "condition": 90,
                "timeRange": "20分钟",
                "matchIntroduce": "本比赛采用快速赛赛制",
                "saveInfo": {
                    "record": {},
                    "needResume": 0
                }
            };
            var com = preFabNode.getComponent("ddz_arena_start");
            ////var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(ddz.matchModel._curWaitInfo.matchId);
            com.showArenaStageProgress(1, match_des.stages, true);
        });
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

cc._RF.pop();