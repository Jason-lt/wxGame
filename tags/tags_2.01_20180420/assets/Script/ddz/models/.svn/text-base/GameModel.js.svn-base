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
    _matchRecords : null,
    shareConfig : null,
    notifyInfo:{},
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
                "inviteeId": inviteeId,
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },
    /**
     * 分享得钻石
     */
    shareToGetreward:function (sharePoint) {
        var pars = {
            "cmd": "hall_share2",
            "params": {
                "action": "get_reward",
                "gameId": 6,//9999
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
                "inviteCode": inviteCode,
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
                "gameId": 6,//9999
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


    parseGame:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case ddz.EventType.ACTION_RECORDS : {
                // this.parseMatchList(value.result);
                this.parseMatchRecord(value.result);
                break;
            }
            case "query_invite_info" : {
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_MASSAGE,value);
                break;
            }
            case "common_config" : {
                this.parseCommonConfig(value.result);
                break;
            }
        }
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
        }
    },

    saveShareConfig : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        // hall.LOGE("save","=======saveShareConfig====="+JSON.stringify(value));
        this.shareConfig = value;
    },
    getShareConfig :function() {
        return this.shareConfig;
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
        ty.NotificationCenter.trigger(ddz.EventType.RECIVE_MATCH_RECORD);
    },

    getCurMatchRecords:function () {
        return this._matchRecords;
    }

};