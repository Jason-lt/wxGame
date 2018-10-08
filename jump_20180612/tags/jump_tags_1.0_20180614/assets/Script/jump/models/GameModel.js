
jump.gameModel = {
    SHARE_MOMENTS_NUMBER : "SHARE_MOMENTS_NUMBER",
    DEBUG_MODE : "DEBUG_MODE",

    pedalVerSpeed : 0,
    movePedalHorizontalSpeed : 0,
    totalScore : 0,
    isOnAnimation : false,
    isGameOver : false,
    resurgenceCount : 1,
    assetsCounts : 0,

    shareConfig : null,
    shareMoments : null,
    speedConfig : null,
    toolList: null,
    pedalList: null,

    game_friendData : null,
    roleInitatialHight : 560,
    pedalWidth : 124,
    pedalGapWidth : 0,
    initScore : 0,

    rankWindow : null,

    //保存用户当前最高分
    saveHigherScore: function(score) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'save_score',
                'gameId' : ty.SystemInfo.gameId,
                "score": score
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //查询钻石剩余
    queryMutualInviteAssets: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'query_mutual_invite_assets',
                'gameId' : ty.SystemInfo.gameId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //绑定邀请人
    bindMutualInviterId: function(inviteId) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'bind_mutual_inviter_id',
                'gameId' : ty.SystemInfo.gameId,
                "inviterId": inviteId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },
    // //查询邀请人是谁
    // queryMutualInviter: function() {
    //     var params = {
    //         'cmd': 'game',
    //         'params': {
    //             'action' : 'query_mutual_inviter',
    //             'gameId' : ty.SystemInfo.gameId
    //         }
    //     };
    //     hall.MsgFactory._sendCmd(params);
    // },

    //扣除资产
    consumeAssets: function(count) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'consume_assets',
                "itemId": "item:1358",
                "count": count,
                'gameId' : ty.SystemInfo.gameId
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

    //获取分享朋友圈配置信息
    getShareMomentsConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'shareMoments'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取布局配置信息
    getGameLayoutConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'gameLayout'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    parseGame:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case "common_config" : {
                this.parseCommonConfig(value.result);
                break;
            }
            case "query_mutual_invite_assets" : {
                // {"cmd":"game","result":{"gameId":98,"action":"query_mutual_invite_assets","assetsCounts":0}}
                if(value.result){
                    jump.gameModel.assetsCounts = value.result.assetsCounts;
                    ty.NotificationCenter.trigger(jump.EventType.UPDATE_ASSETS_COUNT,value.result);
                }
                break;
            }
            case "bind_mutual_inviter_id" : {
                // "result": {
                //     "action": "bind_mutual_inviter_id",
                //         "inviterId": 10002,
                //         "gameId": 98,
                //         "userId": 10001,
                //         "success": 1,    # 1成功，0失败
                //     "name": "慢陀螺",
                //         "pic": "",
                //         "itemId": "item:1358",
                //         "counts": 1
                // }
                // {"cmd":"game","result":{"action":"query_mutual_inviter","gameId":98,"userId":10184,"status":0}}
                // ty.NotificationCenter.trigger(jump.EventType.GET_INVITE_USER_INFO,value.result);
                if(value.result.success == 1){
                    jump.GlobalFuncs.showDiamondGift(1,value.result);
                }
                break;
            }
            case "consume_assets" : {
                // {"cmd":"game","result":{"action":"consume_assets","gameId":98,"userId":10184,"success":0}}
                if(value.result){
                    ty.NotificationCenter.trigger(jump.EventType.RESURGENCE_RESULT,value.result);
                }
                break;
            }
            case "update_assets" : {
                // {
                //     "cmd": "game",
                //     "result": {
                //     "action": "update_assets",
                //         "gameId": 98,
                //         "userId": 10001,
                //         "itemId": "item:1358",
                //         "counts": 1,
                //         "assetsCounts", 2,
                //         "inviteeName": "",
                //         "inviteePic": ""
                // }
                // }
                if(value.result){
                    jump.gameModel.assetsCounts = value.result.assetsCounts;
                    jump.GlobalFuncs.showMainToastWithName(value.result.inviteeName,value.result.counts,value.result.inviteePic)
                }
                break;
            }
        }
    },

    // 解析透传参数数据
    parseCommonConfig:function (value) {
        switch (value.configKey){
            case "shareConfig" : {
                this.saveShareConfig(value.config);
                break;
            }
            case "shareMoments": {
                this.saveShareMomentsConfigJson(value.config);
                break;
            }
            case "gameLayout": {
                this.saveGameLayoutConfigJson(value.config);
                break;
            }
        }
    },

    saveShareConfig : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.shareConfig = value.share;
    },
    saveShareMomentsConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.shareMoments = value;
    },
    saveGameLayoutConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.speedConfig = value.speedConfig;

        var winSize = cc.director.getWinSize();
        var windowHeight = winSize.height;
        this.speedConfig.verticalAcceleratedSpeed = this.speedConfig.verticalAcceleratedSpeed*windowHeight/1136;
        this.speedConfig.verticalInitialSpeed = this.speedConfig.verticalInitialSpeed*windowHeight/1136;
        this.speedConfig.pedalVerticalAcceleratedSpeed = this.speedConfig.pedalVerticalAcceleratedSpeed*windowHeight/1136;
        this.speedConfig.verticalDetectionSection = this.speedConfig.verticalDetectionSection*windowHeight/1136;
        this.speedConfig.roleTopY = this.speedConfig.roleTopY*windowHeight/1136;

        this.toolList = value.toolList;
        this.pedalList = value.pedalList;
    },

    getShareConfig :function() {
        return this.shareConfig;
    }
};