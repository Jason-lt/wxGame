(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/shot/models/GameModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '87fe9za18tLxb5fRGuLY/sv', 'GameModel', __filename);
// Script/shot/models/GameModel.js

"use strict";

shot.gameModel = {
    IS_NEW_USER: "IS_NEW_USER",
    IS_NEW_CRAZY: "IS_NEW_CRAZY",
    LAST_VIDEO_DAY: "LAST_VIDEO_DAY",
    DAY_VIDEO_TIME: "DAY_VIDEO_TIME",
    OPEN_BOX_CLOSE_DAY: "OPEN_BOX_CLOSE_DAY",
    OPEN_BOX_CLOSE_TIME: "OPEN_BOX_CLOSE_TIME",
    OPEN_BOX_CLOSE_STATE: "OPEN_BOX_CLOSE_STATE",
    OPEN_BOX_CLOSE_TIME_CHECK: "OPEN_BOX_CLOSE_TIME_CHECK",
    OPEN_BOX_CLOSE_STATE_CHECK: "OPEN_BOX_CLOSE_STATE_CHECK",
    DEBUG_MODE: "DEBUG_MODE",

    rankWindow: null,
    totalScore: 0,
    //获取布局配置信息
    getNormalConfig: function getNormalConfig() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'common_config',
                'gameId': ty.SystemInfo.gameId,
                'configKey': 'normalConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },
    //获取布局配置信息
    getShareConfig: function getShareConfig() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'common_config',
                'gameId': ty.SystemInfo.gameId,
                'configKey': 'shareConfig'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //获取分享方式
    getGunnerShareSchemeConfig: function getGunnerShareSchemeConfig() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'common_config',
                'gameId': ty.SystemInfo.gameId,
                'configKey': 'gunnerShareScheme'
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //存结算分数
    saveScore: function saveScore() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'save_score',
                'gameId': ty.SystemInfo.gameId,
                "score": shot.GameWorld.totalScore,
                "itemId": "item:1373",
                "propertyName": "fhk"
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //存结算分数
    saveLevelScore: function saveLevelScore() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'save_level_score',
                'gameId': ty.SystemInfo.gameId,
                "score": shot.GameWorld.totalScore
            }
        };
        hall.MsgFactory._sendCmd(params);
    },
    //获取用户信息
    getUserInfoForShot: function getUserInfoForShot() {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'get_user_info',
                'gameId': ty.SystemInfo.gameId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    //扣除资产
    consumeAssets: function consumeAssets(count, item) {
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
    bindMutualInviterId: function bindMutualInviterId(inviteId) {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'bind_mutual_inviter_id',
                'gameId': ty.SystemInfo.gameId,
                "inviterId": inviteId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // 打开道具
    getUniqueBoxId: function getUniqueBoxId(itemId, type) {
        var params = {
            'cmd': 'game',
            'params': {
                'action': 'get_unique_box_id',
                'gameId': ty.SystemInfo.gameId,
                "itemId": itemId,
                "propertyName": type
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 获取宝箱奖励
     */
    getBoxReward: function getBoxReward(boxUserId, boxId, groupId) {
        if (!boxUserId || boxUserId == "") {
            return;
        }
        if (!boxId || boxId == "") {
            return;
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
    shareToGetreward: function shareToGetreward(sharePoint) {
        if (!sharePoint || sharePoint == 0) {
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

    checkRewardWithSharePoint: function checkRewardWithSharePoint(sharePoint) {
        if (!sharePoint || sharePoint == 0) {
            return;
        }
        var pars = {
            "cmd": shot.EventType.HALL_SHARE2,
            "params": {
                "action": shot.EventType.CHECK_REWARD,
                "gameId": ty.SystemInfo.gameId,
                "pointId": sharePoint
            }
        };
        hall.MsgFactory._sendCmd(pars);
    },

    parseGame: function parseGame(value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action) {
            case "common_config":
                {
                    this.parseCommonConfig(value.result);
                    break;
                }
            case "save_score":
                {
                    this.saveScoreResult(value.result);
                    break;
                }
            case "query_mutual_invite_assets":
                {
                    // {"cmd":"game","result":{"gameId":98,"action":"query_mutual_invite_assets","assetsCounts":0}}
                    if (value.result) {
                        shot.gameModel.assetsCounts = value.result.assetsCounts;
                        // ty.NotificationCenter.trigger(shot.EventType.UPDATE_ASSETS_COUNT,value.result);
                    }
                    break;
                }
            case "get_user_info":
                {
                    if (value.result) {
                        ty.NotificationCenter.trigger(shot.EventType.UPDATE_USERINFO, value.result);
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
            case "bind_mutual_inviter_id":
                {
                    if (value.result.success == 1) {
                        shot.GlobalFuncs.showDiamondGift(1, value.result);
                    }
                    break;
                }
            case "consume_assets":
                {
                    // {"cmd":"game","result":{"action":"consume_assets","gameId":98,"userId":10184,"success":0}}
                    if (value.result) {
                        ty.NotificationCenter.trigger(shot.EventType.RESURGENCE_RESULT, value.result);
                    }
                    break;
                }
            case "update_assets":
                {
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
                    if (value.result) {
                        if (value.result.itemId && value.result.itemId == "item:1371") {
                            hall.MsgBoxManager.showToast({ title: '成功获得1个无限子弹道具' });
                        } else if (value.result.itemId && value.result.itemId == "item:1372") {
                            hall.MsgBoxManager.showToast({ title: '成功获得1个瞄准器道具' });
                        } else if (value.result.itemId && value.result.itemId == "item:1373") {
                            hall.MsgBoxManager.showToast({ title: '成功获得1颗钻石' });
                        } else if (value.result.itemId && value.result.itemId == "item:1390") {
                            hall.MsgBoxManager.showToast({ title: '成功获得1个手榴弹道具' });
                        }
                    }
                    break;
                }
            case "get_unique_box_id":
                {
                    if (value.result) {
                        shot.GlobalFuncs.showPropBox(value.result);
                    }
                    break;
                }
            case "get_box_reward":
                {
                    if (value.result.rewardMsg) {
                        var _rewardMsg = value.result.rewardMsg;
                        if (_rewardMsg.indexOf("无限子弹") > 0) {
                            shot.GlobalFuncs.playGetPropBoxAni(0);
                        } else if (_rewardMsg.indexOf("激光") > 0) {
                            shot.GlobalFuncs.playGetPropBoxAni(1);
                        } else if (_rewardMsg.indexOf("手榴弹") > 0) {
                            shot.GlobalFuncs.playGetPropBoxAni(2);
                        } else {
                            hall.MsgBoxManager.showToast({ title: _rewardMsg });
                        }
                    }
                    break;
                }
        }
    },

    // 解析透传参数数据
    parseCommonConfig: function parseCommonConfig(value) {
        switch (value.configKey) {
            case "normalConfig":
                {
                    this.saveNormalConfigJson(value.config);
                    break;
                }
            case "shareConfig":
                {
                    this.saveShareConfigJson(value.config);
                    break;
                }
            case "gunnerShareScheme":
                {
                    this.saveGunnerShareSchemeJson(value.config);
                    break;
                }
        }
    },
    saveNormalConfigJson: function saveNormalConfigJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }
        shot.GameWorld.bottleConfig = value.bottleConfig;
        shot.GameWorld.propertyConfig = value.propertyConfig;
        shot.GameWorld.rotationTimeConfig = value.rotationTimeConfig;
        shot.GameWorld.scoreLevelConfig = value.scoreLevelConfig;
        shot.GameWorld.bulletAddConfig = value.bulletAddConfig;
        if (value.toolUserTimeConfig) {
            shot.GameWorld.toolUserTimeConfig = value.toolUserTimeConfig;
        }
        if (value.bulletConfig) {
            shot.GameWorld.bulletConfig = value.bulletConfig;
        }
        if (value.treasureConfig) {
            shot.GameWorld.treasureConfig = value.treasureConfig;
        }
        if (value.crazyMomentConfig) {
            shot.GameWorld.crazyMomentConfig = value.crazyMomentConfig;
        }
        if (value.jugglingSchemaConfig) {
            shot.GameWorld.jugglingSchemaConfig = value.jugglingSchemaConfig;
        }
        ty.NotificationCenter.trigger(shot.EventType.GUNNER_SHARE_SCHEME);
    },
    saveShareConfigJson: function saveShareConfigJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }
        shot.GameWorld.shareConfig = value;
    },
    saveGunnerShareSchemeJson: function saveGunnerShareSchemeJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }
        if (value.allCheckVersion) {
            ty.SystemInfo.isCheckVersion = value.allCheckVersion == ty.SystemInfo.version;
        }
        shot.GameWorld.gunnerShareSchemeConfig = value;
        if (ty.SystemInfo.isCheckVersion) {
            shot.GameWorld.gunnerShareSchemeConfig.resurgenceShare = value.allCheckConfig;
            shot.GameWorld.gunnerShareSchemeConfig.boxShareGetProp = value.allCheckConfig;
            shot.GameWorld.gunnerShareSchemeConfig.giftBagShareGetDiamond = value.allCheckConfig;
        }
        ty.NotificationCenter.trigger(shot.EventType.GUNNER_SHARE_SCHEME);
        ty.NotificationCenter.trigger(ty.EventType.GET_AD_MSG_SUCCESS);
    },
    getAllCheckConfig: function getAllCheckConfig() {
        return ty.SystemInfo.isCheckVersion && (!shot.GameWorld.gunnerShareSchemeConfig || !shot.GameWorld.gunnerShareSchemeConfig.allCheckConfig);
    },
    saveScoreResult: function saveScoreResult(result) {
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
        //# sourceMappingURL=GameModel.js.map
        