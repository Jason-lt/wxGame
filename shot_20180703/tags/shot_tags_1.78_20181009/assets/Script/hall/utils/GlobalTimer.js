/**
 * Created by xujing on 2018/4/20.
 */
hall.GlobalTimer = {

    boot:function () {
        this.MAX_COUNT = 30; //每30秒修正一次时间
        this._curCounter = 0;
        this._curTime = new Date().getTime()/1000;
        ty.NotificationCenter.listen(shot.EventType.GET_TIMESTAMP, this.updateTime, this);
        var that = this;
        hall.MsgFactory.getTimeStamp();
        ty.Timer.setTimer(cc.director, function () {
            that._curCounter++;
            that._curTime += 1;
            if (that._curCounter >= that.MAX_COUNT){
                that._curCounter = 0;
                hall.MsgFactory.getTimeStamp();
            }
        }, 1);
    },

    getCurTime:function () {
        return this._curTime;
    },

    /**
     * 获取当前天
     * @returns {string} 当前天,格式2018-4-21
     */
    getCurDay:function () {
        var date = new Date(this._curTime * 1000);
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var dataStr = fullYear + "-" + month + "-" + day;

        shot.LOGD(hall.GlobalTimer, "今天是:" + dataStr);
        return dataStr;
    },
    /**
     * 获取当前时
     * @returns {string} 当前时,格式2018-4-21
     */
    getCurHours:function () {
        var date = new Date(this._curTime * 1000);
        var hour = date.getHours();
        var dataStr = hour + "";
        shot.LOGD(hall.GlobalTimer, "现在是:" + dataStr + "点");
        return dataStr;
    },

    getCurLastSecond : function () {
        var toDaySecond = parseInt((this._curTime-1523203200)%(24*3600));
        return 24*3600 - toDaySecond;
    },

    updateTime:function (timeObj) {
        shot.LOGD(hall.GlobalTimer, "时间校准。。。");
        this._curTime = timeObj.current_ts;
    },

    getCurWeek : function () {
        var week = parseInt((this._curTime-1523203200)/(7*24*3600));
        shot.GlobalFuncs.upDateRankDataWeek(week+"");
        return week;
    }
};