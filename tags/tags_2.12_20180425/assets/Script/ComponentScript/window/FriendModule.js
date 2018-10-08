
cc.Class({
    extends: cc.Component,

    properties: {
        btnBack : cc.Button,
        jifenNode : cc.Node,
        jifenLeftNode : cc.Node,
        jifenRightNode : cc.Node,
        bigBtnNode : cc.Node,
        bottomNode : cc.Node,
        lblDiFen : cc.Label,
        btnInvite : cc.Button,
        btnReady : cc.Button,
        btnContinue : cc.Button,
        btnDuiJu : cc.Button,
        disbinds : [],
        disbindsWindow : cc.Node,
        namesForSeat :[],
        lblNum: cc.Label,
        shouldLeave : false,
        disbindResult : 0
    },

    setTableScene:function (val) {
        this._tableScene = val;
        this.refresh();
    },

    refresh:function () {
        var ftInfo = this._tableScene.tableInfo().ftInfo;
        this.setBtnReadyState(!ftInfo.allComplete && this._tableScene._mySeatinfo.model.m_state == ddz.Enums.SeatState.SEATDZSTAT_WAIT);
        this._tableScene.myAvatar.active = this._tableScene._tableState.normalInfo.m_state != ddz.Enums.TableState.TABLEDSTAT_PLAYING;
        // this._tableScene._leftPlayerController.setClockVisible(false);
        // this._tableScene._rightPlayerController.setClockVisible(false);
        this.updateDuiJuBtnLabel();

        if (debugMode){
            this.lblNum.string = "牌桌号:" + this._tableScene.tableInfo().ftInfo.ftId;
        }
    },

    updateMultiple:function (baseScore, multiple) {
        this.lblDiFen.string = baseScore + "分 x " + multiple + "倍";
    },

    updateDuiJuBtnLabel:function () {
        var lbl = this.btnDuiJu.node.getChildByName('Label').getComponent(cc.Label);
        lbl.string = "对局 "+this._tableScene.tableInfo().ftInfo.curRound+"/" + this._tableScene.tableInfo().ftInfo.totalRound;
    },

    endResultShow : function () {
        if(this.shouldLeave && this._tableScene.tableInfo().ftInfo.curRound < 1){
            hall.GlobalFuncs.gotoDdz();
            return;
        }
        // hall.GlobalFuncs.gotoDdz();
        // if (hall.GlobalFuncs && hall.GlobalFuncs.gotoDdz)
        if(this.disbindResult == 1){
            if(ddz.detailsModel.resuslts.length <= 0 || ddz.detailsModel.isNowin == 1){
                hall.GlobalFuncs.gotoDdz();
            }else {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeEndFriendGame,
                    [this._tableScene.tableInfo().ftInfo.totalRound,
                        this._tableScene.tableInfo().ftInfo.curRound,
                        ddz.Share.shareKeywordReplace.goodCard]);
                hall.GlobalFuncs.onShowDetail();
                this.shouldLeave = true;
                ty.Timer.setTimer(this,this.leaveAction,300);
            }
        }
    },
    leaveAction : function () {
        this.unscheduleAllCallbacks();
        hall.GlobalFuncs.gotoDdz();
    },
    reciveOnHide : function () {
        if(this.disbindsWindow){
            this.disbindsWindow.removeFromParent();
        }
    },
    onLoad : function() {
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_DISBIND,this.reciveFtDisbind,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_REQ_DISBIND,this.reciveDisbind,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_REQ_DISBIND_ANSWER,this.reciveDisbindAnswer,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_REQ_DISBIND_RESULT,this.reciveDisbindResult,this);
        // ty.NotificationCenter.listen(ddz.EventType.ACTION_CAN_ROOM_LEAVE,this.reciveCanRoomLeave,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_END_RESULT_SHOW,this.endResultShow,this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE,this.reciveOnHide,this);

        ty.NotificationCenter.listen(ddz.EventType.FTINFO_CHANGE, this.onFtInfoChange,this);

        ddz.NetWorkCenter.canNotLeave = true;

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.btnBack.node.y = backButtonH;
        }

        // var that = this;
        // ty.Timer.setTimer(this, function () {
        //     that.upDataScore('my', 200, 6);
        // }, 5, 0);

        this.initScore();
    },

    onFtInfoChange:function () {
        this.updateDuiJuBtnLabel();
    },

    onBigBtnClick:function (event, par0) {
        var tableInfo = this._tableScene.tableInfo();
        ddz.LOGD("FriendModule", "par0:" + par0);
        if(this.shouldLeave){
            this.unscheduleAllCallbacks();
            hall.GlobalFuncs.gotoDdz();
            return;
        }

        switch (par0){
            case 'invire':{
                //邀请好友
                ddz.Share.shareWithType(ddz.Share.clickStatShareType.clickStatShareTypeInviteFriend);
                break;
            }
            case 'ready':{
                //准备
                ddz.MsgFactory.getReady(this._tableScene._roomId, tableInfo.tableId(), this._tableScene._mySeatIndex);
                break;
            }
            case 'back':{
                //解散,返回
                var state = this._tableScene._tableState.normalInfo.m_state;
                // var gameStatus = this._tableScene._status;
                // this._tableScene.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_GAMEOVER
                if(this._tableScene.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_GAMEOVER)){
                    return;
                }
                if (state == ddz.Enums.TableState.TABLEDSTAT_IDLE && this._tableScene.tableInfo().ftInfo.curRound == 0) {
                    if (tableInfo.ftInfo.iscreator) {
                        this.showTipsWindow("你确定要解散牌桌吗?");
                    }else {
                        ddz.friendModel.reqDisbind(this._tableScene._roomId, tableInfo.tableId(), this._tableScene._mySeatIndex);
                    }
                }
                else{
                    this.showTipsWindow("你确定要发起投票中途退出吗?");
                }
                break;
            }
        }
    },

    showTipsWindow : function (tipsString) {
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {title :"取消"}, {title :"确定"}
            ];
            window.setTitleContentAndButtons("提示",tipsString, testArray);
        });
    },
    onClickRightButton : function () {
        var tableInfo;
        if (this.waitAnswer){
            tableInfo = this._tableScene.tableInfo();
            ddz.friendModel.ansDisbind(this._tableScene._roomId,tableInfo.tableId(),this._tableScene._mySeatIndex,0);
            // return;
        }else {
            tableInfo = this._tableScene.tableInfo();
            ddz.friendModel.reqDisbind(this._tableScene._roomId, tableInfo.tableId(), this._tableScene._mySeatIndex)
        }
        this.waitAnswer = false;
    },
    onClickLeftButton : function () {
        if (this.waitAnswer){
            var tableInfo = this._tableScene.tableInfo();
            ddz.friendModel.ansDisbind(this._tableScene._roomId,tableInfo.tableId(),this._tableScene._mySeatIndex,1);
            this.waitAnswer = false;
        }
    },
    reciveFtDisbind : function (result) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomDissolveClick, ["success"]);
        if(this.disbinds && this.disbinds.length && this.disbinds.length > 0){
            return;
        }
        hall.LOGE("===","====reciveDisbind========="+JSON.stringify(result));
        this.shouldLeave = true;
        var preFabPath = "prefabs/dissolveNode";
        var comName = "ddz_window_dissolve";
        // var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            // var tableInfo = that._tableScene.tableInfo();
            if(!ddz.NetWorkCenter.canNotLeave){
                window.setTipsSString("你已解散牌桌");
            }else {
                window.setTipsSString("房主已解散牌桌");
            }
        });
    },
    reciveDisbind : function (result) {
        this.disbinds = [];
        hall.LOGD("===","====reciveDisbind========="+JSON.stringify(result));
        var preFabPath = "prefabs/ddz_window_tips";
        var comName = "ddz_tipsWindow";
        var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            if(result.userId == ty.UserInfo.userId){//发起者
                window.setDissolvePregrossForCreator(result.optime,[1,-1,-1]);
                window.noDissolve = true;
                that.disbindsOwer = true;
            }else {
                var tableInfo = that._tableScene.tableInfo();
                var name;
                if (tableInfo.nameList.length > 2){
                    name = tableInfo.nameList[result.seatId-1];
                }else {
                    name = "玩家未知";
                }
                window.setDissolvePregrossForAnswer(result.optime,[1,-1,-1],name);
                window.noDissolve = true;
                that.disbindsOwer = false;
                that.waitAnswer = true;
            }
            that.disbinds.push(1);
            that.disbindsWindow = preFabNode;
        });
    },

    reciveDisbindAnswer : function (result) {
        hall.LOGD("===","====reciveDisbindAnswer========="+JSON.stringify(result));
        var disbindsR = result.disbinds;
        var anser = disbindsR[result.seatId-1];
        this.disbinds.push(anser);
        var window = this.disbindsWindow.getComponent("ddz_tipsWindow");
        window.changePregross(this.disbinds);

        if(ty.UserInfo.userId == result.userId){
            if(!this.disbindsOwer){
                window.changeStateToWait(anser);
            }
        }
    },

    reciveDisbindResult : function (result) {
        ddz.NetWorkCenter.canNotLeave = true;
        //出结果啦~~~~
        hall.LOGD("++++","=======reciveDisbindResult====="+JSON.stringify(result));
        var window = this.disbindsWindow.getComponent("ddz_tipsWindow");
        // window.noDissolve = false;
        window.onClose();
        var disbindResult = result.disbindResult;
        this.disbindResult = disbindResult;
        var disbinds = result.disbinds;
        var preFabPath = "prefabs/dissolveNode";
        var comName = "ddz_window_dissolve";
        var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tableInfo = that._tableScene.tableInfo();
            var nameA = [];
            if(disbindResult == 0){
                if (tableInfo.nameList.length < 3){
                    window.setDissolveFailDetailTextString("玩家1","玩家2");
                    return;
                }
                for (var i = 0 ; i < 3; i ++){
                    if(disbinds[i] == 0){
                        var name = tableInfo.nameList[i];
                        nameA.push(name);
                    }
                }
                window.setDissolveFailDetailTextString(nameA,false);
                hall.LOGE("==","=======被拒绝=====");
            }
            else {
                if (tableInfo.nameList.length < 3){
                    window.setDissolveFailDetailTextString("玩家1","玩家2");
                    return;
                }
                for (var i = 0 ; i < 3; i ++){
                    if(disbinds[i] == 1){
                        var name = tableInfo.nameList[i];
                        nameA.push(name);
                    }
                }
                window.setDissolveFailDetailTextString(nameA,true);

                ddz.detailsModel.setIsOver(true);
                hall.LOGE("==","=======解散成功=====");
            }
        });
    },

    // "disbind":{
    //     "reqSeatId":2,
    //     "states":[
    //         -1,
    //         1,
    //         -1
    //     ],
    //     "optime":84
    // },

    deleteDisbindState : function(){
        if(this.disbindsWindow){
            this.disbindsWindow.removeFromParent();
        }
    },
    refreshDisbindState : function (disbind) {
        if(this.disbindsWindow){
            this.disbindsWindow.removeFromParent();
        }
        var states = disbind.states;
        var stateDic = {"before":[],"one":[],"zero":[]};
        for (var i = 0 ; i < states.length ; i ++){
            if(states[i] == -1){
                stateDic.before.push(states[i]);
            }else if(states[i] == 0){
                stateDic.zero.push(states[i]);
            }else {
                stateDic.one.push(states[i]);
            }
        }
        var oneL = stateDic.one;
        var zeroL = stateDic.zero;
        this.disbinds = oneL.concat(zeroL);
        var preFabPath = "prefabs/ddz_window_tips";
        var comName = "ddz_tipsWindow";
        var that = this;
        ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            if(disbind.reqSeatId == that._tableScene._mySeatIndex){//发起者
                window.setDissolvePregrossForCreator(disbind.optime,that.disbinds);
                window.noDissolve = true;
                that.disbindsOwer = true;
            }else {
                var tableInfo = that._tableScene.tableInfo();
                var name;
                if (tableInfo.nameList.length > 2){
                    name = tableInfo.nameList[disbind.reqSeatId-1];
                }else {
                    name = "玩家未知";
                }
                window.setDissolvePregrossForAnswer(disbind.optime,that.disbinds,name);
                window.noDissolve = true;
                that.disbindsOwer = false;
                if(states[that._tableScene._mySeatIndex -1] == -1){
                    that.waitAnswer = true;
                }else {
                    that.waitAnswer = false;
                    window.changeStateToWait(states[that._tableScene._mySeatIndex -1]);
                }
            }
            that.disbindsWindow = preFabNode;
        });
    },


    initScore:function () {

        var myIndex = this._tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var ftInfo = this._tableScene.tableInfo().ftInfo;

        var score = ftInfo.getScore(myIndex - 1);
        this.setScore('my', score);

        score = ftInfo.getScore(leftindex - 1);
        this.setScore('left', score);

        score = ftInfo.getScore(rightindex - 1);
        this.setScore('right', score);
    },

    //更新分数
    upDataScore:function (pos, scroe, delta) {
        var lblScoreChange, lblName;
        var deltaStr = "";
        if (delta >= 0){
            deltaStr = "+" + delta;
            lblName = "lblJiFenChangeAdd";
        }
        else{
            deltaStr = "" + delta;
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

        var callBack = cc.callFunc(function () {
            that.setScore(pos, scroe);
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

        lblScore.string = scroe +"";
    },

    getScoreLabel:function (scoreNode, lblName) {
        return scoreNode.getChildByName(lblName).getComponent(cc.Label);
    },

    setBtnInviteState:function (val) {
        this.btnInvite.node.active = val;
    },

    setBtnReadyState:function (val) {
        if (val){
            this.lblDiFen.string = "";
        }
        this.btnContinue.node.active = false;
        this.btnReady.node.active = false;

        var btnReady = this.getBtnReady();
        btnReady.node.active = val;
    },

    getBtnReady:function () {
        if (this._tableScene.tableInfo().ftInfo.curRound == 0)  {
            return this.btnReady;
        }
        return this.btnContinue;
    },

    onDuiJuBtnClick:function (event) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomDuiju, []);
        //打开对局流水面板
        hall.GlobalFuncs.onShowDetail();
    },


    // //继续
    // _normalContinue: function() {
    //     ddz.LOGD(this._TAG, "_normalContinue");
    //     ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
    //     this.reStart();
    // },
    //
    // //重新开始
    // reStart: function(bLeave) { //bLeave表示是否离开牌桌，如果不离开，则是原牌桌人继续游戏
    //     if (!this.isMode(ddz.Enums.PlayMode.PLAY_MODE_SINGLE)) {
    //         //send leave room
    //         var time = 0;
    //         if (bLeave) {
    //             ddz.MsgFactory.getRoomLeave(hall.ME.normalInfo.userId, ddz.GameId, this._roomId, ty.SystemInfo.clientId);
    //             time = 2;
    //         }
    //         //延迟2秒发送，确保顺序
    //         var that = this;
    //         var ctid = this._tableInfo.m_customTableId;
    //         ty.Timer.setTimer(this, function () {
    //             that._sendQuickStart(that, ctid);
    //         },time , 0);
    //     }
    //     this._reset();
    // },
    // //快速开始
    // _sendQuickStart: function(target, ctid) {
    //     if (ctid) {
    //         hall.MsgFactory.roomAction("quick_start", ctid);
    //     } else {
    //         ddz.MsgFactory.getQuickStart(hall.ME.normalInfo.userId, ddz.GameId, this._tableInfo.roomId(), hall.staticSystemInfo.version, null);
    //     }
    // },


    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        if(this.disbindsWindow){
            this.disbindsWindow.removeFromParent();
        }
        this.disbindsWindow = null;
        this._tableScene = null;
    }

    // update (dt) {},
});
