"use strict";
cc._RF.push(module, 'c710e9h+vJNyatl3FaXgsLU', 'FtInfo');
// Script/ddz/models/FtInfo.js

"use strict";

/**
 * Created by xujing on 2018/4/13.
 */
ddz.FtInfo = cc.Class({
    //数据格式
    // "ftInfo":{
    //     "ftId":"113383",
    //     "creator":10001,
    //     "curRound":0,
    //     "playMode":{
    //         "name":"123",
    //         "displayName":"经典"
    //     },
    //     "totalRound":6,
    //     "double":0,
    //     "goodCard":0,
    //     "fee":0
    // },

    ftId: '',
    results: [],
    statics: {},
    curRound: 0, //好友桌总当前局数
    goodCard: 0, //是否为炸弹场
    totalRound: 0, //好友桌总局数
    allComplete: false, //是否整场都已经结束
    isComplete: false, //整场是否已经打完所有局数
    playMode: {
        "name": "123",
        "displayName": "经典"
    },
    iscreator: false,
    getScore: function getScore(index) {
        return this.getScoreInfo(index, 'score');
    },

    getDelta: function getDelta(index) {
        return this.getScoreInfo(index, 'delta');
    },

    getScoreInfo: function getScoreInfo(index, fname) {
        if (this.results && this.results.length > 0) {
            return this.results[this.results.length - 1].winloses[index][fname];
        }
        return 0;
    },

    clearResult: function clearResult() {
        this.results = [];
    },

    cleanup: function cleanup() {
        this.ftId = '';
        this.results = [];
        this.statics = {};
        this.curRound = 0; //好友桌总当前局数
        this.totalRound = 0; //好友桌总局数
        this.iscreator = false;
        this.isComplete = false;
        this.allComplete = false;
    },
    parseGameWin: function parseGameWin(gamewinAction) {
        ddz.LOGD(null, 'parseGameWin ：解析 game_win' + JSON.stringify(gamewinAction));
        this.curRound = gamewinAction.curRound;
        this.totalRound = gamewinAction.totalRound;
        this.results = gamewinAction.results;
        this.statics = gamewinAction.statics;

        this.isComplete = this.curRound == this.totalRound;
        this.allComplete = this.curRound == this.totalRound;

        ddz.detailsModel.parseFriendRound(this.curRound, this.totalRound);
        ddz.detailsModel.parseResults(this.results);
        ddz.detailsModel.setIsHisTory(false);
        ddz.detailsModel.setIsOver(this.allComplete);
        ddz.detailsModel.setIsNoWin(gamewinAction.nowin);
    },
    parseTableInfo: function parseTableInfo(tableInfo) {
        ddz.LOGD(null, 'parseTableInfo : ' + JSON.stringify(tableInfo.ftInfo));
        this.ftId = tableInfo.ftInfo.ftId;
        this.curRound = tableInfo.ftInfo.curRound;
        this.totalRound = tableInfo.ftInfo.totalRound;
        this.goodCard = tableInfo.ftInfo.goodCard;
        this.results = tableInfo.results;
        this.isComplete = false;
        this.allComplete = this.curRound == 0 && tableInfo['seat1']['state'] == ddz.Enums.SeatState.SEATDZSTAT_WAIT;

        ddz.detailsModel.parseFriendRound(this.curRound, this.totalRound);
        ddz.detailsModel.parseResults(this.results);
        ddz.detailsModel.setIsOver(this.allComplete);
        ddz.detailsModel.setIsHisTory(false);
        this.playMode = tableInfo.ftInfo.playMode;
        this.iscreator = tableInfo.ftInfo.creator == ty.UserInfo.userId;

        ddz.Share.shareKeywordReplace.inviteFriendID = this.ftId;
        ddz.Share.shareKeywordReplace.totalRound = this.totalRound;
        ddz.Share.shareKeywordReplace.displayName = this.playMode.name == "happy" ? "欢乐" : this.playMode.name == "wild" ? "癞子" : "经典";
        ddz.Share.shareKeywordReplace.goodCard = tableInfo.ftInfo.goodCard == 0 ? "标准" : "炸弹";
        ty.NotificationCenter.trigger(ddz.EventType.FTINFO_CHANGE);
    },
    parseGameReady: function parseGameReady(gameReady) {
        ddz.LOGD(null, 'parseTableInfo : ' + JSON.stringify(gameReady));
        //有问题,容错
        this.ftId = gameReady.ftInfo ? gameReady.ftInfo.ftId : "";
        this.curRound = gameReady.ftInfo.curRound;
        this.totalRound = gameReady.ftInfo.totalRound;
        this.iscreator = gameReady.ftInfo.creator == ty.UserInfo.userId;
        this.isComplete = false;

        ddz.Share.shareKeywordReplace.inviteFriendID = this.ftId;
        ty.NotificationCenter.trigger(ddz.EventType.FTINFO_CHANGE);
    },
    parseFTDisbind: function parseFTDisbind(ftDisbindAction) {
        this.results = ftDisbindAction.results;
        this.statics = ftDisbindAction.statics;
    }
});

cc._RF.pop();