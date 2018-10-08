
scratch.gameModel = {
    NEW_USER : "NEW_USER",

    GET_CASH_LIST: "GET_CASH_LIST",
    LAST_WATCH_TIME : "LAST_WATCH_TIME",
    WATCH_TIME_LIST : "WATCH_TIME_LIST",

    scratchCountNow : 0,
    nowCardID : 0,

    haveEx : false,
    //获取配置信息
    getNormalConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'normalConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },
    //获取用户信息
    getUserInfoForScratch: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_user_info',
                'gameId' : ty.SystemInfo.gameId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //提现
    getCashLucky: function (value) {
        var params = {
            'cmd': 'cash',
            'params': {
                'action': 'get_cash_lucky',
                "value": parseInt(value),
                "wxappId":ty.SystemInfo.wxAppId,
                'gameId': ty.SystemInfo.gameId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //领取刮刮乐奖励
    getLuckyReward: function(cardId) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_lucky_reward',
                'gameId' : ty.SystemInfo.gameId,
                "cardId": cardId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //领取转盘额外奖励
    getLuckyRewardExt: function(cardId) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_lucky_reward_ext',
                'gameId' : ty.SystemInfo.gameId,
                "cardId": cardId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //兑换商城，获取货架
    getStoreInfo: function() {
        var params = {
            'cmd': 'store_exchange',
            'params': {
                'action' : 'get_shelves',
                'gameId' : 9999
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //兑换商城，获取商品
    getProduct: function(shelvesName) {
        var params = {
            'cmd': 'store_exchange',
            'params': {
                'action' : 'get_product',
                'gameId' : 9999,
                "shelvesName": shelvesName
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //兑换商城，兑换商品
    exchangeProduct: function(exchangeId,phoneNumber) {
        var params = {
            'cmd': 'store_exchange',
            'params': {
                'action': 'exchange',
                'gameId': 9999,
                'exchangeId':exchangeId,
                'exchangeCount':1,
                'exchangeParams':{'phoneNumber':phoneNumber}
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //绑定邀请
    bindInvite: function(inviterId) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'bind_invite',
                'gameId' : ty.SystemInfo.gameId,
                "inviterId": inviterId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //领取邀请奖励
    queryNewInviteStatus: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'query_new_invite_status',
                'gameId' : ty.SystemInfo.gameId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //领取邀请奖励
    getNewInviteReward: function(rewardCount) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_new_invite_reward',
                'gameId' : ty.SystemInfo.gameId,
                "rewardCount": rewardCount
            }
        };
        hall.MsgFactory._sendCmd(params);
    },



    /**
     * 分享得钻石
     * @param sharePoint 分享点
     */
    shareToGetReward:function (sharePoint) {
        if(!sharePoint || sharePoint == 0){
            return;
        }
        var pars = {
            "cmd": scratch.EventType.HALL_SHARE2,
            "params": {
                "action": 'get_reward',
                "gameId": ty.SystemInfo.gameId,
                "pointId": sharePoint || 10600000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    parseGame:function (value) {
        // hall.LOGD(this._TAG, "onGame Scratch_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case "common_config" : {
                this.parseCommonConfig(value);
                break;
            }
            case "get_user_info" : {
                this.parseUserInfoForScratch(value);
                break;
            }
            // case "get_cash_lucky" : {
            //     ty.NotificationCenter.trigger(scratch.EventType.GET_LUCKY_CASH_INFO,value);
            //     break;
            // }
            case "get_lucky_reward" : {
                if(scratch.gameModel.haveEx){
                    ty.NotificationCenter.trigger(scratch.EventType.GET_REWARD_RESULT,value.result);
                    // scratch.gameModel.getLuckyRewardExt(value.result.cardId);
                }else {
                    scratch.GlobalFuncs.showWinTips(false,value.result);
                }
                break;
            }
            case "get_lucky_reward_ext" : {
                scratch.GlobalFuncs.showWinTips(false,value.result);
                break;
            }
            case "bind_invite" : {
                break;
            }
            case "query_new_invite_status" : {
                this.parseQueryNewInviteStatus(value);
                break;
            }
            case "update_inviter_status" : {
                this.parseQueryNewInviteStatus(value);
                break;
            }
            case "get_new_invite_reward" : {
                scratch.GlobalFuncs.showWinTips(true,value.result);
                break;
            }
            default : break;
        }
    },

    parseCash : function (value) {
        switch (value.result.action){
            case "get_cash_lucky" : {
                ty.NotificationCenter.trigger(scratch.EventType.GET_LUCKY_CASH_INFO,value.result);
                break;
            }
            default : break;
        }
    },
    parseStoreExchange : function (value) {
        switch (value.result.action){
            case "get_shelves" : {
                if(value.result.list[0]){
                    scratch.gameModel.getProduct(value.result.list[0].name);
                }
                break;
            }
            case "get_product" : {
                this.parseStoreProductList(value.result);
                break;
            }
            case "exchange" : {
                ty.NotificationCenter.trigger(scratch.EventType.GET_EXCHANGE_INFO,value.result);
                break;
            }
            default : break;
        }
    },
    parseStoreProductList : function (result) {
        scratch.GameWorld.productList = result.list;
        ty.NotificationCenter.trigger(scratch.EventType.GET_STORE_PRODUCT_LIST);
    },
    // // 解析透传参数数据
    parseCommonConfig:function (value) {
        switch (value.result.configKey){
            case "normalConfig": {
                // scratch.GameWorld.normalConfig.showCardList = value.result.config.showCardList;
                scratch.GameWorld.normalConfig = value.result.config;
                ty.NotificationCenter.trigger(scratch.EventType.GET_USER_CARD_INFO);
                ty.SystemInfo.isCheckVersion = scratch.GameWorld.normalConfig.illegalConfig.checkVersion == ty.SystemInfo.version && !scratch.GameWorld.normalConfig.illegalConfig.checkState;
                break;
            }
        }
    },

    parseUserInfoForScratch : function (value) {

        scratch.gameModel.getStoreInfo();

        if(value.result){
            scratch.GameWorld.cardListInfo = value.result.cards;
        }
        // ty.NotificationCenter.trigger(scratch.EventType.GET_USER_CARD_INFO);
        hall.ME.parseUserInfoForScratch(value);
    },

    parseQueryNewInviteStatus : function (value) {
        if(value.result){
            scratch.GameWorld.getRewardCount = value.result.getRewardCount;
            scratch.GameWorld.rewards = value.result.rewards;
            scratch.GameWorld.currInviteNum = value.result.currInviteNum;
            scratch.GameWorld.todayInvite = value.result.todayInvite;
            // scratch.GameWorld.maxInviteNum = value.result.maxInviteNum;

            ty.NotificationCenter.trigger(scratch.EventType.GET_INVITE_STATUS);
        }
    },

    // saveShareConfigJson : function (value) {
    //     if (hall.GlobalFuncs.isEmptyObject(value)){
    //         return;
    //     }
    //     scratch.GameWorld.shareConfig = value;
    // }
    //
    // getAllCheckConfig :function () {
    //     return ty.SystemInfo.isCheckVersion && (!scratch.GameWorld.gunnerShareSchemeConfig || !scratch.GameWorld.gunnerShareSchemeConfig.allCheckConfig);
    // },

    saveShareConfigFromHttp : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }

        //要进行处理,因为少了分享点和群验证标识
        var shareExt = value['shareExt'];
        delete value['shareExt'];

        if(shareExt){
            var shareCfg, extCfg;
            for (var shareKey in value){
                shareCfg = value[shareKey];
                extCfg = shareExt[shareKey];
                if (extCfg){
                    for (var subKey in extCfg){
                        shareCfg[subKey] = extCfg[subKey]; //把扩展属性,添加到主配置上
                    }
                }
            }
        }

        this.shareConfig = value;
        scratch.GameWorld.shareConfig = value;
    }
};