/**
 * Created by xujing on 2018/1/31.
 */
console.log('DdzMsgFactory.js loaded');

ddz.NetWorkCenter = {
    canNotLeave : false,

    boot : function () {
        this._TAG = 'ddz.ClsNetWorkCenter';
        ddz.LOGD(this._TAG, 'boot');

        this.cmdMap = {};
        this.cmdMap[ddz.EventType.MSG_HALL_INFO] = this.onHallInfo;
        this.cmdMap[ddz.EventType.MSG_TABLE_QUICKSTART] = this.onQuickStart;
        this.cmdMap[ddz.EventType.MSG_TABLE_TABLEINFO] = this.onTableInfo;
        this.cmdMap[ddz.EventType.MSG_ROOM] = this.onRoom;
        this.cmdMap[ddz.EventType.MSG_GAME] = this.onGame;
        this.cmdMap[ddz.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[ddz.EventType.CMD_DIZHU] = this.onDiZhuMsg;
        this.cmdMap[ddz.EventType.CMD_ROOM_LEAVE] = this.onRoomLeave;
        this.cmdMap[ddz.EventType.HALL_SHARE2] = this.onShare2;
        this.cmdMap[ddz.EventType.CMD_TABLE_CHAT] = this.onTableChat;
        this.cmdMap[ddz.EventType.MSG_TODO_TASKS] = this.onTodoTask;
        this.cmdMap[ddz.EventType.MSG_TABLE_LEAVE] = this.onTableLeave;

        // this.cmdMap[ddz.EventType.MSG_CASH] = this.onCash;

        this.cmdMap[ddz.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;

        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);

    },
    onReceiveUserInfo : function(value){
        if (typeof(value) == 'undefined') {
            return;
        }
        hall.ME.parseUserInfoDDZ(value);
        ty.NotificationCenter.trigger(ty.EventType.UPDATE_UER_INFO, hall.ME);
        // 刷新金币
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COIN_NUMBER);
    },

    shut:function () {
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
    },

    onDiZhuMsg:function (argument) {
        ddz.friendModel.parseDiZhuInfo(argument);
    },

    onTableChat:function (msg) {
        ddz.tableChatModel.parseTableChat(msg);
    },

    //当你离开比赛桌的时候，可能会返回这个信息，这个与实际逻辑相关
    onTableLeave: function(argument) {
        // {"cmd":"table_leave","result":{"gameId":6,"roomId":60191001,"tableId":601910010006,"userId":10050,"reason":0}}

        if (argument.result.reason == 0){
            ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
            // hall.GlobalFuncs.gotoDdz();
            hall.GlobalFuncs.gotoRoomListScene();
        }
        else if (argument.result.reason == -1){
            hall.MsgBoxManager.showToast({title:'牌局已开始，请打完本局。'});
        }
    },

    onTodoTask: function(value) {
        if (value && value["result"]) {
            hall.gameWorld.model.m_todoTask.parseTodoTask(value["result"]);
        }
    },

    onShare2:function (msg) {

        if (msg.result.action == ddz.EventType.GET_REWARD){
            // {"cmd":"hall_share2","result":{"action":"get_reward","gameId":6,"userId":10008,"rewards":[]}}
            //获得奖励回调
            if (ddz.waitGetRevial && ddz.waitGetRevial.type == 'waitRecive' && msg.result.rewards.length > 0){
                ddz.waitGetRevial.curCount++;// 钻石数量达到标准就复活
                if (ddz.waitGetRevial.curCount == ddz.waitGetRevial.needCount){
                    ddz.waitGetRevial = {
                        type : 'back'
                    };
                }
                var curWait = ddz.matchModel.getCurWaitInfo();
                if (curWait && curWait.newUserProtect >= 0){
                    if(ddz.matchResultPanel){
                        ddz.matchResultPanel.shut();
                    }
                    ddz.matchModel.matchBack();
                    ddz.waitGetRevial = null;
                }
            }else if(msg.result.rewards.length > 0) {
                hall.LOGE("=="," file = [DdzNETWorkCenter] fun = [onShare2] ");
                ty.NotificationCenter.trigger(ty.EventType.GET_DIAMOND);
            }
        }
        else if (msg.result.action == ddz.EventType.CHECK_REWARD){
            //检查当前分享点是否还有奖励
            var data = {};
            data.leftCount = msg.result.leftCount;
            data.pointId = msg.result.pointId;
            ty.NotificationCenter.trigger(ty.EventType.UPDATE_BUTTON_TEXT, data);
        }
    },

    onRoomLeave:function (msg) {
        // {"cmd":"room_leave","result":{"reason":-1,"gameId":6,"roomId":60121001,"userId":10197}}
        if (msg.result.reason == -1) return; //-1不处理

        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
        if(this.canNotLeave){
            ty.NotificationCenter.trigger(ddz.EventType.ACTION_CAN_ROOM_LEAVE);
        }else {
            var curScene = cc.director.getScene();
            var tableScene = curScene.children[0].getComponent('DdzTableScene');
            if(tableScene && tableScene.tableInfo().getSceneType() == ddz.Enums.SceneType.NORMAL){
                hall.GlobalFuncs.gotoRoomListScene();
            }
            else{
                if (hall.GlobalFuncs && hall.GlobalFuncs.gotoDdz)
                    hall.GlobalFuncs.gotoDdz();
            }

            this.canNotLeave = false;
        }
    },

    /**
     * 收到TCP消息
     */
    onReceiveTCP_Msg : function(value){
        var msgCmd = value.cmd;
        // if(msgCmd == 'table_info'){
        //     this.haveTableInfo = true;
        // }
        // if(msgCmd == 'table_call'){
        //     if(this.haveTableInfo){
        //         hall.onHide = true;
        //         var date = new Date().getTime();
        //         hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.ONHIDE_DATE, date);
        //         ty.NotificationCenter.trigger(ddz.EventType.GAME_HIDE);
        //         ty.TCP.close();
        //     }
        // }
        var result = value.result;
        if (result){
            var gameId = result.gameId;
            if (gameId === ty.SystemInfo.gameId){
                //游戏消息在这里处理
                var func = this.cmdMap[msgCmd];
                if (func){
                    func.call(this, value);
                }
                else{
                    ty.NotificationCenter.trigger(msgCmd, value);
                    ddz.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }
        }
    },

    onHallInfo : function (val) {
        //解析Hall_info,本地缓存
        // ddz.HallInfoModel.parseHallInfo(val.result);
        // var data = argument[0]['result'];
        hall.gameWorld.parseNormalRooms(val.result);
        ddz.gameModel.getMatchList();

        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_HALL_INFO);
    },

    onQuickStart: function(argument) {
        var result = argument["result"];
        var success = result["isOK"] === true;
        if (success) {
            if (typeof(result["roomId"]) != 'undefined' && result["roomId"] != 0) {
                ddz.quickStartModel.parse(argument);
                hall.GlobalFuncs.gotoDdzTable();
            }
        } else {
            var curScene = cc.director.getScene();
            if (curScene.name == "RoomListScene"){
                // 当前正在房间列表,会有别的相应的提示窗,
            }else {
                hall.MsgBoxManager.showToast({title : '进入房间失败'});
            }
        }
    },

    /**
     * 关于table_info 消息,如果是第一次进桌,table_info,会比较慢的来,如果是断线重连,基本会和quick_start消息同时来
     * 这里,还没有来得及创建牌桌,会造成消息丢失,这个消息要进行缓存。
     * @param argument
     */
    onTableInfo: function(argument) {
        ddz.tableInfoModel.parse(argument)
    },

    onRoom: function(argument) {
        ddz.matchModel.parse(argument)
    },

    onGame: function(argument) {
        ddz.gameModel.parseGame(argument)
    },
    // onCash : function (argument) {
    //     ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CASH_RESULT,argument);
    // },
    onUpdateChangedData: function(argument) {
        hall.LOGD(this._TAG, "onUpdateGold -------------------------");
        //解析数据
        if (typeof(argument) != 'undefined') {
            //hall.ME.parseUserInfo(argument[0]);
            var result = argument["result"];
            if (typeof(result) != 'undefined' && typeof(result['changes']) != 'undefined') {
                var gameId = result.gameId;
                hall.LOGD(this._TAG, 'gameid = ' + gameId);
                for (var i = 0; i < result['changes'].length; i++) {
                    var curValue = result["changes"][i];
                    if (typeof(curValue) == 'undefined') {
                        continue;
                    }

                    if (curValue == 'gdata') {
                        hall.LOGD(this._TAG, "update_notify,更新gdata");
                        hall.MsgFactory.getGameData(gameId);
                    } else if (curValue == 'item') {
                        hall.LOGD(this._TAG, "update_notify,更新道具");
                        hall.MsgFactory.getBagInfo();
                    }
                    //金币，钻石
                    else if (curValue == "udata") {
                        hall.LOGD(this._TAG, "update_notify,更新钻石金币");
                        hall.MsgFactory.getUserInfo(gameId);
                    }
                }
            }
        }
    }
};

ddz.NetWorkCenter.boot();