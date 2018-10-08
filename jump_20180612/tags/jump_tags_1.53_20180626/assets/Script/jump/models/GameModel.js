
jump.gameModel = {
    SHARE_MOMENTS_NUMBER : "SHARE_MOMENTS_NUMBER",
    DEBUG_MODE : "DEBUG_MODE",
    GET_IS_NEW_USER : "GET_IS_NEW_USER",

    //调试
    shouldGameOver : false,//直接游戏结束(调试用)
    initScore : 0,//初始分值(debug模式使用)
    //游戏状态
    isOnAnimation : false,//是否处于动画状态,动画状态不减速
    isGameOver : false,//是否处于游戏结束状态
    isPause : false,//游戏暂停

    pedalVerSpeed : 0,//踏板纵向移动速度
    nowPedalList : {},//当前游戏阶段的游戏配置信息
    totalScore : 0,//总分
    scoreSub : 1,

    resurgenceCount : 1,//可复活次数
    assetsCounts : 0,//当前钻石数量
    pedalWidth : 124,
    pedalGapWidth : 0,

    //配置信息们
    shareConfig : null,
    shareMoments : null,
    speedConfig : null,
    toolList: null,
    pedalList: null,
    resurgenceConfig : null,

    //好友排行速度
    game_friendData : null,

    //弹窗
    rankWindow : null,

    //保存用户当前最高分
    saveHigherScore: function(score) {
        if(!score){
            return;
        }
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
        if(!inviteId){
            return;
        }
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

    //获取复活配置信息
    getResurgenceConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'resurgenceConfig'
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
            case "resurgenceConfig": {
                this.saveResurgenceConfig(value.config);
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
    saveShareConfigFromHttp : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        //要进行处理,因为少了分享点和群验证标识
        var shareExt = value['shareExt'];
        delete value['shareExt'];

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
        this.shareConfig = value;
    },
    saveResurgenceConfig : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        this.resurgenceConfig = value;
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
        this.speedConfig.verticalInitialSpeedFirst = this.speedConfig.verticalInitialSpeedFirst*windowHeight/1136;
        this.speedConfig.verticalDetectionSection = this.speedConfig.verticalDetectionSection*windowHeight/1136;
        this.speedConfig.roleTopY = this.speedConfig.roleTopY*windowHeight/1136;
        this.speedConfig.minDisablePedalGap = this.speedConfig.minDisablePedalGap*windowHeight/1136;

        this.toolList = value.toolList;
        this.pedalList = value.pedalList;
    },

    getShareConfig :function() {
        return this.shareConfig;
    },
    getPedalList : function () {
        return jump.gameModel.pedalList || jump.Share.pedalList;
    },
    //获取当前猪脚的横向移动系数
    getNowHorizontalVelocityCoefficient : function () {
        if(jump.gameModel.nowPedalList.roleHorizontalVelocityCoefficient){
            return jump.gameModel.nowPedalList.roleHorizontalVelocityCoefficient;
        }
        var speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;
        return speedConfig.horizontalVelocityCoefficient;
    },
    getRoleVerticalInitialSpeed : function () {
        var speed ;
        if(jump.gameModel.nowPedalList.roleVerticalInitialSpeed){
            speed = jump.gameModel.nowPedalList.roleVerticalInitialSpeed;
        }else {
            var speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;
            speed = speedConfig.verticalInitialSpeed;
        }
        var winSize = cc.director.getWinSize();
        var windowHeight = winSize.height;
        return speed*windowHeight/1136;
    },
    getRoleVerticalAcceleratedSpeed : function () {
        var speed ;
        if(jump.gameModel.nowPedalList.roleVerticalAcceleratedSpeed){
            speed = jump.gameModel.nowPedalList.roleVerticalAcceleratedSpeed;
        }else {
            var speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;
            speed = speedConfig.verticalAcceleratedSpeed;
        }
        var winSize = cc.director.getWinSize();
        var windowHeight = winSize.height;
        return speed*windowHeight/1136;
    }
};