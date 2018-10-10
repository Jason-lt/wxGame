(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/EventType.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c2bc81HIvFA6rW9Zu6WZZhH', 'EventType', __filename);
// Script/Framework/EventType.js

'use strict';

console.log("EventType loaded");
ty.EventType = {
    // 网络消息，客户端发给server的叫 CMD_XXX, server 发给客户端的叫 MSG_XXX
    // 把所有的消息名字写到这里，防止写到各个文件内时，引起的混乱

    // tcp状态的事件
    TCP_ERROR: 'tcp_error',
    TCP_CLOSE: 'tcp_close',
    TCP_OPENED: 'tcp_opened', // 连接建立好之后的回调
    TCP_RECONNECT: 'tcp_reconnect',
    TCP_RECEIVE: 'tcp_receive', //长连接接收任何消息的事件

    HEART_BEAT_LOGIC: 'heart_beat_logic', //  心跳逻辑
    HEART_BEAT: 'heart_beat', //  心跳

    MSG_LOG_OUT: 'logout',

    CMD_USER_INFO: 'user_info',
    CMD_BIND_USER: 'bind_user', // 返回user_info

    GET_AD_MSG_SUCCESS: "GET_AD_MSG_SUCCESS" //获取交叉导流信息

    // GET_SHARE_SINGLE_CONFIG_SUCCESS : "GET_SHARE_SINGLE_CONFIG_SUCCESS"
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
        //# sourceMappingURL=EventType.js.map
        