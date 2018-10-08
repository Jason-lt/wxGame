//
//  MsgFactory.js
//
//  Created by xujing on 18-01-29.
// 将向server发消息的逻辑统一放在这里
hall.MsgFactory = {
    _TAG: 'hall.MsgFactory',

    // 发送出去消息
    _sendCmd: function(json) {
        // var strValue = JSON.stringify(json) + '\r\n';
        // ddz.LOGD(null, 'send msg in msg_factory :' + strValue);
        if (!json.params){
            json.params = {};
        }
        json.params.userId = json.params.userId || ty.UserInfo.userId;
        json.params.gameId = json.params.gameId || ty.SystemInfo.hallId;
        json.params.clientId = ty.SystemInfo.clientId;

        ty.TCP.sendMsg(json);
    },

    /**
     * 获取UserInfo，大厅获取9999的UserInfo，单版获取6的
     * 大厅也有获取6的user_info的时候，地主的新手奖励实在地主服的bind_game时发放的
     */
    getUserInfo: function(gameId) {
        hall.LOGD(this._TAG, 'getUserInfo');
        if (gameId == null || typeof(gameId) == 'undefined') {
            gameId = ty.SystemInfo.hallId;
        }

        hall.LOGD(this._TAG, 'getUserInfo gameId = ' + gameId);
        var params = {
            'cmd': ty.EventType.CMD_USER_INFO,
            'params' : {
                'gameId': gameId
            }
        };
        this._sendCmd(params);
    },
    /*
     typeid
     2 - 系统消息
     1 - 游戏消息
    */
    getUserRewardInfo: function() {
        hall.LOGD(this._TAG, 'getUserRewardInfo');
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params' : {
                'action':'list',
                'typeid':1
            }
        };
        this._sendCmd(params);
    },
    getTimeStamp: function() {
        hall.LOGD(this._TAG, 'getTimeStamp');
        var params = {
            "cmd"   : ddz.EventType.CMD_USER,
            "params": {
                "action" :"sync_timestamp"
            }
        };
        this._sendCmd(params);
    },

    /* 进入经典场，某个房间，返回的是table_info...有3种情况，带roomid（选定房间进入）, 带sessionIndex（快速进入）, 都不带（断线重练）
     * 参数都要携带，roomId或者sessionIndex没有的时候传null
     * isBringInCoin是否有代入功能
     * 斗地主与麻将牌桌内的快速开始要携带在牌桌内的标记innerTable
     * innerTable为1，表示在牌桌内的快速开始，没有或者为0，表示非配桌内的快速开始
     */
    getQuickStart: function(userId, gameId, roomId, apiver, sessionIndex, isBringInCoin, innerTable, tableId) {
        var data = {
            'userId': userId,
            'gameId': gameId,
            'apiver': apiver
        };
        var params = {
            'cmd': ddz.EventType.CMD_TABLE_QUICKSTART,
            'params': data
        };

        //如果没有sessionIndex这个参数，则传roomId， 否则传sessionIndex
        if (typeof(sessionIndex) != 'undefined' && sessionIndex != null) {
            data["sessionIndex"] = sessionIndex;
        }

        if (typeof(roomId) != 'undefined' && roomId != null) {
            data["roomId"] = roomId;
        }

        if (tableId) {
            data["tableId"] = tableId;
        }

        if (typeof(innerTable) != 'undefined' && innerTable != null) {
            data['innerTable'] = innerTable;
        }

        if (typeof(isBringInCoin) != 'undefined' && isBringInCoin != null) {
            data["buyin"] = isBringInCoin;
        }

        this._sendCmd(params);
    },

    /**
     * 获取gameData，大厅版本需要区分是获取9999的gameId还是6的gameId
     */
    getGameData: function(gameId) {
        var params = {
            'cmd': ddz.EventType.CMD_GAME_DATA,
            'params': {
                'gameId': gameId
            }
        };

        this._sendCmd(params);
    },

    // 获取已发出私信列表
    getMsgSendData: function(pagenum) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "msg_send_list",
                'pagenum': pagenum
            }
        };

        this._sendCmd(params);
    },

    // 获取接受私信列表
    getMsgReceiveData: function(pagenum) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "msg_receive_list",
                'pagenum': pagenum
            }
        };

        this._sendCmd(params);
    },

    getSysMsgData: function() {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "sys_msg_list"
            }
        };
        this._sendCmd(params);
    },
    // 宝石排行榜签名
    setRankSign: function(str) {
        var params = {
            'cmd': ddz.EventType.CMD_RANK,
            'params': {
                "action": "sign",
                'rankKey': "hall.jewel",
                'content': str
            }
        };
        this._sendCmd(params);
    },

    // 发送私信
    sendMsgData: function(otherId, msg) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "msg_send",
                'to_uid': otherId,
                'msg': msg
            }
        };
        this._sendCmd(params);
    },
    // 消息未读
    getUnreadMsg: function() {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "sys_unread"
            }
        };
        this._sendCmd(params);
    },
    //删除私信
    deleteRecMsgData: function(index) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "del_msg_recv",
                'id': index
            }
        };
        this._sendCmd(params);
    },
    deleteSendMsgData: function(index) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                "action": "del_msg_send",
                'id': index
            }
        };
        this._sendCmd(params);
    },
    // 获取金币排行榜
    getCoinRank: function() {
        var params = {
            'cmd': ddz.EventType.CMD_RANK,
            'params': {
                "action": "list",
                'rankKey': "110000001"
            }
        };
        this._sendCmd(params);
    },
    // 
    getRebateRank: function() {
        var params = {
            'cmd': ddz.EventType.CMD_RANK,
            'params': {
                "action": "list",
                'rankKey': "hall.period.winchip.1605"
            }
        };
        this._sendCmd(params);
    },

    // 获取宝石排行榜

    getJewelRank: function() {
        var params = {
            'cmd': ddz.EventType.CMD_RANK,
            'params': {
                "action": "list",
                'rankKey': "hall.jewel"
            }
        };
        this._sendCmd(params);
    },
    // 根据id获取名字
    getUserNameById: function(targetId) {
        var params = {
            'cmd': ddz.EventType.CMD_USER,
            'params': {
                "action": "get_name",
                'targetUserId': targetId
            }
        };
        this._sendCmd(params);
    },
    // 出售宝石
    soldJewel: function(count) {
        var params = {
            'cmd': ddz.EventType.CMD_STORE,
            'params': {
                "action": "jewel_sell",
                'count': count
            }
        };
        this._sendCmd(params);
    },
    // 赠送
    handSoldJewel: function(count, toUid) {
        var params = {
            'cmd': ddz.EventType.CMD_STORE,
            'params': {
                "action": "jewel_give",
                'count': count,
                'to_uid': toUid
            }
        };
        this._sendCmd(params);
    },

    getNewVIPInfo: function() {
        var params = {
            'cmd': ddz.EventType.CMD_NEW_VIP,
            'params': {
                'gameId': ty.SystemInfo.gameId,
                'action': "simpleVipInfo"
            }
        };
        this._sendCmd(params);
    },

    // 获取每日登陆的奖励 
    getLoginReward: function() {
        var params = {
            'cmd': ddz.EventType.CMD_GET_NSLOGIN_REWARD,
            'params': {
                'gameId': ty.SystemInfo.gameId,
                'rewardtype': 1
            }
        };
        this._sendCmd(params);
    },

    // 获取新手奖励
    getNewUserReward: function() {
        var params = {
            'cmd': ddz.EventType.CMD_NEW_USER_REWARD,
            'params': {
                'gameId': ty.SystemInfo.gameId,
                'actionType': 1,
                "action": "receive"
            }
        };
        this._sendCmd(params);
    },

    //获取商店信息
    getStoreInfo: function(action) {
        hall.LOGD(this._TAG, "发送获取商店信息请求...");
        var params = {
            'cmd': ddz.EventType.CMD_STORE_INFO,
            'params': {
                'action': action
            }
        };
        this._sendCmd(params);
    },

    //获取背包信息
    getBagInfo: function() {
        var params = {
            'cmd': ddz.EventType.CMD_BAG_INFO,
            'params': {
                'action': 'update'
            }
        };
        this._sendCmd(params);

        // var params = {
        //     'cmd': ddz.EventType.CMD_PACK_INFO,
        //     'params': {
        //         'action': 'list'
        //     }
        // };
        // this._sendCmd(params);

    },

    //获取每次任务信息，action有两个：change改变每日任务的状态    update更新每日任务
    getEveryTaskInfo: function(gameId, action) {
        var params = {
            'cmd': ddz.EventType.CMD_EVERYTASK,
            'params': {
                'gameId': gameId,
                'action': action
            }
        };
        this._sendCmd(params);
    },

    getPersonalMsg: function(gameId) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                'gameId': gameId || ty.SystemInfo.gameId,
                'action': 'private_update',
                'pagenum': 0
            }
        };
        this._sendCmd(params);
    },
    getGlobalMsg: function(gameId) {
        var params = {
            'cmd': ddz.EventType.CMD_MESSAGE,
            'params': {
                'gameId': gameId || ty.SystemInfo.gameId,
                'action': 'global_update',
                'pagenum': 0

            }
        };
        this._sendCmd(params);
    },

    // 心跳的消息
    sendHeartBeat: function(argument) {
        var cmd = {
            'cmd': ty.EventType.HEART_BEAT,
            'params': {
                'deviceId': ty.SystemInfo.deviceId
            }
        };
        this._sendCmd(cmd);
    },

    getHallInfo: function(gameId) {
        var cmd = {
            'cmd': ddz.EventType.CMD_HALL_INFO,
            'params': {
                'gameId': gameId
            }
        };

        this._sendCmd(cmd);
    },

    /**
     * 3.0接口，等同于2.7的user_info
     * 大厅版本发送大厅的GameId，单版发送地主的gameIdisHall
     */
    bindUser: function() {
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
     * 获取游戏数据
     */
    getGdata: function() {
        var cmd = {
            'cmd': ddz.EventType.CMD_GAME_DATA,
            'params': {
                'authorCode': ty.UserInfo.authorCode
            }
        };
        this._sendCmd(cmd);
    },

    /**
     * 3.0接口，大厅独特消息
     */
    bindGame: function(gameId) {
        var cmd = {
            'cmd': ty.EventType.CMD_BIND_GAME,
            'params': {
                'gameId': gameId,
                'authorCode': ty.UserInfo.authorCode
            }
        };
        this._sendCmd(cmd);
    },
    // 请求服务器返回web页信息

    // 获取头像图片列表
    getHeadPics: function(gameId) {
        var cmd = {
            'cmd': ddz.EventType.CMD_GET_HEAD_PICS,
            'params': {
                'gameId': gameId
            }
        };
        this._sendCmd(cmd);
    },

    // 组局信息获取接口
    roomAction: function(action, tableId, data) {
        var tmp = {
            "action": action,
            'gameId': ddz.GameId,
            'customTableId': tableId,
            'roomId': hall.CUSTOM_ROOMID
        };
        if (data) {
            for (var key in data) {
                tmp[key] = data[key];
            }
        }
        var params = {
            'cmd': ddz.EventType.CMD_ROOM,
            'params': tmp
        };
        this._sendCmd(params);
    },

    customTableAction: function(action, data) {
        var tmp = {
            "action": action,
            'gameId': ty.SystemInfo.gameId
        };
        if (data) {
            for (var key in data) {
                tmp[key] = data[key];
            }
        }
        var params = {
            'cmd': ddz.EventType.CMD_CUSTOMTABLE,
            'params': tmp
        };

        this._sendCmd(params);
    }
};