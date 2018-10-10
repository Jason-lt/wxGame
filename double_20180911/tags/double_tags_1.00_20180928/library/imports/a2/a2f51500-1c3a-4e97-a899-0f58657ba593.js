"use strict";
cc._RF.push(module, 'a2f51UAHDpOl6iZD1hle6WT', 'GameModel');
// Script/double/models/GameModel.js

"use strict";

double.gameModel = {
    IS_NEW_USER: "IS_NEW_USER",

    GAME_LEVEL: "GAME_LEVEL", //关卡数
    GAME_BEST_SCORE: "GAME_BEST_SCORE", //最佳分数
    GAME_NEWEST_OBJECT_INDEX: "GAME_NEWEST_OBJECT_INDEX", //解锁的最后一个物品
    GAME_COIN_NUMBER: "GAME_COIN_NUMBER", //金币数量

    GAME_STAGE_BOX_NUMBER: "GAME_STAGE_BOX_NUMBER", //当前阶段的宝箱数量

    rankWindow: null,
    titlePage: null,
    weaponsDepot: null,
    newWeapon: null,
    newResult: null,

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
    // //获取布局配置信息
    // getShareConfig: function() {
    //     var params = {
    //         'cmd': 'game',
    //         'params': {
    //             'action' : 'common_config',
    //             'gameId' : ty.SystemInfo.gameId,
    //             'configKey' : 'shareConfig'
    //         }
    //     };
    //     hall.MsgFactory._sendCmd(params);
    // },


    parseGame: function parseGame(value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action) {
            case "common_config":
                {
                    this.parseCommonConfig(value.result);
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
            // case "shareConfig": {
            //     this.saveShareConfigJson(value.config);
            //     break;
            // }
            // case "gunnerShareScheme": {
            //     this.saveGunnerShareSchemeJson(value.config);
            //     break;
            // }
        }
    },
    saveNormalConfigJson: function saveNormalConfigJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }
        double.GameWorld.objectConfig = value.objectConfig;
        double.GameWorld.gunConfig = value.gunConfig;
        double.GameWorld.boxConfig = value.boxConfig;
        double.GameWorld.generalConfig = value.generalConfig;
        // if(value.toolUserTimeConfig){
        //     double.GameWorld.toolUserTimeConfig = value.toolUserTimeConfig;
        // }
        // ty.NotificationCenter.trigger(double.EventType.GUNNER_SHARE_SCHEME);
    },
    saveShareConfigJson: function saveShareConfigJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }
        double.GameWorld.shareConfig = value;
    },
    saveGunnerShareSchemeJson: function saveGunnerShareSchemeJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }
        if (value.allCheckVersion) {
            ty.SystemInfo.isCheckVersion = value.allCheckVersion == ty.SystemInfo.version;
        }
        double.GameWorld.gunnerShareSchemeConfig = value;
        if (ty.SystemInfo.isCheckVersion) {
            double.GameWorld.gunnerShareSchemeConfig.resurgenceShare = value.allCheckConfig;
            double.GameWorld.gunnerShareSchemeConfig.boxShareGetProp = value.allCheckConfig;
            double.GameWorld.gunnerShareSchemeConfig.giftBagShareGetDiamond = value.allCheckConfig;
        }
        ty.NotificationCenter.trigger(double.EventType.GUNNER_SHARE_SCHEME);
        ty.NotificationCenter.trigger(ty.EventType.GET_AD_MSG_SUCCESS);
    },
    getAllCheckConfig: function getAllCheckConfig() {
        return ty.SystemInfo.isCheckVersion && (!double.GameWorld.gunnerShareSchemeConfig || !double.GameWorld.gunnerShareSchemeConfig.allCheckConfig);
    },
    saveScoreResult: function saveScoreResult(result) {
        double.Share.shareKeywordReplace.mysteryGiftBagBoxId = result.boxId;
    },
    saveShareConfigFromHttp: function saveShareConfigFromHttp(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) {
            return;
        }

        //要进行处理,因为少了分享点和群验证标识
        var shareExt = value['shareExt'];
        delete value['shareExt'];

        if (shareExt) {
            var shareCfg, extCfg;
            for (var shareKey in value) {
                shareCfg = value[shareKey];
                extCfg = shareExt[shareKey];
                if (extCfg) {
                    for (var subKey in extCfg) {
                        shareCfg[subKey] = extCfg[subKey]; //把扩展属性,添加到主配置上
                    }
                }
            }
        }

        this.shareConfig = value;
        double.GameWorld.shareConfig = value;
    }
};

cc._RF.pop();