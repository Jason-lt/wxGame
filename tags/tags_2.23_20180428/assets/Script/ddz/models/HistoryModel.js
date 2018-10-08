
/*
*  历史战绩 数据解析
* */

ddz.historyModel = {
    historyData:[],
    
    parseHistory:function(result){
        this.historyData = [];
        if (result.records && result.records.length > 0){
            var _records = result.records;
            for (var i = 0; i < _records.length; i++){
                this.parseResults(_records[i].results,_records[i].curSeatId,_records[i].time,_records[i].totalRound,_records[i].curRound);
            }
        }
    },

    parseResults:function(results,_mySeatIndex,timer,totalRound,curRound){
        ddz.detailsModel.parseResults(results);
        ddz.detailsModel.setIsHisTory(true);
        ddz.detailsModel.setMySeatIndex(_mySeatIndex);

        var data = {};
        data.avatars = ddz.detailsModel.getAvatars();
        var sumScore = ddz.detailsModel.getSumScore();
        data.score = sumScore[_mySeatIndex - 1];
        data.timer = timer;
        data.mySeatIndex = _mySeatIndex;
        data.results = results;
        data.totalRound = totalRound;
        data.curRound = curRound;
        this.historyData.push(data);
    },

    getHistoryData:function(){
        return this.historyData;
    },

    getAvatars:function(index){
        var avatars = [];
        if (this.historyData[index]){
            avatars = this.historyData[index].avatars;
        }
        return avatars;
    },

    getScore:function(index){
        var score = 0;
        if (this.historyData[index]){
            score = this.historyData[index].score;
        }
        return score;
    },

    getTimer:function(index){
        var timer = 0;
        if (this.historyData[index]){
            timer = this.historyData[index].timer;
        }
        return timer;
    },

    getMySeatIndex:function(index){
        var mySeatIndex = 0;
        if (this.historyData[index] && this.historyData[index].mySeatIndex){
            mySeatIndex = this.historyData[index].mySeatIndex;
        }
        return mySeatIndex;
    }

};
