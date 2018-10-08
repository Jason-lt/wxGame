// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        titleLable: {
            default: null,
            type: cc.Label
        },
        detailLabel1: {
            default: null,
            type: cc.Label
        },
        detailLabel1_value: {
            default: null,
            type: cc.Label
        },
        detailLabel2: {
            default: null,
            type: cc.Label
        },
        detailLabel2_value: {
            default: null,
            type: cc.RichText
        },
        buttonLable: {
            default: null,
            type: cc.RichText
        },
        winner_reward: {
            default: null,
            type: cc.Label
        },
        winner2_reward: {
            default: null,
            type: cc.Label
        },
        winner3_reward: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function() {
        //this.hasSavedData = false;
        //var data = {
        //    savedData: {
        //        curTurn: 5,
        //        score: 400,
        //        maxTurn: 9,
        //    },
        //    matchInfo:{
        //        matchTime: "满60人开赛",
        //        fees: [
        //            {
        //                type:"diamond",
        //                count: 23
        //            },
        //            {
        //                type:"coin",
        //                count: 23000
        //            }
        //        ],
        //        rewards: {
        //            "1":{
        //                type:"money",
        //                num:10,
        //                reward_des:"10元微信红包"
        //            },
        //            "2":{
        //                type:"coin",
        //                num:10000,
        //                reward_des:"10000金币"
        //            }
        //        }
        //    }
        //};
        //this.updateByMatchData(data)

        ty.NotificationCenter.listen("signin_fail", this.onSigninFail, this);
        ty.NotificationCenter.listen(ddz.EventType.RECEIVE_MATCH_WAIT_STATE, this.onMatchWait, this);
        ty.NotificationCenter.listen(ddz.EventType.SHOW_MATCHING, this.onClickClose, this);
        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.onSaveMatch, this);
    },

    onMatchWait: function(state) {
        ddz.matchModel.onMatchWait(state);
    },

    onSigninFail: function(value) {
        if(value.result.matchId == this.matchData.matchId) {
           if(value.error.code == 7) {
               //费用不足
               // var matchDes = hall.ME.matchInfo.matchDesMap[this.matchData.matchId.toString()];
               // var feeDesc = matchDes.fees[this.feeIndex].desc;
               // var type = '';
               // if(feeDesc.indexOf("钻石") >=0) {
               //     type = 'diamond';
               // } else if(feeDesc.indexOf("金币") >=0){
               //     type = 'coin';
               // }
               // var self = this;
               // var preFabPath = "prefabs/ddz_window_fee_lack";
               // var  comName = "ddz_window_fee_lack";
               // hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
               //     var window = preFabNode.getComponent(comName);
               //     window.updateByFeeType(type);
               // });
           }
           else if (value.error.code == 2 || value.error.code == 4){
               ddz.GlobalFuncs.showNormalTipsWindow(value.error.info, [{
                   title : '确定',
                   callFunc :function () {}
               }])
           }
        }
    },

    /*
     {
     "cmd": "room",
     "result": {
     "action": "match_des",
     "gameId": 6,
     "roomId": 67901000,
     "matchId": 6791,
     "userId": 10069,
     "name": "1\元\红\包\赛",
     "desc": "\满90\人\开\赛\，\等\待\时\间\短\，\轮\转\速\度\快\。\\n9\轮1\局\瑞\士\移\位\决\出\所\有\名\次\。",
     "type": "common_arena_match",
     "fees": ["1\钻\石", "1000\金\币"],
     "ranks": [{
     "start": 1,
     "end": 1,
     "desc": "1\元"
     }, {
     "start": 2,
     "end": 2,
     "desc": "6000\金\币+0.02\元"
     }, {
     "start": 3,
     "end": 3,
     "desc": "4000\金\币+0.02\元"
     }, {
     "start": 4,
     "end": 6,
     "desc": "3000\金\币+0.01\元"
     }, {
     "start": 7,
     "end": 12,
     "desc": "2000\金\币"
     }, {
     "start": 13,
     "end": 21,
     "desc": "1500\金\币"
     }, {
     "start": 22,
     "end": 33,
     "desc": "200\金\币"
     }, {
     "start": 34,
     "end": 45,
     "desc": "500\金\币"
     }],
     "stages": [{
     "index": 1,
     "name": "90\进75",
     "riseUserCount": 75,
     "totalUserCount": 90
     }, {
     "index": 2,
     "name": "75\进60",
     "riseUserCount": 60,
     "totalUserCount": 75
     }, {
     "index": 3,
     "name": "60\进45",
     "riseUserCount": 45,
     "totalUserCount": 60
     }, {
     "index": 4,
     "name": "45\进33",
     "riseUserCount": 33,
     "totalUserCount": 45
     }, {
     "index": 5,
     "name": "33\进21",
     "riseUserCount": 21,
     "totalUserCount": 33
     }, {
     "index": 6,
     "name": "21\进12",
     "riseUserCount": 12,
     "totalUserCount": 21
     }, {
     "index": 7,
     "name": "12\进6",
     "riseUserCount": 6,
     "totalUserCount": 12
     }, {
     "index": 8,
     "name": "6\进3",
     "riseUserCount": 3,
     "totalUserCount": 6
     }, {
     "index": 9,
     "name": "\决\赛",
     "riseUserCount": 1,
     "totalUserCount": 3
     }],
     "histories": {
     "playCount": 3,
     "crownCount": 0,
     "bestRank": 12,
     "records": [{
     "time": 1525402663,
     "desc": "\第12\名\，\奖\励2000\金\币"
     }]
     },
     "condition": 90,
     "timeRange": "20\分\钟",
     "matchIntroduce": "\本\比\赛\采\用\快\速\赛\赛\制"
     }
     }
     */
    updateByMatchData: function() {
        hall.LOGD("updateByMatchData", "gogogo");
        this.matchData = hall.ME.matchInfo.getCurrentMatchData();
        var matchDes = hall.ME.matchInfo.matchDesMap[this.matchData.matchId.toString()];
        hall.LOGW("","file = [ddz_window_match_enter] fun = [updateByMatchData] matchDes = " + JSON.stringify(matchDes));
        this.titleLable.string = this.matchData.matchName;
        if(this.matchData.isRecordExist()) {
            this.detailLabel1.string = "轮次:";
            this.detailLabel2.string = "积分:";
            this.detailLabel1_value.string = this.matchData.record.stageIndex + '/' + matchDes.stages.length;
            this.detailLabel2_value.string = "<color=#1A6951>" + this.matchData.record.mscore + "</c>";
            this.buttonLable.string = "<color=#ffffff>继 续</color>";
        } else {
            this.detailLabel1.string = "开赛条件:";
            this.detailLabel2.string = "报名费用:";
            this.detailLabel1_value.string = this.matchData.matchType.indexOf("common_arena_match") > -1 ? "满90人开赛" : this.matchData.taskDesc;
            if(matchDes.fees && matchDes.fees.length == 1) {
                this.detailLabel2_value.string = matchDes.fees[0].desc;
                var _des = matchDes.fees[0].desc;
                if (_des.indexOf("金币") >= 0) {
                    var str = _des.slice(0,_des.indexOf("金币"));
                    this.detailLabel2_value.string = "<img src='ddz_coin_green' height=36 width=36/><color=#1A6951> " + str + "</c>";
                }else if (_des.indexOf("钻石") >= 0) {
                    var str = _des.slice(0,_des.indexOf("钻石"));
                    this.detailLabel2_value.string = "<img src='dda_button_diamond_black' height=42 width=34/><color=#1A6951> " + str + "</c>";
                }
                this.feeIndex = 0;
            }
            else {
                var desc = matchDes.fees[0].desc;
                this.feeIndex = 0;
                for(var key = 0; key < matchDes.fees.length; key++) {
                    if(matchDes.fees[key].canPay) {
                        desc = matchDes.fees[key];
                        this.feeIndex = key;
                        break;
                    }
                }
                this.detailLabel2_value.string = "<color=#1A6951>" + matchDes.fees[this.feeIndex].desc + "</c>";
                var _des = matchDes.fees[this.feeIndex].desc;
                if (_des.indexOf("金币") >= 0) {
                    var str = _des.slice(0,_des.indexOf("金币"));
                    this.detailLabel2_value.string = "<img src='ddz_coin_green' height=36 width=36/><color=#1A6951> " + str + "</c>";
                }else if (_des.indexOf("钻石") >= 0) {
                    var str = _des.slice(0,_des.indexOf("钻石"));
                    this.detailLabel2_value.string = "<img src='dda_button_diamond_black' height=34 width=42/><color=#1A6951>" + str + "</c>";
                }
            }
            this.buttonLable.string = "<color=#ffffff>报 名</color>";
        }
        if(matchDes && matchDes.ranks) {
            this.winner_reward.string = matchDes.ranks[0].desc;
            this.winner2_reward.string = matchDes.ranks[1].desc;
            this.winner3_reward.string = matchDes.ranks[2].desc;
        } else {

        }
    },


    onClickClose: function() {
        ty.NotificationCenter.ignoreScope(this);
        this.node.destroy();
    },

    onClickShowRewards: function() {
        var preFabPath = "prefabs/ddz_window_match_rewards";
        var  comName = "ddz_window_match_rewards";
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            //var window = preFabNode.getComponent(comName);
            //window.parentScene = that;
            //var tips = desc;
            //window.setTitleContentAndButtons("提示",tips, testArray);
        });
    },

    onClickMatchEnter: function() {
        ddz.matchModel.currentGameMode = "arena";
        hall.LOGD("onClickMatchEnter","test001");

        var waitInfo = ddz.matchModel.getCurWaitInfo();
        if (waitInfo && waitInfo.matchId == 6789){
            ddz.MsgFactory.saveMatch();
        } else {
            this.doMatchItemClick();
        }
    },

    onSaveMatch:function () {
        this.doMatchItemClick();
    },

    doMatchItemClick:function () {
        if(this.matchData && this.matchData.isRecordExist()) {
            //继续
            ddz.matchModel.matchResume(this.matchData.roomId, this.matchData.matchId);
        } else {
            ddz.matchModel.matchSignin(this.matchData.roomId, this.matchData.matchId, this.feeIndex);
        }
    },

    onDestroy: function() {
        ty.NotificationCenter.trigger(ddz.EventType.RESET_MATCH_CLICK_STATE);
        ty.NotificationCenter.ignoreScope(this);
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
