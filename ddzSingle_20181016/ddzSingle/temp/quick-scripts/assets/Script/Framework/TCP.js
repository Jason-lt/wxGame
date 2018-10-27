(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Framework/TCP.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '22b836X3FhKRqW9C3TDzUSK', 'TCP', __filename);
// Script/Framework/TCP.js

'use strict';

/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 长连接管理器
 */
console.log("TCP loaded");
var noShowLogMsgs = ['room_online_info', 'heart_beat'];
var setTCP_FAIL = function setTCP_FAIL() {
    // ddz.msgCache.blocked = true;
    ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_FAIL;
};

ty.TCP = {

    CONNECT_STATUS_OK: 1,
    CONNECT_STATUS_OPENING: 2,
    CONNECT_STATUS_CLOSING: 3,
    CONNECT_STATUS_FAIL: 0,
    connectStatus: 0,
    isTimerInited: false,
    tickCount: 0,

    connect: function connect(url) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Start, [url]);
        var self = this;
        if (ty.TCP.connectStatus == ty.TCP.CONNECT_STATUS_OK) {
            return;
        }

        if (ty.TCP.connectStatus == ty.TCP.CONNECT_STATUS_OPENING) {
            return;
        }

        ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_OPENING;
        wx.connectSocket({
            url: url
        });

        wx.onSocketOpen(function (res) {
            hall.LOGD(null, 'TCP webSocket opened...');
            ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_OK;

            ty.NotificationCenter.trigger(ty.EventType.TCP_OPENED);

            if (!ty.TCP.isTimerInited) {
                ty.TCP.isTimerInited = true;
            }

            //定时发送心跳
            ty.Timer.setTimer(cc.director, self.timerSchedule, 1);
        });

        wx.onSocketError(function (res) {
            hall.LOGD(null, 'TCP webSocket error...');

            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
            // var window = no.getComponent("Ddz");
            // window.testWithString(JSON.stringify(res));
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Failed, [url]);

            setTCP_FAIL();
            ty.NotificationCenter.trigger(ty.EventType.TCP_ERROR);
        });

        wx.onSocketClose(function (res) {
            hall.LOGD(null, 'WebSocket 已关闭！');
            setTCP_FAIL();
            ty.NotificationCenter.trigger(ty.EventType.TCP_CLOSE);
        });

        wx.onSocketMessage(function (res) {
            if (hall.onHide) {
                //切后台不再处理消息
                return;
            }
            // 处理长连接的消息
            // hall.LOGD(null, 'TCP receive MSG:' + JSON.stringify(res));
            var content = self.decodeMessage(res["data"]);

            if (content == null || content == '0000') {
                // hall.LOGD(null, 'get he87654artbeat msg');
                return;
            }

            var time = new Date();
            var msgStr = time + "[Receive TCP Msg]: " + unescape(content.replace(/\\u/gi, '%u'));

            var strJson = content.substr(0, content.length - 0);
            if (strJson != null && strJson.length > 0) {
                var _json = JSON.parse(strJson);
                if (noShowLogMsgs.indexOf(_json.cmd) == -1) {
                    hall.LOGD(null, msgStr);
                }

                // if (ddz.msgCache.blocked){
                ddz.msgCache.pushMsg(_json);
                // }
                // else{
                //     self.triggerMsg(_json);
                // }
            }
        });
    },

    triggerMsg: function triggerMsg(msg) {
        if (msg.cmd == ddz.EventType.MSG_LED) {
            msg.result.gameId = 9999;
        }
        ty.NotificationCenter.trigger(ty.EventType.TCP_RECEIVE, msg);
    },

    decodeMessage: function decodeMessage(data) {
        if (typeof ArrayBuffer != 'undefined' && data instanceof ArrayBuffer) {
            var databytes = new Uint8Array(data);
            var content = '';
            for (var i = 0, len = databytes.length; i < len; i++) {
                var tmpc = String.fromCharCode(databytes[i]);
                content += tmpc;
            }
            return content;
        }
        var data = hall.GlobalFuncs.base64decodeRaw(data);
        var mask = data.slice(0, 4);
        data = data.slice(4);
        for (var i = 0, len = data.length; i < len; i++) {
            var charcode = data[i];
            charcode ^= mask[i % 4];
            data[i] = charcode;
        }
        var result = hall.GlobalFuncs._utf8_decode(data);
        return result;
    },

    timerSchedule: function timerSchedule() {
        ty.TCP.tickCount = (ty.TCP.tickCount + 1) % 3;
        if (ty.TCP.tickCount == 2) {
            // 发送心跳
            hall.MsgFactory.sendHeartBeat();
        }

        // 每2秒检查一下长连接，如果不通，则重连。
        ty.TCP.reConnet();
    },

    reConnet: function reConnet() {
        if (hall.onHide) {
            //在后台不生连(IOS会出问题)
            return;
        }
        if (ty.TCP.connectStatus == ty.TCP.CONNECT_STATUS_FAIL) {
            ty.NotificationCenter.trigger(ty.EventType.TCP_RECONNECT);
            ty.TCP.connect(ty.SystemInfo.webSocketUrl);
        }
    },

    sendMsg: function sendMsg(data) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) {
            return;
        }

        var msgStr = JSON.stringify(data);
        if (noShowLogMsgs.indexOf(data.cmd) == -1) {
            var time = new Date();
            hall.LOGD(time, 'TCP sendMsg:' + msgStr);
        }

        wx.sendSocketMessage({
            data: msgStr,
            success: function success(params) {
                // hall.LOGD(null, 'TCP sendMsg success:' + JSON.stringify(arguments));
            },

            fail: function fail(params) {
                var errMsg = arguments[0];
                if (errMsg && errMsg['errMsg'] === 'sendSocketMessage:fail taskID not exist') {
                    wx.closeSocket();
                    setTCP_FAIL();
                }
                hall.LOGD(null, 'TCP sendMsg fail:' + JSON.stringify(arguments));
            },

            complete: function complete(params) {}
        });
    },

    close: function close() {
        ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_CLOSING;
        wx.closeSocket();
        setTCP_FAIL();
        hall.LOGD(null, 'TCP close..............');
    }
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
        //# sourceMappingURL=TCP.js.map
        