

/*
 ➢	好友房战绩弹窗展示一轮牌局信息：用户头像、时间、牌局类型和用户本人分数结算
 ➢	好友房战绩展示最近十条
 ➢	点击具体战绩，打开对局详情弹窗
 ➢	弹窗为叠加展示，即关闭对局详情展示好友房战绩。关闭好友房战绩，展示创建房间牌桌。
 */

cc.Class({
    extends: cc.Component,

    properties: {

        bgBtn: {
            default : null,
            type : cc.Button
        },
        playLabel: {
            default : null,
            type : cc.Label
        },
        timeLabel: {
            default : null,
            type : cc.Label
        },
        countLabel: {
            default : null,
            type : cc.Label
        },

        player_1 : cc.Node,

        player_2 : cc.Node,

        player_3 : cc.Node,
    },

    onLoad : function () {
        this.bgBtn.node.on("click",this.showGameDetail,this);
    },

    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },

    setDetailInformation:function (resultMap) {
        var historyDdata = ddz.historyModel.getHistoryData();
        ddz.detailsModel.parseResults(historyDdata[this.index].results);
        var myIndex = ddz.historyModel.getMySeatIndex(this.index);
        ddz.LOGD("", "file = [ddz_cell_history] fun = [setDetailInformation] myIndex = " + myIndex);
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var avatars = resultMap.avatars;

        this.updateAcatar(this.player_1,avatars[myIndex-1]);
        this.updateAcatar(this.player_2,avatars[rightindex-1]);
        this.updateAcatar(this.player_3,avatars[leftindex-1]);

        this.setPlayMode(resultMap.titleS);
        this.updateTimer(resultMap.timeS);
        this.setSumScore(resultMap.score);

    },

    updateAcatar:function(_player,_url){
        ddz.LOGD("", "file = [ddz_cell_history] fun = [updateAcatar] name ");
        var com = _player.getComponent('Avatar');
        com.setAvatarUrl(_url);
        com.hideNameDisplay();
    },

    setPlayMode:function(_playMode){
        
        var playingString = "经典玩法";
        switch (_playMode){
            case "happy" : playingString = "欢乐玩法";break;
            case "wild" : playingString = "癞子玩法";break;
            default : playingString = "经典玩法";
        }

        this.playLabel.string = playingString;
    },

    updateTimer:function(_timer){
        this.timeLabel.string = _timer;
    },

    setSumScore:function(score){
        this.countLabel.string = score;
    },

    showGameDetail:function(){
        ddz.LOGD("", "file = [ddz_window_history] fun = [showGameDetail] this.index = " + this.index);
        var historyDdata = ddz.historyModel.getHistoryData();
        ddz.detailsModel.parseResults(historyDdata[this.index].results);
        ddz.detailsModel.parseFriendRound(historyDdata[this.index].curRound,historyDdata[this.index].totalRound);
        ddz.detailsModel.setMySeatIndex(historyDdata[this.index].mySeatIndex);
        ddz.detailsModel.setIsHisTory(true);
        hall.GlobalFuncs.onShowDetail();
    },

});
