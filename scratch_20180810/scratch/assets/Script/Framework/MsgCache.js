/**
 * 消息缓存类,用来缓存table_info之后来的消息,table_info来之后,牌桌新创建的时候,耗时比较长,会导致丢消息,要用缓存来缓住。
 * Created by xujing on 2018/4/15.
 */
scratch.msgCache = {

    //主要是缓存打牌的消息
    needCacheMsg:{
        'table_call:ready' : null,
        'table_call:game_ready' : null,
        'table_call:next' : null,
        'table_call:smilies' : null,
        'table_call:call': null,
        'table_call:game_start': null,
        'table_call:card': null,
        'table_call:rb': null,
        'table_call:game_win': null,
        'table_call:wild_card': null
    },

    blocked:true, //阻拦状态
    msgQueue : [

    ],

    /**
     * 添加消息到缓存队列
     * @param msg
     */
    pushMsg:function (msg) {
        var msgKey = msg.cmd;
        if (msg.result && msg.result.action){
            msgKey = msgKey + ':' + msg.result.action;
        }
        if (this.needCacheMsg.hasOwnProperty(msgKey)){
            this.msgQueue.push(msg);
        }
        else{
            ty.TCP.triggerMsg(msg);
        }
    },

    dump:function () {
        while (this.msgQueue.length > 0){
            var msg = this.msgQueue.shift();
            ty.TCP.triggerMsg(msg);
        }
        this.blocked = false;
    }
};