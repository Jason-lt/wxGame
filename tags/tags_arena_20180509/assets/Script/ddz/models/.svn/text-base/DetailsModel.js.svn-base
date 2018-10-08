
/*
 * 对局流水 数据解析
 *
 *"results":[
 　　　　　　{
 　　　　　　　　"base":1,
 　　　　　　　　"winloses":[
 　　　　　　　　　　{
 　　　　　　　　　　　　"delta":6,
 　　　　　　　　　　　　"multi":6,
 　　　　　　　　　　　　"score":6,
 　　　　　　　　　　　　"isDizhu":false,
 　　　　　　　　　　　　"nickname":"许敬",
 　　　　　　　　　　　　"avatar":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKvtG0bAIJaKib1TbfzEyzQq4iatjzNOn7NPh6DUBkuSf9FUebMKiaJLonkricvb61vpJV9vCNyC2jgvw/0"
 　　　　　　　　　　},
 　　　　　　　　　　{
 　　　　　　　　　　　　"delta":6,
 　　　　　　　　　　　　"multi":6,
 　　　　　　　　　　　　"score":6,
 　　　　　　　　　　　　"isDizhu":false,
 　　　　　　　　　　　　"nickname":"许昕妍",
 　　　　　　　　　　　　"avatar":"http://ddz.image.tuyoo.com/avatar/head_suv.png"
 　　　　　　　　　　},
 　　　　　　　　　　{
 　　　　　　　　　　　　"delta":-12,
 　　　　　　　　　　　　"multi":12,
 　　　　　　　　　　　　"score":-12,
 　　　　　　　　　　　　"isDizhu":true,
 　　　　　　　　　　　　"nickname":"jason",
 　　　　　　　　　　　　"avatar":"http://ddz.dl.tuyoo.com/cdn37/hall/avatar/New_avatar_170828.png"
 　　　　　　　　　　}
 　　　　　　　　]
 　　　　　　}
 　　　　]
 * */


ddz.detailsModel = {
    resuslts:[],
    curRound: 0,     //好友桌总当前局数
    totalRound: 0,   //好友桌总局数
    avatars:[],
    sumScores:[0,0,0],
    nickNames:[],
    whoWin:-1,
    playMode:"经典玩法",
    isOver:false,
    isNowin:false,
    isHistory:false,
    mySeatIndex:0,

    parseResults:function(results){
        if (!results || results.length <= 0) {
            if (this.curRound <= 1 && this.totalRound > 0){
                if (this.isHistory) {
                    this.clearDetail();
                }
            }
        }else {
            this.resuslts = [];
            var isEnd = false;
            for (var i = 0; i < results.length; i++){
                if (results[i].winloses) {
                    var _winloses = results[i].winloses;
                    if (i == results.length - 1){
                        isEnd = true;
                    }
                    this.parseWinLose(_winloses,i,isEnd);
                }
            }
        }
    },

    setIsNoWin:function(_nowin){
        this.isNowin = _nowin;
    },

    parseWinLose: function (_winloses,index,_isEnd) {
        var singleScore = [];
        var copyList = _winloses;

        for (var i = 0; i < 3; i++){
            singleScore.push(copyList[i].delta);
            this.avatars[i] = copyList[i].avatar;
            this.nickNames[i] = copyList[i].nickname;
            if (_isEnd){
                this.sumScores[i] = copyList[i].score;
                this.whoWin = this.sumScores.indexOf(Math.max.apply(Math, this.sumScores));

            }
        }
        this.resuslts[index] = singleScore;
    },


    // 对局流水, 解析当前局数和总局数
    parseFriendRound:function(_curRound,_totalRound){
        this.curRound = _curRound;
        this.totalRound = _totalRound;

        // var _isOver = this.totalRound > 0 ? this.curRound == this.totalRound : false;
        // this.setIsOver(_isOver);
    },

    // 对局流水, 获取当前桌玩家头像,名字信息
    getAvatars:function(){
        return this.avatars;
    },
    
    getWhoWin:function(){
        return this.whoWin;
    },

    getSumScore:function(){
        return this.sumScores;
    },

    setIsOver:function(_isOver){
        this.isOver = _isOver;
    },

    // 获取当前这一局是不是本场最后一局
    getIsOver:function(){
        return this.isOver;
    },

    setIsHisTory:function(_isHistory){
        this.isHistory = _isHistory;
    },

    getIsHisTory:function(){
        return this.isHistory;
    },

    setMySeatIndex:function(_mySeatIndex){
        this.mySeatIndex = _mySeatIndex;
    },

    getMySeatIndex:function(){
        return this.mySeatIndex;
    },

    getNickNames:function(){
        return this.nickNames;
    },
    
    getTotalRound:function(){
        return this.totalRound;
    },

    clearDetail:function(){
        this.resuslts = [];
        this.curRound = 0;
        this.totalRound = 0;
        this.avatars = [];
        this.sumScores = [0,0,0];
        this.nickNames = [];
        this.whoWin = -1;
        this.isOver = false;
        this.isHistory = false;
        this.mySeatIndex = 0;
    }

};