/**
 * Created by zhangman on 2018/6/6.
 */
console.log('doubleMsgFactory.js loaded');
require('doubleEventType');
double.NetWorkCenter = {
    canNotLeave : false,

    boot : function () {
        this._TAG = 'double_NetWorkCenter';
        double.LOGD(this._TAG, 'boot');

        this.cmdMap = {};

        this.cmdMap[double.EventType.MSG_GAME] = this.onGame;
        this.cmdMap[double.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[double.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        this.cmdMap[double.EventType.HALL_SHARE2] = this.onShare2;
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
    },
    onReceiveUserInfo : function(value){
        if (typeof(value) == 'undefined') {
            return;
        }
        hall.ME.parseUserInfo(value);
        // ty.NotificationCenter.trigger(ty.EventType.UPDATE_UER_INFO, hall.ME);
    },

    onUpdateChangedData : function(argument){
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

    shut:function () {
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
    },

    onTodoTask: function(value) {
        if (value && value["result"]) {
            // hall.gameWorld.model.m_todoTask.parseTodoTask(value["result"]);
        }
    },

    onShare2:function (msg) {
        hall.LOGW("","file = [doubleNetWrokCenter] fun = [onShare2] msg = " + JSON.stringify(msg));
        if (msg.result.action == double.EventType.GET_REWARD){
            // {"cmd":"hall_share2","result":{"action":"get_reward","gameId":6,"userId":10008,"rewards":[]}}
            //获得奖励回调
            if (double.waitGetRevial && double.waitGetRevial.type == 'waitRecive' && msg.result.rewards.length > 0){
                double.gameModel.consumeAssets(1,"item:1373");
                double.waitGetRevial = null;
            }else if(msg.result.rewards.length > 0) {
                var _count = 1;
                if (msg.result.rewards[0].count) {
                    _count = msg.result.rewards[0].count;
                    if (msg.result.rewards[0].itemId == "item:1371") {
                        double.GlobalFuncs.playGetPropBoxAni(0,_count);
                    }else if (msg.result.rewards[0].itemId == "item:1372") {
                        double.GlobalFuncs.playGetPropBoxAni(1,_count);
                    }else if (msg.result.rewards[0].itemId == "item:1390") {
                        double.GlobalFuncs.playGetPropBoxAni(2,_count);
                        double.gameModel.checkRewardWithSharePoint(double.Share.SharePointType.getFreeTool);
                    }else if (msg.result.rewards[0].itemId == "item:1373") {
                        hall.MsgBoxManager.showToast({title:'成功获得1颗钻石'});
                    }
                }
            }
        }
        else if (msg.result.action == double.EventType.CHECK_REWARD){
            ty.NotificationCenter.trigger(double.EventType.GET_CHECK_REWARD,msg.result);
            //检查当前分享点是否还有奖励
            //{"cmd":"hall_share2","result":{"action":"check_reward","gameId":6,"userId":10042,"pointId":67890009,"leftCount":0}}
        }
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
                    double.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }
        }
    },

    onGame: function(argument) {
        hall.LOGD("hello","parseGame");
        double.gameModel.parseGame(argument);
    }
};

double.NetWorkCenter.boot();