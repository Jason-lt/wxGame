(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ArenaMatchModule.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b6a56FjsLpHaYYqrEBUcAYR', 'ArenaMatchModule', __filename);
// Script/ComponentScript/window/ArenaMatchModule.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        btnBack: cc.Button,
        jifenNode: cc.Node,
        jifenLeftNode: cc.Node,
        jifenRightNode: cc.Node,
        bigBtnNode: cc.Node,
        bottomNode: cc.Node,
        lblDiFen: cc.Label,
        lblRank: cc.Label,
        lblNum: cc.Label,
        bigLabel: cc.Label,
        smallLabel: cc.Label
    },

    ctor: function ctor() {},

    setTableScene: function setTableScene(val) {
        this._tableScene = val;
        this.refresh();
    },

    refresh: function refresh() {
        this.disableChatBtn();
    },

    updateMultiple: function updateMultiple(baseScore, multiple) {
        this.lblDiFen.string = baseScore + "分 x " + multiple + "倍";
    },
    onLoad: function onLoad() {
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.btnBack.node.y = backButtonH;
        //}

        ty.NotificationCenter.listen(ddz.EventType.RECIVE_TABLE_INFO, this.showStage, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_READY, this.hideStage, this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_CHALLENGE, this.hideAll, this);
        ty.NotificationCenter.listen(ddz.EventType.MACH_RANK_CHANGE, this.onRankChange, this);
        ty.NotificationCenter.listen(ddz.EventType.SHOW_MATCHING, this.resetScore, this);
        this.showStage();
        this.btnBack.node.active = false;

        if (ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType) {
            // var wid = this.bottomNode.getComponent(cc.Widget);
            // wid.bottom = 30;
            var widL = this.jifenLeftNode.getComponent(cc.Widget);
            widL.top = 160;
            var widR = this.jifenRightNode.getComponent(cc.Widget);
            widR.top = 160;
        }
    },

    onRankChange: function onRankChange() {
        this.lblRank.string = hall.ME.matchInfo.curMatchAddition ? hall.ME.matchInfo.curMatchAddition.rankName : "-/-";
    },

    hideAll: function hideAll() {
        this._tableScene.myAvatar.active = false;
        this.bigBtnNode.active = false;
        this.jifenNode.active = false;
        this.jifenLeftNode.active = false;
        this.jifenRightNode.active = false;
        this.lblDiFen.node.active = false;
    },

    showStage: function showStage(tableInfo) {
        this.switchStage(this._tableScene._isOnReady);
    },

    hideStage: function hideStage() {
        this.switchStage(true);
    },

    disableChatBtn: function disableChatBtn() {
        // this._tableScene._leftPlayerController.setChatButtonActive(false);
        // this._tableScene._rightPlayerController.setChatButtonActive(false);
    },

    switchStage: function switchStage(state) {
        this._tableScene.myAvatar.active = true;
        this.disableChatBtn();
        //if(this._tableScene._isOnReady) {
        //    this._tableScene.myAvatar.active = false;
        //}
        this.bigBtnNode.active = !state;
        this.jifenNode.active = state;
        this.jifenLeftNode.active = state;
        this.jifenRightNode.active = state;
        this.lblDiFen.node.active = state;
        this.bottomNode.active = state;

        this.onRankChange();
        this.bigLabel.string = hall.ME.matchInfo.getMatchStageDes();
        this.updateAllScore();
    },

    refreshShow: function refreshShow() {
        this.updateAllScore();
    },

    _onRemoveAni: function _onRemoveAni() {
        this.leftMsgAni.removeFromParent();
        this.rightMsgAni.removeFromParent();
    },

    _onStartPlayTableChat: function _onStartPlayTableChat(seatId) {
        //打开相应动画
        //if (seatId == ddz.GlobalFuncs.GetNextIndex(this._tableScene._mySeatIndex)) {
        //    //是我的下家说话
        //    this._showChatAni(this.rightMsgAni);
        //
        //} else if (seatId == ddz.GlobalFuncs.getPreIndex(this._tableScene._mySeatIndex)) {
        //    //是我的上家说话
        //    this._showChatAni(this.leftMsgAni);
        //}
    },

    resetScore: function resetScore() {
        this.setScore('my', '--');
        this.setScore('left', '--');
        this.setScore('right', '--');
    },

    initScore: function initScore() {
        //var myIndex = this._tableScene._mySeatIndex;
        //var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        //var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);
        //
        //var ftInfo = this._tableScene.tableInfo().ftInfo;
        //
        //var score = ftInfo.getScore(myIndex - 1);
        //this.setScore('my', score);
        //
        //score = ftInfo.getScore(leftindex - 1);
        //this.setScore('left', score);
        //
        //score = ftInfo.getScore(rightindex - 1);
        //this.setScore('right', score);
    },

    updateAllScore: function updateAllScore(result) {
        var myIndex = this._tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var seatsInfo = null;
        if (result) {
            var mySeatInfo = result["seat" + myIndex];
            var leftInfo = result["seat" + leftindex];
            var rightInfo = result["seat" + rightindex];
            this.upDataScore('my', mySeatInfo[1], mySeatInfo[0]);
            this.upDataScore('left', leftInfo[1], leftInfo[0]);
            this.upDataScore('right', rightInfo[1], rightInfo[0]);
        } else {
            seatsInfo = this._tableScene.tableInfo().seats;
            var score = seatsInfo[myIndex - 1].mscore;
            var delta = null;
            this.upDataScore('my', score, delta);

            score = seatsInfo[leftindex - 1].mscore;
            this.upDataScore('left', score, delta);

            score = seatsInfo[rightindex - 1].mscore;
            this.upDataScore('right', score, delta);
        }
    },

    //更新分数
    upDataScore: function upDataScore(pos, scroe, delta) {
        var lblScoreChange, lblName;
        var deltaStr = "";
        if (delta == null) {
            deltaStr = "";
            lblName = "lblJiFenChange";
        } else if (delta >= 0) {
            deltaStr = "+" + delta;
            lblName = "lblJiFenChangeAdd";
        } else {
            deltaStr = "" + delta;
            lblName = "lblJiFenChange";
        }

        switch (pos) {
            case 'my':
                {
                    lblScoreChange = this.getScoreLabel(this.jifenNode, lblName);
                    break;
                }
            case 'left':
                {
                    lblScoreChange = this.getScoreLabel(this.jifenLeftNode, lblName);
                    break;
                }
            case 'right':
                {
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

        var flyAni = cc.sequence(cc.delayTime(2), cc.fadeOut(0.2), callBack);
        lblScoreChange.node.runAction(flyAni);
    },

    reSetAddScore: function reSetAddScore() {
        this.getScoreLabel(this.jifenNode, 'lblJiFenChangeAdd').string = "";
        this.getScoreLabel(this.jifenNode, 'lblJiFenChange').string = "";

        this.getScoreLabel(this.jifenLeftNode, 'lblJiFenChangeAdd').string = "";
        this.getScoreLabel(this.jifenLeftNode, 'lblJiFenChange').string = "";

        this.getScoreLabel(this.jifenRightNode, 'lblJiFenChangeAdd').string = "";
        this.getScoreLabel(this.jifenRightNode, 'lblJiFenChange').string = "";
    },

    setScore: function setScore(pos, scroe) {
        var lblScore;
        switch (pos) {
            case 'my':
                {
                    lblScore = this.getScoreLabel(this.jifenNode, 'lblJiFen');
                    break;
                }
            case 'left':
                {
                    lblScore = this.getScoreLabel(this.jifenLeftNode, 'lblJiFen');
                    break;
                }
            case 'right':
                {
                    lblScore = this.getScoreLabel(this.jifenRightNode, 'lblJiFen');
                    break;
                }
        }

        lblScore.string = scroe + "";
    },

    reset: function reset() {
        this._tableScene._leftPlayerController.setChatButtonActive(false);
        this._tableScene._rightPlayerController.setChatButtonActive(false);
        this._tableScene._operateController.setChatButtonActive(false);
        this.initStat = true;
        this.lblDiFen.string = "";
        this.jifenLeftNode.active = false;
        this.jifenRightNode.active = false;
        this.bottomNode.active = false;
        //this._tableScene.myAvatar.active = false;

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
    },

    getScoreLabel: function getScoreLabel(scoreNode, lblName) {
        return scoreNode.getChildByName(lblName).getComponent(cc.Label);
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        if (this.disbindsWindow) {
            this.disbindsWindow.removeFromParent();
        }
        this.disbindsWindow = null;
        this._tableScene = null;
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
        //# sourceMappingURL=ArenaMatchModule.js.map
        