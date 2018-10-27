/**
 * Created by wangjunpeng on 16/1/20.
 */

hall.MatchData = cc.Class({
    ctor: function() {
        this.fees = null;
        this.playMode = '0';
        this.matchId = '0';
        this.roomId = '0';
        this.matchName = '0';
        this.taskDesc = '0';
        this.onlineCount = 0;
        this.matchType = '0';
        this.record = null;
        this.desInfo = null;
        this.rewardRank = null;
    },

    parseData: function(data) {
        this.fees = data["fees"];
        this.playMode = data["play_mode"];
        this.matchId = data["matchId"];
        this.roomId = data["roomId"];
        this.matchName = data["name"];
        this.taskDesc = data["taskDesc"];
        this.onlineCount = data["onlineCount"];
        this.matchType = data["type"];
        this.record = data["record"];
        this.rewardRank = data["rewardRank"];
    },

    /* demo
     {
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
     */
    //setDesInfo: function(data) {
    //    this.desInfo = data;
    //},

    isRecordExist: function() {
        var ret = false;
        for(var key in this.record) {
            ret = true;
        }
        return this.record && ret;
    }

});

/*
 {
 "fees": [{
 "count": 1,
 "desc": "1\钻\石",
 "itemId": "item:1311",
 "params": {
 "failure": "\您\的\费\用\不\足\，\本\比\赛\报\名\费\需1\钻\石"
 }
 }, {
 "count": 1000,
 "desc": "1000\金\币",
 "itemId": "user:chip",
 "params": {
 "failure": "\您\的\金\币\不\足\，\选\择\其\他\报\名\条\件\或\者\买\个\金\币\礼\包\吧",
 "nextTip": "\您\的\参\赛\券\不\足\啦~\使\用100\金\币\报\名\入\场\吧~\\n(\提\示\：\每\日\登\陆\赠\送20\张\参\赛\券\喔\！)",
 "payOrder": {
 "contains": {
 "count": 1000,
 "itemId": "user:chip"
 },
 "shelves": ["lessbuychip"]
 }
 }
 }],
 "play_mode": "123",
 "min_coin": -1,
 "max_coin": -1,
 "max_table_coin": -1,
 "matchId": 6791,
 "name": "1\元\红\包\赛",
 "taskDesc": "90\人9\轮\赛",
 "onlineCount": 205,
 "roomId": 6790,
 "type": "async_common_arena_match",
 "startTime": 1525420800,
 "stopTime": 1525399200,
 "record": {}
 }, {
 "fees": [{
 "count": 5,
 "desc": "5\钻\石",
 "itemId": "item:1311",
 "params": {
 "failure": "\您\的\费\用\不\足\，\本\比\赛\报\名\费\需5\钻\石"
 }
 }, {
 "count": 5000,
 "desc": "5000\金\币",
 "itemId": "user:chip",
 "params": {
 "failure": "\您\的\金\币\不\足\，\选\择\其\他\报\名\条\件\或\者\买\个\金\币\礼\包\吧",
 "nextTip": "\您\的\参\赛\券\不\足\啦~\使\用5000\金\币\报\名\入\场\吧~\\n(\提\示\：\每\日\登\陆\赠\送20\张\参\赛\券\喔\！)",
 "payOrder": {
 "contains": {
 "count": 5000,
 "itemId": "user:chip"
 },
 "shelves": ["lessbuychip"]
 }
 }
 }],
 "play_mode": "123",
 "min_coin": -1,
 "max_coin": -1,
 "max_table_coin": -1,
 "matchId": 6792,
 "name": "5\元\红\包\赛",
 "taskDesc": "90\人9\轮\赛",
 "onlineCount": 205,
 "roomId": 6790,
 "type": "async_common_arena_match",
 "startTime": 1525420800,
 "stopTime": 1525399200,
 "record": {}
 },

 */

hall.MatchInfo = cc.Class({
    _TAG: "hall.MatchInfo",
    ctor: function() {
        hall.LOGD(this._TAG, "in ctor");
        this.matchArray = {};
        this.matchDesMap = {};
        this.curMatchAddition = null;   //其实是wait信息
    },
    setCurrentMatchId: function(matchId) {
        this.curMatchId = matchId;
    },

    getMatchStageDes: function() {
        var des = "";
        if(this.curMatchAddition && this.curMatchAddition.matchId) {
            var desInfo = this.matchDesMap[this.curMatchAddition.matchId.toString()];
            if(desInfo && desInfo.stages) {
                for(var key in desInfo.stages) {
                    if(desInfo.stages[key].index == this.curMatchAddition.stageIndex) {
                        des = desInfo.stages[key].riseUserCount == 1 ? "决赛" : "前" + desInfo.stages[key].riseUserCount + "晋级";
                        break;
                    }
                }
            }
        }
        return des;
    },

    setCurMatchAdditionInfo: function(additionInfo) {
        if(!this.curMatchAddition) {
            this.curMatchAddition = {
                "matchId":0,
                "roomId":0,
                "stageIndex":0,
                "score":0,
                "rankName":"90/90"
            };
        }
        for (var key in this.curMatchAddition) {
            if(additionInfo[key]) {
                this.curMatchAddition[key] = additionInfo[key];
            }
        }
    },

    getCurrentMatchData: function() {
        if(this.curMatchId)
            return this.matchArray[this.curMatchId.toString()];
        else
            return null;
    },

    addMatchDesInfo: function(desInfo) {
        this.matchDesMap[desInfo.matchId.toString()] = desInfo;
        //if(desInfo && desInfo.matchId && this.matchArray[desInfo.matchId.toString()]) {
        //    this.matchArray[desInfo.matchId.toString()].setDesInfo(desInfo);
        //}
    },

    getMatchDesByMatchId: function(matchId) {
        var matchDes = null;
        matchDes = this.matchDesMap[matchId.toString()];
        return matchDes;
    },

    parseMatchListInfo: function(matchList) {
        this.matchArray = {};
        if (matchList) {
            for(var i=0; i< matchList.length; i++) {
                var match = new hall.MatchData();
                match.parseData(matchList[i]);
                this.matchArray[match.matchId.toString()] = match;
            }
        }
    }

});