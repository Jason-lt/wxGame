(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/shot/msg_handler/ShotNetWorkCenter.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e42abORGrJHA4ELaUbtnFDM', 'ShotNetWorkCenter', __filename);
// Script/shot/msg_handler/ShotNetWorkCenter.js

'use strict';

/**
 * Created by zhangman on 2018/6/6.
 */
console.log('JumpMsgFactory.js loaded');
require('JumpEventType');
shot.NetWorkCenter = {
    canNotLeave: false,

    boot: function boot() {
        this._TAG = 'shot_NetWorkCenter';
        shot.LOGD(this._TAG, 'boot');

        this.cmdMap = {};

        this.cmdMap[shot.EventType.MSG_GAME] = this.onGame;
        this.cmdMap[shot.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[shot.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        this.cmdMap[shot.EventType.HALL_SHARE2] = this.onShare2;
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
    },
    onReceiveUserInfo: function onReceiveUserInfo(value) {
        if (typeof value == 'undefined') {
            return;
        }
        hall.ME.parseUserInfo(value);
        // ty.NotificationCenter.trigger(ty.EventType.UPDATE_UER_INFO, hall.ME);
    },

    onUpdateChangedData: function onUpdateChangedData(argument) {
        //解析数据
        if (typeof argument != 'undefined') {
            //hall.ME.parseUserInfo(argument[0]);
            var result = argument["result"];
            if (typeof result != 'undefined' && typeof result['changes'] != 'undefined') {
                var gameId = result.gameId;
                hall.LOGD(this._TAG, 'gameid = ' + gameId);
                for (var i = 0; i < result['changes'].length; i++) {
                    var curValue = result["changes"][i];
                    if (typeof curValue == 'undefined') {
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

    shut: function shut() {
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
    },

    onTodoTask: function onTodoTask(value) {
        if (value && value["result"]) {
            // hall.gameWorld.model.m_todoTask.parseTodoTask(value["result"]);
        }
    },

    onShare2: function onShare2(msg) {
        hall.LOGW("", "file = [shotNetWrokCenter] fun = [onShare2] msg = " + JSON.stringify(msg));
        if (msg.result.action == shot.EventType.GET_REWARD) {
            // {"cmd":"hall_share2","result":{"action":"get_reward","gameId":6,"userId":10008,"rewards":[]}}
            //获得奖励回调
            if (shot.waitGetRevial && shot.waitGetRevial.type == 'waitRecive' && msg.result.rewards.length > 0) {
                shot.gameModel.consumeAssets(1, "item:1373");
                shot.waitGetRevial = null;
            } else if (msg.result.rewards.length > 0) {
                var _count = 1;
                if (msg.result.rewards[0].count) {
                    _count = msg.result.rewards[0].count;
                    if (msg.result.rewards[0].itemId == "item:1371") {
                        shot.GlobalFuncs.playGetPropBoxAni(0, _count);
                    } else if (msg.result.rewards[0].itemId == "item:1372") {
                        shot.GlobalFuncs.playGetPropBoxAni(1, _count);
                    } else if (msg.result.rewards[0].itemId == "item:1390") {
                        shot.GlobalFuncs.playGetPropBoxAni(2, _count);
                        shot.gameModel.checkRewardWithSharePoint(shot.Share.SharePointType.getFreeTool);
                    } else if (msg.result.rewards[0].itemId == "item:1373") {
                        hall.MsgBoxManager.showToast({ title: '成功获得1颗钻石' });
                    }
                }
            }
        } else if (msg.result.action == shot.EventType.CHECK_REWARD) {
            ty.NotificationCenter.trigger(shot.EventType.GET_CHECK_REWARD, msg.result);
            //检查当前分享点是否还有奖励
            //{"cmd":"hall_share2","result":{"action":"check_reward","gameId":6,"userId":10042,"pointId":67890009,"leftCount":0}}
        }
    },

    /**
     * 收到TCP消息
     */
    onReceiveTCP_Msg: function onReceiveTCP_Msg(value) {
        var msgCmd = value.cmd;
        var result = value.result;
        if (result) {
            var gameId = result.gameId;
            if (gameId === ty.SystemInfo.gameId) {
                //游戏消息在这里处理
                var func = this.cmdMap[msgCmd];
                if (func) {
                    func.call(this, value);
                } else {
                    ty.NotificationCenter.trigger(msgCmd, value);
                    shot.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
                }
            }
        }
    },

    onGame: function onGame(argument) {
        hall.LOGD("hello", "parseGame");
        shot.gameModel.parseGame(argument);
    }
};

shot.NetWorkCenter.boot();

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
        //# sourceMappingURL=ShotNetWorkCenter.js.map
        