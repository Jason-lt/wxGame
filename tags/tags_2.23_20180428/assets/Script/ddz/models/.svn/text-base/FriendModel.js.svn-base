/**
 * Created by xujing on 2018/4/13.
 */

ddz.friendModel = {
    CREATE_ROUND_COUNT : "CREATE_ROUND_COUNT",
    CREATE_MODE_TYPE : "CREATE_MODE_TYPE",
    isEnterTable:false,

    parseDiZhuInfo:function (argument) {
        switch (argument.result.action){
            case ddz.EventType.ACTION_FT_CREATE : {
                this.parseCreateFriendBack(argument.result);
                break;
            }
            case ddz.EventType.ACTION_FT_GET_CONF : {
                this.parseRoomCfg(argument.result);
                break;
            }
            case ddz.EventType.ACTION_FT_ENTER_TABLE : {
                this.parseEnterTable(argument.result);
                break;
            }
            case ddz.EventType.ACTION_GET_FT_TABLE_RECORD : {
                this.parseHistoryInfo(argument.result);
                break
            }
        }
    },

    /**
     * 创建牌桌后的消息解析
     * @param result
     */
    parseCreateFriendBack:function (result) {
        if ((!result.hasOwnProperty('code') || result['code'] == 0) && result.hasOwnProperty('ftId')) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeStartFriendTime,[result['ftId']]);
            ddz.friendModel.enterFTTable(result['ftId']);
        } else {
            //弹提示信息
            ddz.LOGD('parseCreateFriendBack','创建失败啦吧！！！！！！！！！！！！' + JSON.stringify(result));
            hall.MsgBoxManager.showToast({title:result.info})
        }
    },

    parseRoomCfg:function (result) {
        this._roomCfg = result.conf;
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_FT_GET_CONF,result.conf);
        // this.rounds = conf.rounds;
        // this.playModes = conf.playModes;
    },

    parseEnterTable:function (result) {
        //这个好像啥也没作{"action":"ft_enter","gameId":6,"userId":10002,"ftId":"123456","code":-1,"info":"没有找到该牌桌"}
        // hall.LOGE("===","=======parseEnterTable===="+JSON.stringify(result));
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeStartFriendFail,
            [result.info]);

        if(result.code == -1){
            if (result.info && result.info.length > 0){
                var tipsString = result.info;
                var preFabPath = "prefabs/dissolveNode";
                var comName = "ddz_window_dissolve";
                ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var window = preFabNode.getComponent(comName);
                    window.setTipsSString(tipsString);
                });
            }
        }
    },

    parseHistoryInfo:function(result){
        hall.LOGE("","file = [FriendModel] fun = [parseHistoryInfo]");
        ddz.historyModel.parseHistory(result);
        hall.GlobalFuncs.onHistory();
    },

    /**
     * 获取房间配置
     * @returns {*}
     */
    getRoomCfg:function () {
        return this._roomCfg;
    },

    enterFriendTable : function (ftId) {
        ddz.Share.shareKeywordReplace.inviteFriendID = ftId;
        this.isEnterTable = true;
        if (ddz.matchModel.getCurWaitInfo()){
            ddz.MsgFactory.saveMatch();
        }else {
            if(debugMode){
                ddz.MsgFactory.getMatchRecords();
            }
        }
    },

    // 请求进入好友桌
    enterFTTable:function(ftId) {
        var curScene = cc.director.getScene();
        var tableScene = curScene.children[0].getComponent('DdzTableScene');
        if (curScene.name ==  "TableScene" && tableScene.tableInfo().getSceneType() == ddz.Enums.SceneType.FRIEND){
            hall.MsgBoxManager.showToast({title:"当前已在牌桌中,不可重复进桌"});
            return;
        }
        var params = {
            "cmd":ddz.EventType.CMD_DIZHU,
            "params":{
                "gameId": ty.SystemInfo.gameId,
                "action": ddz.EventType.ACTION_FT_ENTER_TABLE,
                "inviteId": ftId,
                "ftId": ftId,
                "version":"3.90"
            }
        };
        hall.MsgFactory._sendCmd(params);
        ddz.friendModel.isEnterTable = false;
    },

    // 解散牌桌请求
    reqDisbind:function (roomId, tableId, seatId) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomDissolveClick, ["request"]);
        ddz.NetWorkCenter.canNotLeave = false;
        var params = {
            "cmd":ddz.EventType.CMD_TABLE_CALL,
            "params":{
                "action": ddz.EventType.ACTION_FT_REQ_DISBIND,
                "gameId": ty.SystemInfo.gameId,
                "seatId": seatId,
                "roomId": roomId,
                "tableId": tableId,
                "version":"3.90"
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    // 确认解散牌桌请求
    ansDisbind:function (roomId, tableId, seatId, answer) {
        var params = {
            "cmd":ddz.EventType.CMD_TABLE_CALL,
            "params":{
                "action": ddz.EventType.ACTION_FT_REQ_DISBIND_ANSWER,
                "gameId": ty.SystemInfo.gameId,
                "seatId": seatId,
                "roomId": roomId,
                "tableId": tableId,
                "answer": answer
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 获取好友房间配置
     * ft_get_conf
     */
    getFriendConf: function() {
        var params = {
            'cmd': ddz.EventType.CMD_DIZHU,
            'params': {
                'gameId': ty.SystemInfo.gameId,
                "action": ddz.EventType.ACTION_FT_GET_CONF
            }
        };
        hall.MsgFactory._sendCmd(params);
    },


    // 继续玩
    continueFT:function (roomId, tableId, seatId) {
        var params = {
            "cmd":ddz.EventType.CMD_TABLE_CALL,
            "params":{
                "action": ddz.EventType.ACTION_FT_CONTINUE,
                "gameId": ty.SystemInfo.gameId,
                "seatId": seatId,
                "roomId": roomId,
                "tableId": tableId
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

    /**
     * 创建好友房间
     * @param nRound
     * @param double
     * @param playMode
     * @param goodCard
     */
    createFriendRoom: function(nRound, double, playMode, goodCard) {
        var conf = {
            "nRound": nRound,
            "double": double,
            "playMode": playMode,
            "goodCard": goodCard
        };

        var params = {
            'cmd': ddz.EventType.CMD_DIZHU,
            'params': {
                'gameId': ty.SystemInfo.gameId,
                "action": ddz.EventType.ACTION_FT_CREATE,
                "conf" : conf
            }
        };
        hall.MsgFactory._sendCmd(params);
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_ENTER_TABLE);
    },

    /**
     * 获取好友房历史数据
     * 
     */
    getHisToryInfo: function() {
        var params = {
            'cmd': ddz.EventType.CMD_DIZHU,
            'params': {
                'gameId': ty.SystemInfo.gameId,
                "action": ddz.EventType.ACTION_GET_FT_TABLE_RECORD
            }
        };
        hall.MsgFactory._sendCmd(params);
    },

};