(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/double/doubleEventType.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '213488JTL1IzpyFPiEtySAV', 'doubleEventType', __filename);
// Script/double/doubleEventType.js

'use strict';

console.log('double_EventType loaded');

double.EventType = {
    // ----------- 网络消息相关的事件 -----------
    // 网络消息，客户端发给server的叫 CMD_XXX, server 发给客户端的叫 MSG_XXX
    // 把所有的消息名字写到这里，防止写到各个文件内时，引起的混乱

    //==================用户信息相关================================
    CMD_BIND_USER: 'bind_user', //返回user_info
    CMD_USER: 'user',
    UPDATE_SHARE_STATE: "UPDATE_SHARE_STATE",
    CMD_USER_INFO: 'user_info', // 获取user_info
    MSG_USER_INFO: 'user_info', // 返回userInfo
    CMD_GAME_DATA: 'game_data', // 获取gameData
    MSG_GAME_DATA: 'game_data', // 返回gameData
    MSG_GAME: "game",

    GET_TIMESTAMP: "GET_TIMESTAMP", //时间

    START_AUTHORIZATION_FAILED: "START_AUTHORIZATION_FAILED",

    //监听
    //广告
    REWARD_VIDEO_COMPLETE: "REWARD_VIDEO_COMPLETE",
    REWARD_VIDEO_COMPLETE_ERROR: "REWARD_VIDEO_COMPLETE_ERROR",
    //营销传播智能管理系统
    GET_USER_FEATURE_SUCCESS: 'GET_USER_FEATURE_SUCCESS',
    GET_USER_FEATURE_FAIL: 'GET_USER_FEATURE_FAIL',
    GET_SHARE_CONFIG_SUCCESS: 'GET_SHARE_CONFIG_SUCCESS',
    GET_SHARE_CONFIG_FAIL: 'GET_SHARE_CONFIG_FAIL',

    //===========================背包相关=================================
    CMD_BAG_INFO: 'bag',
    MSG_BAG_INFO: 'bag',
    UPDATE_INFINITEBULLET_NUMBER: "UPDATE_INFINITEBULLET_NUMBER",
    UPDATE_LASERAIMING_NUMBER: "UPDATE_LASERAIMING_NUMBER",
    UPDATE_GRENADE_NUMBER: "UPDATE_GRENADE_NUMBER",

    /*==============================分享得钻石相关===================================*/
    GET_REWARD: 'get_reward',
    CHECK_REWARD: 'check_reward',
    GET_CHECK_REWARD: 'GET_CHECK_REWARD',
    HALL_SHARE2: 'hall_share2',

    //gdata item,udata变化时，服务器发送的消息
    CMD_DATA_CHANGED: 'update_notify', //[20140514][jinrifeng] 用于接收金币数据更新的消息
    MSG_DATA_CHANGED: 'update_notify',
    MSG_UPDATE_ASSETS: 'update_assets',

    /*==============================游戏内状态相关===================================*/
    //游戏
    GAME_START: "GAME_START",
    GAME_OVER: "GAME_OVER",
    GAME_LEVEL_UP: "GAME_LEVEL_UP",
    CHANGE_GUN_TYPE: "CHANGE_GUN_TYPE", //更换武器

    GAME_ROLL_STOP: "GAME_ROLL_STOP",

    // // GAME_OVER : "GAME_OVER",
    // UPDATE_RESULT_RANK : "UPDATE_RESULT_RANK",
    //
    // STOP_DOUBLEHIT_COUNTDOWN : "STOP_DOUBLEHIT_COUNTDOWN",
    //
    // //道具
    // UPDATE_DIAMOND_NUMBER: "UPDATE_DIAMOND_NUMBER",
    // UPDATE_USERINFO: "UPDATE_USERINFO",
    // RESURGENCE_RESULT : "RESURGENCE_RESULT",

    // GUNNER_SHARE_SCHEME : "GUNNER_SHARE_SCHEME",
    // BSGS_CHECK_RESULT : "BSGS_CHECK_RESULT",


    REPLAY_BG_MUSIC: 'REPLAY_BG_MUSIC'
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
        //# sourceMappingURL=doubleEventType.js.map
        