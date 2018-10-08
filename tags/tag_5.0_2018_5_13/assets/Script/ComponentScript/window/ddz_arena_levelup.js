
// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor:function () {

    },

    properties: {
        continueBtn: cc.Button,
        continueBtnLabel: cc.RichText,
        rankLabel: cc.RichText,
        rankBaseLabel: cc.RichText,
        saveBtn: cc.Button,
        aniNode: cc.Node,
        progressNode: cc.Node,
    },

    onLoad:function () {
        //当前的progress展示
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.backButton.node.y = backButtonH;
        //}
        this.actionCount = 1; //防止用户行为与定时器行为相冲突
        this.timeLeft = 5;
        this.continueBtnLabel.string = "<color=#FFFFFF>进入下一轮（" + this.timeLeft + "）</c>";
        ty.Timer.setTimer(this, this.timeCount, 1, 5, 0);
        var ani = this.aniNode.getComponent(cc.Animation);
        ani.play('chenggongjinji');
        //ty.NotificationCenter.listen(ddz.EventType.RECIVE_TABLE_INFO, this.newTableInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,this.shutSelf,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_CHALLENGE, this.shutSelf, this);
        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.saveMatchSuccess, this);
        ty.NotificationCenter.listen(ddz.EventType.ARENA_BACK_TO_SCENE, this.shutSelf, this);
    },

    setRankString: function(rankString) {
        var ret = rankString.split('/');
        this.rankLabel.string = "<color=#FDE755>" + ret[0] + "</color>";
        this.rankBaseLabel.string = '<color=#FFFDDA>/' + ret[1] + '</color>';

    },

    showArenaStageProgress: function(curStage, stages, playani) {
        ty.Timer.setTimer(this, function(){
            var scr = this.progressNode.getComponent("MatchRankProgressScript");
            scr.initWithPars(curStage - 1, stages, playani);
        }, 0.36, 0, 0);
    },

    setMatchDes: function(matchDes) {
        this.matchDes = matchDes;
    },

    saveMatchSuccess: function(value) {
        var saveInfo = value.saveInfo;
        var matchId = value.matchId;
        var matchDes = hall.ME.matchInfo.getMatchDesByMatchId(matchId);
        var stageString = "轮次: " + saveInfo.stageIndex + '/' + matchDes.stages.length;
        var scoreString = "积分: " + saveInfo.mscore;
        var preFabPath = "prefabs/ddz_window_save_match_result";
        ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var com = preFabNode.getComponent("ddz_window_save_match_result");
            com.updateByMatchInfo([stageString, scoreString]);
        });
    },

    shutSelf: function() {
        ty.NotificationCenter.trigger(ddz.EventType.HIDE_DDZ_MAIN);
        ty.Timer.cancelTimer(this, this.timeCount);
        ty.NotificationCenter.ignoreScope(this);
        this.node.removeFromParent();
    },

    timeCount: function() {
        this.timeLeft--;
        if(this.timeLeft <= 0) {
            this.continueBtnLabel.string = "<color=#FFFFFF>进入下一轮</c>";
            this.onContinueClick();
        } else {
            this.continueBtnLabel.string = "<color=#FFFFFF>进入下一轮（" + this.timeLeft + "）</c>";
        }
    },

    onButtonClick: function(event, type) {
        ty.Timer.cancelTimer(this, this.timeCount);
        if(type == 'continue') {
            this.onContinueClick();
        } else if(type == "save") {
            this.onSaveClick();
        }
        this.continueBtn.interactable = false;
        this.saveBtn.interactable = false;
    },

    onContinueClick: function() {
        this.continueBtnLabel.string = "<color=#FFFFFF>进入下一轮</c>";
        if(this.matchDes) {
            ddz.matchModel.matchChallenge(this.matchDes.roomId, this.matchDes.matchId);
            this.matchDes = null;
        }
    },

    onSaveClick: function() {
        this.continueBtnLabel.string = "<color=#FFFFFF>进入下一轮</c>";
        if(this.matchDes) {
            ddz.matchModel.matchSave(this.matchDes.roomId, this.matchDes.matchId);
            this.matchDes = null;
        }
    },

    shut:function () {
        ty.Timer.cancelTimer(this, this.timeCount);
        ty.NotificationCenter.ignoreScope(this);
        this.node.destroy();
    },

    onDestroy: function() {
        ty.NotificationCenter.ignoreScope(this);
    },
    // update (dt) {},
});
