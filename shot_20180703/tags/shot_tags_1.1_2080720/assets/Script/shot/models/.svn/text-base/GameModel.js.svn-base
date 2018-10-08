
shot.gameModel = {
    IS_NEW_USER : "IS_NEW_USER",
    IS_NEW_CRAZY : "IS_NEW_CRAZY",
    DEBUG_MODE : "DEBUG_MODE",

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
                "score": shot.GameWorld.totalScore,
                "itemId": "item:1373",
                "propertyName": "fhk"
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
                "propertyName": type,
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
            "cmd": shot.EventType.HALL_SHARE2,
            "params": {
                "action": 'get_reward',
                "gameId": ty.SystemInfo.gameId,
                "pointId": sharePoint || 10600000
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
                    shot.gameModel.assetsCounts = value.result.assetsCounts;
                    // ty.NotificationCenter.trigger(shot.EventType.UPDATE_ASSETS_COUNT,value.result);
                }
                break;
            }
            case "get_user_info" : {
                if(value.result){
                    ty.NotificationCenter.trigger(shot.EventType.UPDATE_USERINFO,value.result);
                }
                break;
            }
            // case "query_mutual_invite_assets" : {
            //     // {"cmd":"game","result":{"gameId":98,"action":"query_mutual_invite_assets","assetsCounts":0}}
            //     if(value.result){
            //         shot.gameModel.assetsCounts = value.result.assetsCounts;
            //         ty.NotificationCenter.trigger(shot.EventType.UPDATE_ASSETS_COUNT,value.result);
            //     }
            //     break;
            // }
            case "bind_mutual_inviter_id" : {
                if(value.result.success == 1){
                    shot.GlobalFuncs.showDiamondGift(1,value.result);
                }
                break;
            }
            case "consume_assets" : {
                // {"cmd":"game","result":{"action":"consume_assets","gameId":98,"userId":10184,"success":0}}
                if(value.result){
                    ty.NotificationCenter.trigger(shot.EventType.RESURGENCE_RESULT,value.result);
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
                    }
                }
                break;
            }
            case "get_unique_box_id" : {
                if(value.result){
                    shot.GlobalFuncs.showPropBox(value.result);
                }
                break;
            }
            case "get_box_reward" : {
                if (value.result.rewardMsg) {
                    var _rewardMsg = value.result.rewardMsg;
                    if(_rewardMsg.indexOf("无限子弹") > 0){
                        shot.GlobalFuncs.playGetPropBoxAni(0)
                    }else if (_rewardMsg.indexOf("激光") > 0){
                        shot.GlobalFuncs.playGetPropBoxAni(1)
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
        shot.GameWorld.bottleConfig = value.bottleConfig;
        shot.GameWorld.propertyConfig = value.propertyConfig;
        shot.GameWorld.rotationTimeConfig = value.rotationTimeConfig;
        shot.GameWorld.scoreLevelConfig = value.scoreLevelConfig;
        shot.GameWorld.bulletAddConfig = value.bulletAddConfig;
        if(value.toolUserTimeConfig){
            shot.GameWorld.toolUserTimeConfig = value.toolUserTimeConfig;
        }
        if(value.bulletConfig){
            shot.GameWorld.bulletConfig = value.bulletConfig;
        }
        if(value.treasureConfig){
            shot.GameWorld.treasureConfig = value.treasureConfig;
        }
        if(value.crazyMomentConfig){
            shot.GameWorld.crazyMomentConfig = value.crazyMomentConfig;
        }
    },
    saveShareConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        shot.GameWorld.shareConfig = value;
    },
    saveGunnerShareSchemeJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        if(value.allCheckVersion){
            ty.SystemInfo.isCheckVersion = value.allCheckVersion == ty.SystemInfo.version;
        }
        shot.GameWorld.gunnerShareSchemeConfig = value;
        if(ty.SystemInfo.isCheckVersion){
            shot.GameWorld.gunnerShareSchemeConfig.resurgenceShare = value.allCheckConfig;
            shot.GameWorld.gunnerShareSchemeConfig.boxShareGetProp = value.allCheckConfig;
            shot.GameWorld.gunnerShareSchemeConfig.giftBagShareGetDiamond = value.allCheckConfig;
        }
    },
    getAllCheckConfig :function () {
        return ty.SystemInfo.isCheckVersion && (!shot.GameWorld.gunnerShareSchemeConfig || !shot.GameWorld.gunnerShareSchemeConfig.allCheckConfig);
    },
    saveScoreResult : function (result) {
        shot.Share.shareKeywordReplace.mysteryGiftBagBoxId = result.boxId;
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
    //     shot.GameWorld.shareConfig = value;
    // }
};