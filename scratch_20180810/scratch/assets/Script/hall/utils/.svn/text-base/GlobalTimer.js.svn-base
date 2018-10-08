/**
 * Created by xujing on 2018/4/20.
 */
hall.GlobalTimer = {

    boot:function () {
        this.MAX_COUNT = 30; //每30秒修正一次时间
        this._curCounter = 0;
        this._curTime = new Date().getTime()/1000;
        ty.NotificationCenter.listen(scratch.EventType.GET_TIMESTAMP, this.updateTime, this);
        // var that = this;
        hall.MsgFactory.getTimeStamp();
        window.setInterval(this.sendTimeStamp,1000);
        // ty.Timer.setTimer(cc.director, function () {
        //     that._curCounter++;
        //     that._curTime += 1;
        //     if (that._curCounter >= that.MAX_COUNT){
        //         that._curCounter = 0;
        //         hall.MsgFactory.getTimeStamp();
        //     }
        // }, 1);

        this.resultString = "";
        this.hours = 0;
        this.second = 0;
        this.minis = 0;
    },

    sendTimeStamp : function () {
        hall.GlobalTimer._curCounter++;
        hall.GlobalTimer._curTime += 1;
        if (hall.GlobalTimer._curCounter >= hall.GlobalTimer.MAX_COUNT){
            hall.GlobalTimer._curCounter = 0;
            hall.MsgFactory.getTimeStamp();
        }
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

        hall.LOGD(hall.GlobalTimer, "今天是:" + dataStr);
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
        hall.LOGD(hall.GlobalTimer, "现在是:" + dataStr + "点");
        return dataStr;
    },

    getCurLastSecond : function () {
        var toDaySecond = parseInt((this._curTime-1523203200)%(24*3600));
        return 24*3600 - toDaySecond;
    },
    //剩余时间 00:00:00
    getCurLastTime : function () {
        var second = hall.GlobalTimer.getCurLastSecond();
        // if(second < 350008){
        //     scratch.gameModel.getUserInfoForScratch();
        // }
        if(second > 86396){
            scratch.gameModel.getUserInfoForScratch();
        }
        this.resultString = "";
        this.hours = parseInt(second/(3600));
        if(this.hours == 0){
            this.resultString = this.resultString+"00";
        }else if(this.hours < 10){
            this.resultString = this.resultString+"0"+this.hours;
        }else {
            this.resultString = this.resultString + this.hours;
        }
        this.second = parseInt((second%(3600))/60);
        if(this.second == 0){
            this.resultString = this.resultString+":00";
        }else if(this.second < 10){
            this.resultString = this.resultString+":0"+this.second;
        }else {
            this.resultString = this.resultString+ ":"+this.second;
        }
        this.minis = (second%(3600))%60;
        if(this.minis == 0){
            this.resultString = this.resultString+":00";
        }else if(this.minis < 10){
            this.resultString = this.resultString+":0"+this.minis;
        }else {
            this.resultString = this.resultString+ ":"+this.minis;
        }
        return this.resultString;
    },

    updateTime:function (timeObj) {
        hall.LOGD(hall.GlobalTimer, "时间校准。。。");
        this._curTime = timeObj.current_ts;
    },

    getCurWeek : function () {
        var week = parseInt((this._curTime-1523203200)/(7*24*3600));
        scratch.GlobalFuncs.upDateRankDataWeek(week+"");
        return week;
    }
};