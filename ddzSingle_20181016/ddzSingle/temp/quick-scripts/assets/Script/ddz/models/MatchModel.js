(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/models/MatchModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c385cQ+FjhEvKitsA6L2cjV', 'MatchModel', __filename);
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


    checkOldVersion: function checkOldVersion() {
        if (this._curDesInfo.type == "async_upgrade_hero_match" && this._curDesInfo.fees[0] == '免费') {
            return true;
        }
        return false;
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=MatchModel.js.map
        