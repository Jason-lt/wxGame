
snipe.gameModel = {
    IS_NEW_USER : "IS_NEW_USER",
    IS_NEW_CRAZY : "IS_NEW_CRAZY",
    LAST_VIDEO_DAY : "LAST_VIDEO_DAY",
    DAY_VIDEO_TIME : "DAY_VIDEO_TIME",
    OPEN_BOX_CLOSE_DAY : "OPEN_BOX_CLOSE_DAY",
    OPEN_BOX_CLOSE_TIME : "OPEN_BOX_CLOSE_TIME",
    OPEN_BOX_CLOSE_STATE : "OPEN_BOX_CLOSE_STATE",
    OPEN_BOX_CLOSE_TIME_CHECK : "OPEN_BOX_CLOSE_TIME_CHECK",
    OPEN_BOX_CLOSE_STATE_CHECK : "OPEN_BOX_CLOSE_STATE_CHECK",
    DEBUG_MODE : "DEBUG_MODE",

    OPEN_ADBTN_STATE_TODAY : 'OPEN_ADBTN_STATE_TODAY',
    OPEN_ADBTN_COUNT_TODAY : 'OPEN_ADBTN_COUNT_TODAY',
    OPEN_ADBTN_TYPE_TODAY : 'OPEN_ADBTN_TYPE_TODAY',
    // OPEN_ADBTN_HIDE_TYPE_TODAY : 'OPEN_ADBTN_HIDE_TYPE_TODAY',
    OPEN_ADBTN_STATE_HOUR : 'OPEN_ADBTN_STATE_HOUR',

    rankWindow : null,
    totalScore : 0,
    //获取布局配置信息
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
    //获取布局配置信息
    getShareConfig: function() {
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

    //获取分享方式
    getGunnerShareSchemeConfig: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'common_config',
                'gameId' : ty.SystemInfo.gameId,
                'configKey' : 'gunnerShareScheme'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //存结算分数
    saveScore: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'save_score',
                'gameId' : ty.SystemInfo.gameId,
                "score": snipe.GameWorld.totalScore,
                "itemId": "item:1373",
                "propertyName": "fhk"
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //存结算分数
    saveLevelScore: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'save_level_score',
                'gameId' : ty.SystemInfo.gameId,
                "score": snipe.GameWorld.totalScore
            }
        };
        hall.MsgFactory._sendCmd(params);
    },
    //获取用户信息
    getUserInfoForShot: function() {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_user_info',
                'gameId' : ty.SystemInfo.gameId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //扣除资产
    consumeAssets: function (count,item) {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'consume_assets',
                "itemId": item,
                "count": count,
                'gameId': ty.SystemInfo.gameId
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

    // 打开道具
    getUniqueBoxId: function(itemId,type) {
        var params = {
            'cmd': 'game',
            'params': {
                'action' : 'get_unique_box_id',
                'gameId' : ty.SystemInfo.gameId,
                "itemId": itemId,
                "propertyName": type
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 获取宝箱奖励
     */
    getBoxReward:function (boxUserId,boxId,groupId) {
        if (!boxUserId || boxUserId == ""){
            return
        }
        if (!boxId || boxId == ""){
            return
        }
        var pars = {
            "cmd": "game",
            "params": {
                "action": "get_box_reward",
                "gameId": ty.SystemInfo.gameId,
                "boxUserId": boxUserId,
                "boxId": boxId
            }
        };

        if (groupId) {
            pars.params.groupId = groupId;
        }
        hall.MsgFactory._sendCmd(pars);
    },

    /**
     * 分享得钻石
     * @param sharePoint 分享点
     */
    shareToGetreward:function (sharePoint) {
        if(!sharePoint || sharePoint == 0){
            return;
        }
        var pars = {
            "cmd": snipe.EventType.HALL_SHARE2,
            "params": {
                "action": 'get_reward',
                "gameId": ty.SystemInfo.gameId,
                "pointId": sharePoint || 11000000
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    checkRewardWithSharePoint : function (sharePoint) {
        if(!sharePoint || sharePoint == 0){
            return;
        }
        var pars = {
            "cmd": snipe.EventType.HALL_SHARE2,
            "params": {
                "action": snipe.EventType.CHECK_REWARD,
                "gameId": ty.SystemInfo.gameId,
                "pointId": sharePoint
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    parseGame:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case "common_config" : {
                this.parseCommonConfig(value.result);
                break;
            }
            case "save_score" : {
                this.saveScoreResult(value.result);
                break;
            }
            case "query_mutual_invite_assets" : {
                // {"cmd":"game","result":{"gameId":98,"action":"query_mutual_invite_assets","assetsCounts":0}}
                if(value.result){
                    snipe.gameModel.assetsCounts = value.result.assetsCounts;
                    // ty.NotificationCenter.trigger(snipe.EventType.UPDATE_ASSETS_COUNT,value.result);
                }
                break;
            }
            case "get_user_info" : {
                if(value.result){
                    ty.NotificationCenter.trigger(snipe.EventType.UPDATE_USERINFO,value.result);
                }
                break;
            }
            // case "query_mutual_invite_assets" : {
            //     // {"cmd":"game","result":{"gameId":98,"action":"query_mutual_invite_assets","assetsCounts":0}}
            //     if(value.result){
            //         snipe.gameModel.assetsCounts = value.result.assetsCounts;
            //         ty.NotificationCenter.trigger(snipe.EventType.UPDATE_ASSETS_COUNT,value.result);
            //     }
            //     break;
            // }
            case "bind_mutual_inviter_id" : {
                if(value.result.success == 1){
                    snipe.GlobalFuncs.showDiamondGift(1,value.result);
                }
                break;
            }
            case "consume_assets" : {
                // {"cmd":"game","result":{"action":"consume_assets","gameId":98,"userId":10184,"success":0}}
                if(value.result){
                    ty.NotificationCenter.trigger(snipe.EventType.RESURGENCE_RESULT,value.result);
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
                    if (value.result.itemId && value.result.itemId == "item:1371"){
                        hall.MsgBoxManager.showToast({title:'成功获得1个无限子弹道具'});
                    }else if (value.result.itemId && value.result.itemId == "item:1372"){
                        hall.MsgBoxManager.showToast({title:'成功获得1个瞄准器道具'});
                    }else if (value.result.itemId && value.result.itemId == "item:1373"){
                        hall.MsgBoxManager.showToast({title:'成功获得1颗钻石'});
                    }else if (value.result.itemId && value.result.itemId == "item:1390"){
                        hall.MsgBoxManager.showToast({title:'成功获得1个手榴弹道具'});
                    }
                }
                break;
            }
            case "get_unique_box_id" : {
                if(value.result){
                    snipe.GlobalFuncs.showPropBox(value.result);
                }
                break;
            }
            case "get_box_reward" : {
                if (value.result.rewardMsg) {
                    var _rewardMsg = value.result.rewardMsg;
                    if(_rewardMsg.indexOf("无限子弹") > 0){
                        snipe.GlobalFuncs.playGetPropBoxAni(0)
                    }else if (_rewardMsg.indexOf("激光") > 0){
                        snipe.GlobalFuncs.playGetPropBoxAni(1)
                    }else if (_rewardMsg.indexOf("手榴弹") > 0){
                        snipe.GlobalFuncs.playGetPropBoxAni(2)
                    }else{
                        hall.MsgBoxManager.showToast({title:_rewardMsg});
                    }
                }
                break;
            }
        }
    },

    // 解析透传参数数据
    parseCommonConfig:function (value) {
        switch (value.configKey){
            case "normalConfig": {
                this.saveNormalConfigJson(value.config);
                break;
            }
            case "shareConfig": {
                this.saveShareConfigJson(value.config);
                break;
            }
            case "gunnerShareScheme": {
                this.saveGunnerShareSchemeJson(value.config);
                break;
            }
        }
    },
    saveNormalConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        snipe.GameWorld.bottleConfig = value.bottleConfig;
        snipe.GameWorld.propertyConfig = value.propertyConfig;
        snipe.GameWorld.rotationTimeConfig = value.rotationTimeConfig;
        snipe.GameWorld.scoreLevelConfig = value.scoreLevelConfig;
        snipe.GameWorld.bulletAddConfig = value.bulletAddConfig;
        if(value.toolUserTimeConfig){
            snipe.GameWorld.toolUserTimeConfig = value.toolUserTimeConfig;
        }
        if(value.bulletConfig){
            snipe.GameWorld.bulletConfig = value.bulletConfig;
        }
        if(value.treasureConfig){
            snipe.GameWorld.treasureConfig = value.treasureConfig;
        }
        if(value.crazyMomentConfig){
            snipe.GameWorld.crazyMomentConfig = value.crazyMomentConfig;
        }
        if(value.jugglingSchemaConfig){
            snipe.GameWorld.jugglingSchemaConfig = value.jugglingSchemaConfig;
        }
        if(value.tishenJugglingLevelConfig){
            snipe.GameWorld.tishenJugglingLevelConfig = value.tishenJugglingLevelConfig;
        }
        if(value.growthConfig){
            snipe.GameWorld.growthConfig = value.growthConfig;
        }
        ty.NotificationCenter.trigger(snipe.EventType.GUNNER_SHARE_SCHEME);
    },
    saveShareConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        snipe.GameWorld.shareConfig = value;
    },
    saveGunnerShareSchemeJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        if(value.allCheckVersion){
            ty.SystemInfo.isCheckVersion = value.allCheckVersion == ty.SystemInfo.version;
        }
        snipe.GameWorld.gunnerShareSchemeConfig = value;
        if(ty.SystemInfo.isCheckVersion){
            snipe.GameWorld.gunnerShareSchemeConfig.resurgenceShare = value.allCheckConfig;
            snipe.GameWorld.gunnerShareSchemeConfig.boxShareGetProp = value.allCheckConfig;
            snipe.GameWorld.gunnerShareSchemeConfig.giftBagShareGetDiamond = value.allCheckConfig;
        }
        ty.NotificationCenter.trigger(snipe.EventType.GUNNER_SHARE_SCHEME);
        ty.NotificationCenter.trigger(ty.EventType.GET_AD_MSG_SUCCESS);
    },
    getAllCheckConfig :function () {
        return ty.SystemInfo.isCheckVersion && (!snipe.GameWorld.gunnerShareSchemeConfig || !snipe.GameWorld.gunnerShareSchemeConfig.allCheckConfig);
    },
    saveScoreResult : function (result) {
        snipe.Share.shareKeywordReplace.mysteryGiftBagBoxId = result.boxId;
    }
    // saveShareConfigFromHttp : function (value) {
    //     if (hall.GlobalFuncs.isEmptyObject(value)){
    //         return;
    //     }
    //
    //     //要进行处理,因为少了分享点和群验证标识
    //     var shareExt = value['shareExt'];
    //     delete value['shareExt'];
    //
    //     if(shareExt){
    //         var shareCfg, extCfg;
    //         for (var shareKey in value){
    //             shareCfg = value[shareKey];
    //             extCfg = shareExt[shareKey];
    //             if (extCfg){
    //                 for (var subKey in extCfg){
    //                     shareCfg[subKey] = extCfg[subKey]; //把扩展属性,添加到主配置上
    //                 }
    //             }
    //         }
    //     }
    //
    //     this.shareConfig = value;
    //     snipe.GameWorld.shareConfig = value;
    // }
};