"use strict";
cc._RF.push(module, '3b614mJf7tMiY9XMicIbNRb', 'MsgFactory');
// Script/hall/MsgFactory.js

'use strict';

//
//  MsgFactory.js
//
//  Created by xujing on 18-01-29.
// 将向server发消息的逻辑统一放在这里
hall.MsgFactory = {
    _TAG: 'hall.MsgFactory',

    // 发送出去消息
    _sendCmd: function _sendCmd(json) {
        // var strValue = JSON.stringify(json) + '\r\n';
        // double.LOGD(null, 'send msg in msg_factory :' + strValue);
        if (!json.params) {
            json.params = {};
        }
        json.params.userId = json.params.userId || ty.UserInfo.userId;
        json.params.gameId = json.params.gameId || ty.SystemInfo.hallId;
        json.params.clientId = ty.SystemInfo.clientId;

        ty.TCP.sendMsg(json);
    },
    bindUser: function bindUser() {
        // 发送完bind_user，需要重置msg_center里的_bBindGame
        // if (!hall.MsgCenter._bBindGame) {
        //     hall.MsgCenter._bBindGame = true;
        // }

        var cmd = {
            'cmd': ty.EventType.CMD_BIND_USER,
            'params': {
                'authorCode': ty.UserInfo.authorCode
            }
        };
        this._sendCmd(cmd);
    },

    /**
     * 获取UserInfo，大厅获取9999的UserInfo，单版获取6的
     * 大厅也有获取6的user_info的时候，地主的新手奖励实在地主服的bind_game时发放的
     */
    getUserInfo: function getUserInfo(gameId) {
        hall.LOGD(this._TAG, 'getUserInfo');
        if (gameId == null || typeof gameId == 'undefined') {
            gameId = ty.SystemInfo.hallId;
        }

        hall.LOGD(this._TAG, 'getUserInfo gameId = ' + gameId);
        var params = {
            'cmd': ty.EventType.CMD_USER_INFO,
            'params': {
                'gameId': gameId
            }
        };
        this._sendCmd(params);
    },
    // 心跳的消息
    sendHeartBeat: function sendHeartBeat(argument) {
        var cmd = {
            'cmd': ty.EventType.HEART_BEAT,
            'params': {
                'deviceId': ty.SystemInfo.deviceId
            }
        };
        this._sendCmd(cmd);
    },
    getTimeStamp: function getTimeStamp() {
        hall.LOGD(this._TAG, 'getTimeStamp');
        var params = {
            "cmd": double.EventType.CMD_USER,
            "params": {
                "action": "sync_timestamp"
            }
        };
        this._sendCmd(params);
    },

    //获取背包信息
    getBagInfo: function getBagInfo() {
        var params = {
            'cmd': double.EventType.CMD_BAG_INFO,
            'params': {
                'action': 'update'
            }
        };
        this._sendCmd(params);
    },

    /**
     * 获取gameData，大厅版本需要区分是获取9999的gameId还是6的gameId
     */
    getGameData: function getGameData(gameId) {
        var params = {
            'cmd': double.EventType.CMD_GAME_DATA,
            'params': {
                'gameId': gameId
            }
        };

        this._sendCmd(params);
    }
};

cc._RF.pop();