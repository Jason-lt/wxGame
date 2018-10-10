
double.gameModel = {
    IS_NEW_USER : "IS_NEW_USER",
    ONHIDE_DATE : "ONHIDE_DATE",

    GAME_LEVEL : "GAME_LEVEL",//关卡数
    GAME_BEST_SCORE : "GAME_BEST_SCORE",//最佳分数
    GAME_NEWEST_OBJECT_INDEX : "GAME_NEWEST_OBJECT_INDEX",//解锁的最后一个物品
    GAME_COIN_NUMBER : "GAME_COIN_NUMBER",//金币数量
    GAME_WEAPON_LOCK_STATE : "GAME_WEAPON_LOCK_STATE",//武器解锁状态
    GAME_WEAPON_NOW : "GAME_WEAPON_NOW",//当前使用的武器

    GAME_STAGE_BOX_NUMBER : "GAME_STAGE_BOX_NUMBER",//当前阶段的宝箱数量
    GAME_STAGE_BOX_LEVEL : "GAME_STAGE_BOX_LEVEL",//当前阶段的最低关数

    GAME_LAST_RECORD_DAY : "GAME_LAST_RECORD_DAY",
    GAME_MACHINE_NODOUBLE_TIME : "GAME_MACHINE_NODOUBLE_TIME",

    rankWindow : null,
    titlePage : null,
    weaponsDepot : null,
    newWeapon : null,
    newResult : null,
    rewardWeapon : null,
    gameOverPenal : null,
    resurgencePanel : null,
    pausePanel : null,

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

    parseGame:function (value) {
        // hall.LOGD(this._TAG, "onGame Ddz_network -------------------------"+ JSON.stringify(value));
        switch (value.result.action){
            case "common_config" : {
                this.parseCommonConfig(value.result);
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
        }
    },
    saveNormalConfigJson : function (value) {
        if (hall.GlobalFuncs.isEmptyObject(value)){
            return;
        }
        console.log(value);
        double.GameWorld.objectConfig = value.objectConfig;
        double.GameWorld.gunConfig = value.gunConfig;
        double.GameWorld.boxConfig = value.boxConfig;
        double.GameWorld.generalConfig = value.generalConfig;
        if(value.rewardOpenTypeConfig){
            double.GameWorld.rewardOpenTypeConfig = value.rewardOpenTypeConfig;
        }
        if(value.doubleVersionConfig){
            double.GameWorld.doubleVersionConfig = value.doubleVersionConfig;
            if(value.doubleVersionConfig.allCheckVersion){
                ty.SystemInfo.isCheckVersion = value.doubleVersionConfig.allCheckVersion == ty.SystemInfo.version;
            }
        }
        // ty.NotificationCenter.trigger(double.EventType.GUNNER_SHARE_SCHEME);
    },

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
        double.GameWorld.shareConfig = value;
    }
};