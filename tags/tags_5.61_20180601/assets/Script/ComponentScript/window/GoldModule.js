
cc.Class({
    extends: cc.Component,

    properties: {
        btnBack : cc.Button,
        jifenNode : cc.Node,
        jifenLeftNode : cc.Node,
        jifenRightNode : cc.Node,
        lblDiFen : cc.Label,
        lblNum: cc.Label,
        game_result : cc.Prefab,
        tasksNode: cc.Node,
        matchNode : cc.Node,
        matchingNode : cc.Node,
        txtSfee : cc.Label
    },

    ctor:function () {
    },

    setTableScene:function (val) {
        this._tableScene = val;
        this._tableInfoChange(this._tableScene.tableInfo());
        this.refresh();
    },

    refresh:function () {
        this._tableScene.myAvatar.active = this._tableScene._tableState.normalInfo.m_state != ddz.Enums.TableState.TABLEDSTAT_PLAYING;

        this.initScore();
        if (this._tableScene._leftSeatinfo.hasData && this._tableScene._rightSeatinfo.hasData){
            //坐滿了,
            this._onGameReady();
        }

        if (this._tableScene._leftSeatinfo.hasData){
            this._onUpdateInfo({pos:'left', type:'sit'});
        }

        if (this._tableScene._rightSeatinfo.hasData){
            this._onUpdateInfo({pos:'right', type:'sit'});
        }
    },

    updateMultiple:function (baseScore, multiple) {
        this.lblDiFen.string = baseScore + " x " + multiple + "倍";
    },

    // hideGoldInfo:function(){
    //     this.goldInfoNode.active = false;
    // },
    
    showTboxGetReward:function(result,roomId){
        var that = this;
        // 金币场牌局内任务
        if (result.seattb) {
            var task = result.seattb[this._tableScene._mySeatIndex - 1];
            if (task && task.tbc > 0){
                cc.loader.loadRes("prefabs/gameTasks", function (err, prefab) {
                    var preFabNode = cc.instantiate(prefab);
                    var com = preFabNode.getComponent("ddz_gameTasks");
                    var _roomId = roomId;
                    if (task.mixRoomId) {
                        _roomId = task.mixRoomId;
                    }
                    com.updateProgress(task.tbt,task.tbc,_roomId);
                    if (that.tasksNode) {
                        that.tasksNode.addChild(preFabNode);
                    }
                }.bind(this));
            }
        }
    },

    onLoad : function() {
        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_PLAYER_INFO, {pos:'right', type:'leave'});
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_PLAYER_INFO, this._onUpdateInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_READY, this._onGameReady, this);
        ty.NotificationCenter.listen(ddz.EventType.TABLE_INFO_CHAGE, this._tableInfoChange, this);
        ty.NotificationCenter.listen(ddz.EventType.BUY_CHIP_CHANEG, this._onByInChipChange, this);
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.btnBack.node.y = backButtonH;
        }

        ty.NotificationCenter.listen(ddz.EventType.START_MATCHING, this.startAni, this);
        ty.NotificationCenter.listen(ddz.EventType.STOP_MATCHING, this.stopAni, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.removeMatching, this);
        this.matchNode.active = false;
        // this.startAni();
        // this.initScore();
        if(ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType){
            var widL = this.jifenLeftNode.getComponent(cc.Widget);
            widL.top = 160;
            var widR = this.jifenRightNode.getComponent(cc.Widget);
            widR.top = 160;
        }
    },
    startAni : function () {
        ddz.LOGD("","file = [GoldModule] fun = [startAni] queueInfo = " + JSON.stringify(ddz.matchModel.getCurQueueInfo()));
        if (ddz.matchModel.getCurQueueInfo()) {
            this.matchNode.active = false;
        }else {
            this.matchNode.active = true;
            var ani = this.matchingNode.getComponent(cc.Animation);
            var anim = ani.getAnimationState('ddz_matching');
            anim.play();
        }
    },
    stopAni : function () {
        var ani = this.matchingNode.getComponent(cc.Animation);
        ani.stop();
    },
    removeMatching : function () {
        this.matchingNode.removeFromParent();
    },

    _onByInChipChange:function (seatId) {
        if (seatId == this._tableScene._mySeatIndex){
            var mscore = this._tableScene._mySeatinfo.model.m_buyinChip;
            this.setScore('my', mscore);
        }
    },

    _onGameReady:function () {
        this.matchNode.active = false;
        ty.NotificationCenter.trigger(ddz.EventType.STOP_MATCHING);

        this._tableScene.showGoldInfo();
        this.btnBack.node.active = false;
    },

    _tableInfoChange:function (tableInfo) {
        this.txtSfee.string = "本局服务费" + tableInfo.config.m_sfee;
    },

    _onUpdateInfo:function (obj) {
        var mscore = 0;
        var userPanel;
        if (obj.pos == 'left'){
            mscore = this._tableScene._leftSeatinfo.model.m_buyinChip;
            userPanel = this.jifenLeftNode;
        }
        else if (obj.pos == 'right'){
            mscore = this._tableScene._rightSeatinfo.model.m_buyinChip;
            userPanel = this.jifenRightNode;
        }
        userPanel.active = true;
        if (obj.type == 'leave'){
            mscore = 0;
            userPanel.active = false;
        }
        if (obj.type == 'sit'){
            if(this._tableScene._rightSeatinfo.hasData && this._tableScene._leftSeatinfo.hasData){
                this._onGameReady();
            }
        }
        this.setScore(obj.pos, mscore);
    },

    initScore:function () {

        var mscore = this._tableScene._mySeatinfo.model.m_buyinChip;
        this.setScore('my', mscore);

        mscore = 0;
        if (this._tableScene._leftSeatinfo.hasData){
            mscore = this._tableScene._leftSeatinfo.model.m_buyinChip;
        }

        this.setScore('left', mscore);

        mscore = 0;
        if (this._tableScene._rightSeatinfo.hasData){
            mscore = this._tableScene._rightSeatinfo.model.m_buyinChip;
        }
        this.setScore('right', mscore);
    },

    updateAllScore:function (result) {

        var myIndex = this._tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var checkSeatIsWin = function (seatIndex) {
            var dizhuWin = result.dizhuwin == 1;
            var isWin = false;
            if (seatIndex == result.stat.dizhu){
                isWin = dizhuWin;
            }
            else{
                isWin = !dizhuWin;
            }
            return isWin;
        };

        var seatInfo = result['seat' + myIndex];

        var score = seatInfo[1];
        var delta = seatInfo[0];

        this.upDataScore('my', score, delta, checkSeatIsWin(myIndex));

        seatInfo = result['seat' + leftindex];

        score = seatInfo[1];
        delta = seatInfo[0];

        this.upDataScore('left', score, delta, checkSeatIsWin(leftindex));

        seatInfo = result['seat' + rightindex];

        score = seatInfo[1];
        delta = seatInfo[0];

        this.upDataScore('right', score, delta, checkSeatIsWin(rightindex));
    },

    //更新分数
    upDataScore:function (pos, scroe, delta, isWin) {
        var lblScoreChange, lblName;
        var deltaStr = hall.GlobalFuncs.formatGold(delta);
        if (isWin){
            deltaStr = "+" + deltaStr;
            lblName = "lblJiFenChangeAdd";
        }
        else{
            if (delta == 0){
                deltaStr = "-0";
            }
            lblName = "lblJiFenChange";
        }

        switch (pos){
            case 'my':{
                lblScoreChange = this.getScoreLabel(this.jifenNode, lblName);
                break;
            }
            case 'left':{
                lblScoreChange = this.getScoreLabel(this.jifenLeftNode, lblName);
                break;
            }
            case 'right':{
                lblScoreChange = this.getScoreLabel(this.jifenRightNode, lblName);
                break;
            }
        }


        lblScoreChange.string = deltaStr;
        var that = this;
        that.setScore(pos, scroe);
        var callBack = cc.callFunc(function () {
            lblScoreChange.node.opacity = 255;
            lblScoreChange.string = "";
        });

        var flyAni = cc.sequence(cc.delayTime(5), cc.fadeOut(0.2), callBack);
        lblScoreChange.node.runAction(flyAni);
    },

    reSetAddScore:function () {
        this.getScoreLabel(this.jifenNode, 'lblJiFenChangeAdd').string = "";
        this.getScoreLabel(this.jifenNode, 'lblJiFenChange').string = "";

        this.getScoreLabel(this.jifenLeftNode, 'lblJiFenChangeAdd').string = "";
        this.getScoreLabel(this.jifenLeftNode, 'lblJiFenChange').string = "";

        this.getScoreLabel(this.jifenRightNode, 'lblJiFenChangeAdd').string = "";
        this.getScoreLabel(this.jifenRightNode, 'lblJiFenChange').string = "";
    },

    setScore:function (pos, scroe) {
        var lblScore;
        switch (pos){
            case 'my':{
                lblScore = this.getScoreLabel(this.jifenNode, 'lblJiFen');
                break;
            }
            case 'left':{
                lblScore = this.getScoreLabel(this.jifenLeftNode, 'lblJiFen');
                break;
            }
            case 'right':{
                lblScore = this.getScoreLabel(this.jifenRightNode, 'lblJiFen');
                break;
            }
        }

        lblScore.string = hall.GlobalFuncs.formatGold(scroe) +"";
    },

    showResult:function (result) {
        ddz.LOGD("","file = [DdzTableScene] fun = [_startGameOverAnimation] 金币场显示结算界面");
        this._tableScene._reset();
        ty.NotificationCenter.trigger(ddz.EventType.STOP_MATCHING);
        this.matchNode.active = false;
        if (!this._gameResult){
            var game_result_wnd = cc.instantiate(this.game_result);
            cc.director.getScene().addChild(game_result_wnd);
            this._gameResult = game_result_wnd.getComponent("ddz_game_result");
            this._gameResult.setTableScene(this._tableScene);
        }
        this._gameResult.show(result);

        var mySeatIndex = this._tableScene._mySeatIndex;
        if (mySeatIndex == result.stat.dizhu){
            var saveCardsString =  hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ORIGINCARDS, "");
            var saveCardsDic = JSON.parse(saveCardsString);
            var cards = saveCardsDic.myCards;
            var baseCards = saveCardsDic.baseCard;
            cards = cards.concat(baseCards);
            var saveDic = {myCards:cards,baseCard:baseCards};
            hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.ORIGINCARDS, JSON.stringify(saveDic));
        }

        this.scheduleOnce(function () {
            if(result.winchips){
                ddz.GlobalFuncs.showShareMomentsItem("showy_highTotal",result.winchips);
            }else if(result.winstreak){
                ddz.GlobalFuncs.showShareMomentsItem("showy_winningStreak",result.winstreak);
            }
        }.bind(this),1);
    },

    getScoreLabel:function (scoreNode, lblName) {
        return scoreNode.getChildByName(lblName).getComponent(cc.Label);
    },

    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        // this.tasksNode.removeAllChildren();
        this._tableScene = null;
    },

    reset:function () {
        this.lblDiFen.string = "";
        this.jifenLeftNode.active = false;
        this.jifenRightNode.active = false;

        this.matchNode.active = true;
        ty.NotificationCenter.trigger(ddz.EventType.START_MATCHING);

        var lblScoreChange;

        lblScoreChange = this.getScoreLabel(this.jifenNode, "lblJiFenChangeAdd");
        lblScoreChange.string = "";
        lblScoreChange.node.stopAllActions();

        lblScoreChange = this.getScoreLabel(this.jifenNode, "lblJiFenChange");
        lblScoreChange.string = "";
        lblScoreChange.node.stopAllActions();

        lblScoreChange = this.getScoreLabel(this.jifenLeftNode, "lblJiFenChangeAdd");
        lblScoreChange.string = "";
        lblScoreChange.node.stopAllActions();

        lblScoreChange = this.getScoreLabel(this.jifenLeftNode, "lblJiFenChange");
        lblScoreChange.string = "";
        lblScoreChange.node.stopAllActions();

        lblScoreChange = this.getScoreLabel(this.jifenRightNode, "lblJiFenChangeAdd");
        lblScoreChange.string = "";
        lblScoreChange.node.stopAllActions();

        lblScoreChange = this.getScoreLabel(this.jifenRightNode, "lblJiFenChange");
        lblScoreChange.string = "";
        lblScoreChange.node.stopAllActions();

        this.btnBack.node.active = true;
    },

    update:function (dt) {

    },

    onBack:function () {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var tableinfo = this._tableScene.tableInfo();
        var _mixID = tableinfo.mixId;
        var _roomId = tableinfo.roomId();
        if (!_roomId) {
            var _queueInfo = ddz.matchModel.getCurQueueInfo();
            _roomId = _queueInfo.roomId
        }
        ddz.MsgFactory.getRoomLeave(_roomId, tableinfo.tableId(), this._tableScene._mySeatIndex, _mixID);
    }
});
