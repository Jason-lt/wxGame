(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_notify_cell.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2367c6jG8hBsZkxFtqoo7gU', 'ddz_notify_cell', __filename);
// Script/ComponentScript/component/ddz_notify_cell.js

'use strict';

/*
    通知公告cell
 */

cc.Class({
    extends: cc.Component,

    properties: {
        detailLabel: {
            default: null,
            type: cc.Label
        },

        timerLabel: {
            default: null,
            type: cc.Label
        },
        bgBtn: {
            default: null,
            type: cc.Button
        },

        newNotify: cc.Node,
        readNotify: cc.Node,

        // noticeWindow : {
        //     default : null,
        //     type : cc.Prefab
        // },
        resultMap: {}

    },
    addDataWithObject: function addDataWithObject(objc) {
        this.setDetailInformation(objc);
    },
    setDetailInformation: function setDetailInformation(resultMap) {
        this.detailLabel.string = resultMap.versions;
        this.timerLabel.string = resultMap.timer;
        // this.content = resultMap.content;


        this.resultMap = resultMap;
        // var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        //
        // var indexList = JSON.parse(indexStr);
        // // 缓存内容超过 60 条后清空通告本地缓存,删除最先30条缓存数据
        // if (indexList.length > 60){
        //     indexList.splice(0,indexList.length - 30);
        //     hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
        // }
        // this.setIsRead(!(indexList.indexOf(this.resultMap.index) == -1));

        if (this.resultMap.msgid) {
            if (this.resultMap.get == null) {
                this.setIsRead(false);
            } else {
                this.setIsRead(this.resultMap.get == 1);
            }
        } else {
            this.setIsRead(resultMap.readed);
        }
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COMMON_CONFIG, this.changeState, this);
    },
    changeState: function changeState(readIndex) {
        if (this.resultMap.index != null && this.resultMap.index == readIndex) {
            this.setIsRead(true);
        }
    },
    setIsRead: function setIsRead(isRead) {
        this.newNotify.active = !isRead;
        this.readNotify.active = isRead;
    },

    onClickBgBtn: function onClickBgBtn() {
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
            var window = preFabNode.getComponent('ddz_notifyWindow');
            window.setDetailTypeWithInfoMap(that.resultMap, "cell");
        });

        // if (this.resultMap.msgid) {
        //     hall.MsgFactory.getMessageReward(this.resultMap.msgid);
        //     ddz.gameModel.messageRewardTitle = this.resultMap.versions;
        // }

        var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        var indexList = JSON.parse(indexStr);
        if (indexList.indexOf(this.resultMap.index) == -1) {
            this.resultMap.readed = 1;
            indexList.push(this.resultMap.index);
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
            if (!this.resultMap.msgid) {
                ddz.gameModel.notifyInfo.unReadCount--;
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG);
            }
            this.setIsRead(true);
        }
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        ddz.gameModel.messageRewardTitle = "";
    }
});

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
        //# sourceMappingURL=ddz_notify_cell.js.map
        