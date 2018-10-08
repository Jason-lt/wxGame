/**
 * Created by xujing on 2018/1/31.
 */
console.log('DdzMsgFactory.js loaded');

ddz.NetWorkCenter = {
    boot : function () {
        this._TAG = 'ddz.ClsNetWorkCenter';
        ddz.LOGD(this._TAG, 'boot');

        this.cmdMap = {};
        this.cmdMap[ddz.EventType.MSG_HALL_INFO] = this.onHallInfo;
        this.cmdMap[ddz.EventType.MSG_TABLE_QUICKSTART] = this.onQuickStart;
        this.cmdMap[ddz.EventType.MSG_TABLE_TABLEINFO] = this.onTableInfo;
        this.cmdMap[ddz.EventType.MSG_ROOM] = this.onRoom;
        this.cmdMap[ddz.EventType.MSG_GAME] = this.onGame;

        this.cmdMap[ddz.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;

        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);

    },

    shut:function () {
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
    },

    /**
     * 收到TCP消息
     */
    onReceiveTCP_Msg : function(value){
        var msgCmd = value.cmd;
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
        ddz.matchModel.getMatchList();

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
            hall.MsgBoxManager.showToast({title : '进入房间失败'});
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
        ddz.matchModel.parseGame(argument)
    },
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
    },
};

ddz.NetWorkCenter.boot();