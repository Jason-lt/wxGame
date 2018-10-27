(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/utils/GlobalTimer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '05ecdFzSD5K/qeUrV0azxaI', 'GlobalTimer', __filename);
// Script/hall/utils/GlobalTimer.js

"use strict";

/**
 * Created by xujing on 2018/4/20.
 */
hall.GlobalTimer = {

    boot: function boot() {
        this.MAX_COUNT = 30; //每30秒修正一次时间
        this._curCounter = 0;
        this._curTime = new Date().getTime() / 1000;
        ty.NotificationCenter.listen(ddz.EventType.GET_TIMESTAMP, this.updateTime, this);
        var that = this;
        hall.MsgFactory.getTimeStamp();
        ty.Timer.setTimer(cc.director, function () {
            that._curCounter++;
            that._curTime += 1;
            if (that._curCounter >= that.MAX_COUNT) {
                that._curCounter = 0;
                hall.MsgFactory.getTimeStamp();
            }
        }, 1);
    },

    getCurTime: function getCurTime() {
        return this._curTime;
    },

    /**
     * 获取当前天
     * @returns {string} 当前天,格式2018-4-21
     */
    getCurDay: function getCurDay() {
        var date = new Date(this._curTime * 1000);
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var dataStr = fullYear + "-" + month + "-" + day;

        ddz.LOGD(hall.GlobalTimer, "今天是:" + dataStr);
        return dataStr;
    },

    /**
     * 获取当前天
     * @returns {string} 当前天,格式[2018,7,19]
     */
    getCurDayList: function getCurDayList() {
        var date = new Date(this._curTime * 1000);
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var dataList = [fullYear, month, day];

        return dataList;
    },

    /**
     * 获取当前时
     * @returns {string} 当前时,格式2018-4-21
     */
    getCurHours: function getCurHours() {
        var date = new Date(this._curTime * 1000);
        var hour = date.getHours();
        var dataStr = hour + "";
        ddz.LOGD(hall.GlobalTimer, "现在是:" + dataStr + "点");
        return dataStr;
    },

    getCurLastSecond: function getCurLastSecond() {
        var toDaySecond = parseInt((this._curTime - 1523203200) % (24 * 3600));
        return 24 * 3600 - toDaySecond;
    },

    updateTime: function updateTime(timeObj) {
        // var timeObj = {
        //     "cmd":"user",
        //     "result":{
        //         "action":"sync_timestamp",
        //         "gameId":9999,
        //         "userId":10197,
        //         "current_ts":1524291824
        //     }
        // };
        ddz.LOGD(hall.GlobalTimer, "时间校准。。。");
        this._curTime = timeObj.current_ts;
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
        //# sourceMappingURL=GlobalTimer.js.map
        