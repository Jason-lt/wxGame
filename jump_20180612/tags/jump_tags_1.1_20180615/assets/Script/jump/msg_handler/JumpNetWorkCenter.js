/**
 * Created by zhangman on 2018/6/6.
 */
console.log('JumpMsgFactory.js loaded');
require('JumpEventType');
jump.NetWorkCenter = {
    canNotLeave : false,

    boot : function () {
        this._TAG = 'jump.NetWorkCenter';
        jump.LOGD(this._TAG, 'boot');

        this.cmdMap = {};

        this.cmdMap[jump.EventType.MSG_GAME] = this.onGame;
        this.cmdMap[jump.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        // this.cmdMap[jump.EventType.HALL_SHARE2] = this.onShare2;
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
    },
    onReceiveUserInfo : function(value){
        if (typeof(value) == 'undefined') {
            return;
        }
        hall.ME.parseUserInfo(value);
        // ty.NotificationCenter.trigger(ty.EventType.UPDATE_UER_INFO, hall.ME);
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

        // if (msg.result.action == jump.EventType.GET_REWARD){
        //
        // }
        // else if (msg.result.action == jump.EventType.CHECK_REWARD){
        // }
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
                    jump.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }
        }
    },

    onGame: function(argument) {
        hall.LOGD("hello","parseGame");
        jump.gameModel.parseGame(argument);
    }
};

jump.NetWorkCenter.boot();