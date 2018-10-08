// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

ddz.gameModel = {
    LAST_GETDAYREWARD_TIME :"LAST_GETDAYREWARD_TIME",
    ONSHOW_PARAMS : "ONSHOW_PARAMS",
    DEBUG_MODE : "DEBUG_MODE",

    _matchRecords : null,
    shareConfig : null,
    matchingMassage : null,

    notifyInfo:{},
    inviteConfig : [],
    inviteShowList : [],
    inviteNewShowList : [],
    allCount : 0,
    dayLoginCount : 0,
    /**
     * 获取比赛列表
     */
    getMatchList:function () {
        // var pars = {
        //     "cmd": "game",
        //     "params": {
        //         "action": "async_upgrade_hero_match",
        //         "gameId": 6
        //     }
        // };

        // hall.MsgFactory._sendCmd(pars);
    },
    // /**
    //  * 获取排行榜列表
    //  */
    // getRankList:function () {
    //     var pars = {
    //         "cmd": ddz.EventType.CMD_CUSTOM_RANK,
    //         "params": {
    //             "action": "query",
    //             "rankKey": "hero_match_success_rank",
    //         }
    //     };
    //
    //     hall.MsgFactory._sendCmd(pars);
    //  },
    /**
     * 领取推荐奖励
     */
    getInviteReward:function (inviteeId) {
        if(!inviteeId){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_invite_reward",
                "gameId": 6,//9999
                "inviteeId": inviteeId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 领取推荐新人奖励
     */
    getNewInviteReward:function (inviteeId) {
        if(!inviteeId){
            return;
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_new_invite_reward",
                "gameId": 6,//9999
                "rewardState": inviteeId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 领取每日登录奖励
     */
    getDayLoginReward:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": ddz.EventType.DAY_LOGIN_REWARD,
                "gameId": 6 //9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 分享得钻石
     * @param sharePoint 分享点
     */
    shareToGetreward:function (sharePoint) {
        var pars = {
            "cmd": ddz.EventType.HALL_SHARE2,
            "params": {
                "action": ddz.EventType.GET_REWARD,
                "gameId": ddz.GameId,//9999
                // "pointId": 67890000
                "pointId": sharePoint || 67890000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 检查分享点是否有
     * @param sharePoint 分享点
     */
    checkShareReward:function (sharePoint) {
        var pars = {
            "cmd": ddz.EventType.HALL_SHARE2,
            "params": {
                "action": ddz.EventType.CHECK_REWARD,
                "gameId": ddz.GameId,
                // "pointId": 67890000
                "pointId": sharePoint || 67890000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 提现
     */
    getCashReward:function (cash) {
        var pars = {
            "cmd": ddz.EventType.CMD_CASH,
            "params": {
                "action": "get_cash",
                "gameId": 6,//9999
                "value": cash,
                "wxappId":ty.SystemInfo.wxAppId
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

      /**
     * 绑定邀请人
     */
    bindInviteCode:function (inviteCode) {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "bind_invite_code",
                "gameId": 6,//9999
                "inviteCode": inviteCode
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 绑定新人邀请人
     */
    bindNewInviteCode:function (inviteCode) {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "bind_new_invite_code",
                "gameId": 6,//9999
                "inviteCode": inviteCode
            }
        };

        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 查询邀请奖励
     */
    queryInviteInfo:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_invite_info",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 查询邀请新人奖励
     */
    queryNewInviteInfo:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_new_invite_info",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 查询邀请奖励配置
     */
    queryInviteConfig:function () {
        var pars = {
            "cmd": "game",
            "params": {
                "action": "query_invite_config",
                "gameId": 6//9999
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    //获取公告信息UPDATE_COMMON_CONFIG
    getCommonConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'notifys'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取分享配置信息
    getShareCommonConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'shareConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取匹配界面Tips配置信息
    getMatchingMassageConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'matchingMassage'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取结算界面输赢分享奖励赔偿
    getWinLoseShareReward:function(isWin) {
        var params = {
            "cmd":ddz.EventType.CMD_DIZHU,
            "params":{
                "gameId": 6,
                "action": "winLoseShareReward",
                "winOrLose": isWin
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // 拉取老用户能否获取奖励
    getOldUserChipReward:function() {
        var params = {
            "cmd":ddz.EventType.CMD_DIZHU,
            "params":{
                "gameId": ty.SystemInfo.gameId,
                "action": "get_old_user_chip_reward"
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    parseGame:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case ddz.EventType.ACTION_RECORDS : {
                // this.parseMatchList(value.result);
                this.parseMatchRecord(value.result);
                break;
            }
            case "query_invite_info" : {
                this.updateRewardMassage(value);
                break;
            }
            case "query_new_invite_info" : {
                this.updateNewRewardMassage(value);
                break;
            }
            case "get_invite_reward" : {
                break;
            }
            case "get_new_invite_reward" : {
                break;
            }
            case "query_invite_config" : {
                this.parseQueryInviteConfig(value.result);
                break;
            }
            case "common_config" : {
                this.parseCommonConfig(value.result);
                break;
            }
            case "day_login_reward" : {
                this.parseDayLoginReward(value.result);
            }
        }
    },

    parseMatchRecord:function (result) {
        // var result = {
        //     "cmd":"game",
        //     "result":{
        //         "action":"async_upgrade_hero_match",
        //         "gameId":6,
        //         "userId":10014,
        //         "clientId":"H5_5.1_weixin.weixin.0-hall6.weixin.rich",
        //         "matches":[
        //             {
        //                 "roomId":6789,
        //                 "playMode":"123",
        //                 "name":"百万英雄闯关赛",
        //                 "type":"async_upgrade_hero_match",
        //                 "records":[
        //                     {
        //                         "stageIndex":2,
        //                         "state":2,
        //                         "gameFlow":null,
        //                         "enterTime":1523788615,
        //                         "isSave":true,
        //                         "roomId":67891000
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // };

        this._matchRecords = null;
        if (result.matches && result.matches.length > 0){
            var records = result.matches[0].records;
            if (records && records.length > 0){
                this._matchRecords = records;
            }
        }

        hall.LOGE("==","==========ddz.friendModel.isEnterTable========="+ddz.friendModel.isEnterTable+"==="+ty.UserInfo.loc);
        if(ddz.friendModel.isEnterTable){
            if(this._matchRecords){
                ddz.MsgFactory.resumeMatch();
            }else{
                if(ty.UserInfo.loc == '0.0.0.0'){
                    ddz.friendModel.enterFTTable(ddz.Share.shareKeywordReplace.inviteFriendID);
                }else {

                }
            }
        }
        var _stageIndex = 0;
        if (this._matchRecords && this._matchRecords[0].stageIndex){
            _stageIndex = this._matchRecords[0].stageIndex;
        }
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_MATCH_RECORD,_stageIndex);
    },
    parseDayLoginReward : function (result) {
        ty.NotificationCenter.trigger(ddz.EventType.DAY_LOGIN_REWARD,result);
    },
    updateRewardMassage : function (result) {
        var resultMap;
        if(result){
            resultMap = result.result;
        }
        var showList = [];
        var giveCount = 0;
        var allCount = 0;
        var inviteeList = resultMap.inviteeList;
        if(!inviteeList){
            inviteeList = [];
        }
        var mixGiveCount = ddz.gameModel.inviteConfig.length;
        var nowCount = resultMap.inviteeList.length > mixGiveCount ? mixGiveCount : resultMap.inviteeList.length;
        for (var i = 0 ; i < 10 ; i ++){
            giveCount = parseInt(ddz.gameModel.inviteConfig[i]);
            if(i < inviteeList.length){
                inviteeList[i].bindRewardCount = giveCount;
                if(inviteeList[i].rewardState == 1){
                    allCount += giveCount;
                }
                inviteeList[i].count = i +1;
                inviteeList[i].nowCount = nowCount > i +1 ? i+1 : nowCount;
                showList.push(inviteeList[i]);
            }else {
                showList.push({pic:"",rewardState:0,count:i + 1,userId:0,name:"玩家",nowCount:nowCount,bindRewardCount:giveCount});
            }
        }
        var loginCount = ddz.GlobalFuncs.setDayLoginRewardCount();
        this.allCount = allCount + loginCount;
        this.inviteShowList = showList;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_MASSAGE);
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT);
    },
    updateNewRewardMassage : function (result) {
        var resultMap;
        if(result){
            resultMap = result.result;
        }
        var rewardState = resultMap.rewardState;
        if(!rewardState){
            rewardState = [];
        }
        var rewardsByIndex = resultMap.rewardConfig;
        var showList = [];
        if(!rewardsByIndex){
            rewardsByIndex = [];
        }
        for (var i = 0 ; i < rewardsByIndex.length ; i ++){
            var reward = {};
            reward.bindRewardCount = rewardsByIndex[i].count;
            reward.inviteedCode = rewardsByIndex[i].getCode;
            reward.count = rewardsByIndex[i].inviteNum;
            reward.nowCount = reward.count > resultMap.totalNum ? resultMap.totalNum : reward.count;
            if(!rewardsByIndex[i] || !rewardsByIndex[i].getCode || !rewardState[rewardsByIndex[i].getCode]){
                reward.rewardState = 0;
            }else {
                reward.rewardState = rewardState[rewardsByIndex[i].getCode];
            }
            showList.push(reward);
        }
        this.inviteNewShowList = showList;
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_NEW_REWARD_MASSAGE);
    },
    parseQueryInviteConfig : function (value) {
        ddz.gameModel.queryInviteInfo();
        this.inviteConfig = [1,1,1,1,1,2,2,2,2,2];
        if(value && value.rewards && value.rewards.rewardsByIndex){
            this.inviteConfig = value.rewards.rewardsByIndex;
        }
        hall.LOGD(this._TAG, "parseQueryInviteConfig-------------------------"+ JSON.stringify(this.inviteConfig));
    },

    // 解析透传参数数据
    parseCommonConfig:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.configKey){
            case "notifys" : {
                this.notifyInfo = value;
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,value);
                break;
            }
            case "shareConfig" : {
                this.saveShareConfig(value.config);
                // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,value);
                break;
            }
            case "matchingMassage" : {
                this.saveMatchingMassageConfig(value.config);
                // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,value);
                break;
            }
        }
    },

    saveShareConfig : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.shareConfig = value;
    },

    saveMatchingMassageConfig : function (value) {
        if(!value || !value.length || value.length < 1){
            return;
        }
        this.matchingMassage = value;
    },
    getShareConfig :function() {
        return this.shareConfig;
    },

    parseWinLoseShareReward : function (result) {
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_WINLOSESHAREREWARD,result);
    },

    getCurMatchRecords:function () {
        return this._matchRecords;
    }
};