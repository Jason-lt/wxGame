"use strict";
cc._RF.push(module, 'fcaf0n/O9VMX5f0uH0Va0W9', 'GoldModule');
// Script/ComponentScript/window/GoldModule.js

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

cc.Class(_defineProperty({
    extends: cc.Component,

    properties: {
        jifenNode: cc.Node,
        jifenLeftNode: cc.Node,
        jifenRightNode: cc.Node,
        lblDiFen: cc.Label,
        lblNum: cc.Label,
        game_result: cc.Prefab,
        tasksNode: cc.Node,
        baseScore: cc.Node,
        pouringLabel: cc.Label,
        betLabel: cc.Label

        // aniDiFen:cc.Label,
        // lblDiFen_1:cc.Label,
        // fanbei:cc.Node,
    },

    ctor: function ctor() {},
    betScoreChangeAni: function betScoreChangeAni() {},
    setTableScene: function setTableScene(val) {
        this._tableScene = val;
        // this._tableInfoChange(this._tableScene.tableInfo());
        // this.refresh();
    },

    refresh: function refresh() {
        // this._tableScene.myAvatar.active = this._tableScene._tableState.normalInfo.m_state != ddz.Enums.TableState.TABLEDSTAT_PLAYING;

        this.initScore();
        // if (this._tableScene._leftSeatinfo.hasData && this._tableScene._rightSeatinfo.hasData){
        //坐滿了,
        this._onGameReady();
        // }

        // if (this._tableScene._leftSeatinfo.hasData){
        this._onUpdateInfo({ pos: 'left', type: 'sit' });
        // }

        // if (this._tableScene._rightSeatinfo.hasData){
        this._onUpdateInfo({ pos: 'right', type: 'sit' });
        // }
    },

    updateMultiple: function updateMultiple(baseScore, multiple) {
        // this.lblDiFen.string = baseScore + " x " + multiple + "倍";
        this.baseScore.active = true;
        this.pouringLabel.string = baseScore;
        this.betLabel.string = multiple;
    },

    // hideGoldInfo:function(){
    //     this.goldInfoNode.active = false;
    // },

    onLoad: function onLoad() {
        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_PLAYER_INFO, {pos:'right', type:'leave'});
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_PLAYER_INFO, this._onUpdateInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_READY, this._onGameReady, this);
        ty.NotificationCenter.listen(ddz.EventType.TABLE_INFO_CHAGE, this._tableInfoChange, this);
        ty.NotificationCenter.listen(ddz.EventType.BUY_CHIP_CHANEG, this._onByInChipChange, this);
        ty.NotificationCenter.listen(ddz.EventType.BET_SCORE_CHANGE_ANI, this.betScoreChangeAni, this);

        // this.startAni();
        // this.initScore();
        if (ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType) {
            var widL = this.jifenLeftNode.getComponent(cc.Widget);
            widL.top = 324;
            var widR = this.jifenRightNode.getComponent(cc.Widget);
            widR.top = 324;
        }
    },

    _onByInChipChange: function _onByInChipChange() {
        var mscore = hall.ME.getChip();
        this.setScore('my', mscore);
    },

    _onGameReady: function _onGameReady() {
        ty.NotificationCenter.trigger(ddz.EventType.STOP_MATCHING);

        this._tableScene.showGoldInfo();
    },

    _tableInfoChange: function _tableInfoChange(tableInfo) {},

    _onUpdateInfo: function _onUpdateInfo(obj) {
        var mscore = 0;
        var userPanel;
        if (obj.pos == 'left') {
            mscore = this._tableScene._leftSeatinfo.model.m_buyinChip;
            userPanel = this.jifenLeftNode;
        } else if (obj.pos == 'right') {
            mscore = this._tableScene._rightSeatinfo.model.m_buyinChip;
            userPanel = this.jifenRightNode;
        }
        userPanel.active = true;
        if (obj.type == 'leave') {
            mscore = 0;
            userPanel.active = false;
        }
        if (obj.type == 'sit') {
            if (this._tableScene._rightSeatinfo.hasData && this._tableScene._leftSeatinfo.hasData) {
                this._onGameReady();
            }
        }
        this.setScore(obj.pos, mscore);
    },

    initScore: function initScore() {

        // var mscore = this._tableScene._mySeatinfo.model.m_buyinChip;
        var mscore = hall.ME.getChip();
        this.setScore('my', mscore);

        mscore = this._tableScene._leftSeatinfo.model.m_buyinChip;;
        // if (this._tableScene._leftSeatinfo.hasData){
        //     mscore = this._tableScene._leftSeatinfo.model.m_buyinChip;
        // }

        this.setScore('left', mscore);

        mscore = this._tableScene._rightSeatinfo.model.m_buyinChip;
        // if (this._tableScene._rightSeatinfo.hasData){
        //     mscore = this._tableScene._rightSeatinfo.model.m_buyinChip;
        // }
        this.setScore('right', mscore);
    },

    updateAllScore: function updateAllScore(result) {

        var myIndex = this._tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var checkSeatIsWin = function checkSeatIsWin(seatIndex) {
            var dizhuWin = result.dizhuwin;
            var isWin = false;
            if (seatIndex == result.stat.dizhu) {
                isWin = dizhuWin;
            } else {
                isWin = !dizhuWin;
            }
            return isWin;
        };

        var checkIsDizhu = function checkIsDizhu(seatIndex) {
            var isDizhu = false;
            if (seatIndex == result.stat.dizhu) {
                isDizhu = true;
            }
            return isDizhu;
        };

        var call = result.stat.call;
        var bc = result.stat.bomb;
        bc = Math.pow(2, bc);
        var chuntian = result.stat.chuntian;
        var base = result.stat.base;

        var score = hall.ME.getChip();
        var delta = parseInt(call * bc * chuntian * base);
        var deltaList = this.getDeltaScore(delta, result);
        delta = deltaList._mdel;
        this.upDataScore('my', score, delta, checkSeatIsWin(myIndex));

        score = this._tableScene._leftSeatinfo.model.m_buyinChip;
        delta = deltaList._ldel;
        this.upDataScore('left', score, delta, checkSeatIsWin(leftindex));

        score = this._tableScene._rightSeatinfo.model.m_buyinChip;
        delta = deltaList._rdel;
        this.upDataScore('right', score, delta, checkSeatIsWin(rightindex));
    },

    getDeltaScore: function getDeltaScore(delta, result) {
        var _delta = delta;
        var _mScore = hall.ME.getChip();
        var _lScore = this._tableScene._leftSeatinfo.model.m_buyinChip;
        var _rScore = this._tableScene._rightSeatinfo.model.m_buyinChip;

        var _ldel = _delta;
        var _rdel = _delta;
        var _mdel = _delta;

        var checkIsDizhu = function checkIsDizhu(seatIndex) {
            var isDizhu = false;
            if (seatIndex == result.stat.dizhu) {
                isDizhu = true;
            }
            return isDizhu;
        };
        var isDiZhu = false;
        var myIndex = this._tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);
        var winPlayer = result.winPlayer;
        if (winPlayer == myIndex) {
            isDiZhu = checkIsDizhu(myIndex);
            if (isDiZhu) {
                if (_ldel > _lScore) {
                    _ldel = _lScore;
                }
                if (_rdel > _rScore) {
                    _rdel = _rScore;
                }
                _mdel = _ldel + _rdel;
            } else {
                if (leftindex == result.stat.dizhu) {
                    if (_lScore < _delta * 2) {
                        _rdel = parseInt(_lScore / 2);
                        _mdel = parseInt(_lScore / 2);
                    }
                } else {
                    if (_rScore < _delta * 2) {
                        _ldel = parseInt(_lScore / 2);
                        _mdel = parseInt(_lScore / 2);
                    }
                }
            }
        } else if (winPlayer == leftindex) {
            isDiZhu = checkIsDizhu(leftindex);
            if (isDiZhu) {
                if (_mdel > _mScore) {
                    _mdel = _mScore;
                }
                if (_rdel > _rScore) {
                    _rdel = _rScore;
                }
                _ldel = _mdel + _rdel;
            } else {
                if (myIndex == result.stat.dizhu) {
                    if (_mScore < _delta * 2) {
                        _rdel = parseInt(_mScore / 2);
                        _ldel = parseInt(_mScore / 2);
                    }
                } else {
                    if (_rScore < _delta * 2) {
                        _ldel = parseInt(_rScore / 2);
                        _mdel = parseInt(_rScore / 2);
                    }
                }
            }
        } else if (winPlayer == rightindex) {
            isDiZhu = checkIsDizhu(rightindex);
            if (isDiZhu) {
                if (_mdel > _mScore) {
                    _mdel = _mScore;
                }
                if (_ldel > _lScore) {
                    _ldel = _rScore;
                }
                _rdel = _ldel + _mdel;
            } else {
                if (leftindex == result.stat.dizhu) {
                    if (_lScore < _delta * 2) {
                        _rdel = parseInt(_lScore / 2);
                        _mdel = parseInt(_lScore / 2);
                    }
                } else {
                    if (_rScore < _delta * 2) {
                        _ldel = parseInt(_rScore / 2);
                        _mdel = parseInt(_rScore / 2);
                    }
                }
            }
        }

        var data = {};
        data._mdel = _mdel;
        data._ldel = _ldel;
        data._rdel = _rdel;
        ddz.LOGD("", "file = [GoldModule] fun = [getDeltaScore] 当前输赢分数 data = " + JSON.stringify(data));
        return data;
    },

    //更新分数
    upDataScore: function upDataScore(pos, scroe, delta, isWin) {
        var lblScoreChange, lblName;
        if (isWin) {
            scroe = scroe + delta;
        } else {
            scroe = scroe - delta;
        }
        var deltaStr = hall.GlobalFuncs.formatGold(delta);
        if (isWin) {
            deltaStr = "+" + deltaStr;
            lblName = "lblJiFenChangeAdd";
        } else {
            if (delta == 0) {
                deltaStr = "-0";
            }
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
        that.setScore(pos, scroe);
        var callBack = cc.callFunc(function () {
            lblScoreChange.node.opacity = 255;
            lblScoreChange.string = "";
        });

        var flyAni = cc.sequence(cc.delayTime(5), cc.fadeOut(0.2), callBack);
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
                    hall.ME.setChip(scroe);
                    this._tableScene._mySeatinfo.model.m_buyinChip = scroe;
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

        lblScore.string = hall.GlobalFuncs.formatGold(scroe) + "";
    },

    showResult: function showResult(result) {
        ddz.LOGD("", "file = [DdzTableScene] fun = [_startGameOverAnimation] 金币场显示结算界面 result = " + JSON.stringify(result));
        this._tableScene._reset();
        if (!this._gameResult) {
            var game_result_wnd = cc.instantiate(this.game_result);
            cc.director.getScene().addChild(game_result_wnd);
            this._gameResult = game_result_wnd.getComponent("ddz_game_result");
            this._gameResult.setTableScene(this._tableScene);
        }
        this._gameResult.show(result);

        // var mySeatIndex = this._tableScene._mySeatIndex;
        // if (mySeatIndex == result.stat.dizhu){
        //     var saveCardsString =  hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ORIGINCARDS, "");
        //     var saveCardsDic = JSON.parse(saveCardsString);
        //     var cards = saveCardsDic.myCards;
        //     var baseCards = saveCardsDic.baseCard;
        //     cards = cards.concat(baseCards);
        //     var saveDic = {myCards:cards,baseCard:baseCards};
        //     hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.ORIGINCARDS, JSON.stringify(saveDic));
        // }

        // this.scheduleOnce(function () {
        //     if(result.winShare){
        //         ddz.GlobalFuncs.showShareGuideWindow(true,result.winShare.winChip,result.winShare.rewardDoubles,result.winShare.adsCounts);
        //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,
        //             ["loseTipsWindow",result.winShare.winChip,result.winShare.rewardDoubles]);
        //     }else if(result.loseShare){
        //         ddz.GlobalFuncs.showShareGuideWindow(false,result.loseShare.loseChip,result.loseShare.rewardDoubles,result.loseShare.adsCounts);
        //         ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow,
        //             ["winTipsWindow",result.loseShare.loseChip,result.loseShare.rewardDoubles]);
        //     }else if(result.winchips){
        //         ddz.GlobalFuncs.showShareMomentsItem("showy_highTotal",result.winchips);
        //     }else if(result.winstreak){
        //         ddz.GlobalFuncs.showShareMomentsItem("showy_winningStreak",result.winstreak);
        //     }
        //
        //     // if(result.winchips){
        //     //     ddz.GlobalFuncs.showShareMomentsItem("showy_highTotal",result.winchips);
        //     // }else if(result.winstreak){
        //     //     ddz.GlobalFuncs.showShareMomentsItem("showy_winningStreak",result.winstreak);
        //     // }
        //
        // }.bind(this),1);
    },

    getScoreLabel: function getScoreLabel(scoreNode, lblName) {
        return scoreNode.getChildByName(lblName).getComponent(cc.Label);
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        // this.tasksNode.removeAllChildren();
        this._tableScene = null;
    },

    reset: function reset() {
        this.lblDiFen.string = "";
        this.baseScore.active = false;
        this.jifenLeftNode.active = false;
        this.jifenRightNode.active = false;

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

    update: function update(dt) {},

    onBack: function onBack() {
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var tableinfo = this._tableScene.tableInfo();
        var _mixID = tableinfo.mixId;
        var _roomId = tableinfo.roomId();
        if (!_roomId) {
            var _queueInfo = ddz.matchModel.getCurQueueInfo();
            _roomId = _queueInfo.roomId;
        }
        ddz.MsgFactory.getRoomLeave(_roomId, tableinfo.tableId(), this._tableScene._mySeatIndex, _mixID);
    }
}, 'onDestroy', function onDestroy() {
    ty.NotificationCenter.ignoreScope(this);
}));

cc._RF.pop();