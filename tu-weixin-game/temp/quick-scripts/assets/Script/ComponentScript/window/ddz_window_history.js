(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_window_history.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a1a30IOmCZHuoieVgiyn9to', 'ddz_window_history', __filename);
// Script/ComponentScript/window/ddz_window_history.js

"use strict";

/**
 * 战绩
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._TAG = "ddz_window_history";
    },

    properties: {

        bgBtn: {
            default: null,
            type: cc.Button
        },

        closeBtn: {
            default: null,
            type: cc.Button
        },

        tableView: cc.Node,
        noRecordTips: cc.Label,
        LoadTips: cc.Node
    },

    onLoad: function onLoad() {
        ddz.LOGD("", "file = [ddz_window_history] fun = [onLoad] ");
        this.bgBtn.node.active = true;
        this.closeBtn.node.on("click", this.closeGameHistory, this);
        // this.createHistory();
    },

    createHistory: function createHistory() {
        this.LoadTips.active = false;
        var historyDdata = ddz.historyModel.getHistoryData();
        if (historyDdata.length <= 0) {
            this.noRecordTips.node.active = true;
            return;
        }
        this.noRecordTips.node.active = false;
        var resultArr = [];
        for (var i = 0; i < historyDdata.length; i++) {
            var addMap = {};
            addMap.avatars = ddz.historyModel.getAvatars(i);
            addMap.timeS = ddz.historyModel.getTimer(i);
            addMap.titleS = ddz.historyModel.getPlayMode(i);
            addMap.score = ddz.historyModel.getScore(i) + "分";
            resultArr.push(addMap);
        }
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(resultArr);
    },

    closeGameHistory: function closeGameHistory() {
        ddz.LOGD("", "file = [ddz_window_history] fun = [closeGameDetail] ");
        this.bgBtn.node.active = false;
        this.node.destroy();
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
        //# sourceMappingURL=ddz_window_history.js.map
        