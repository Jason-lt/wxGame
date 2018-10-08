(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/FriendModule.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '021f5jIl1hDDblrF+m/ZAUz', 'FriendModule', __filename);
// Script/ComponentScript/window/FriendModule.js

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
        btnInvite: cc.Button,
        btnReady: cc.Button,
        btnDuiJu: cc.Button,
        btnRecord: cc.Button,
        btnChat: cc.Button,
        disbinds: [],
        namesForSeat: [],
        lblNum: cc.Label,
        shouldLeave: false,
        disbindResult: 0,
        recordNode: cc.Node,
        recordProgressNode: cc.Node,
        recordProgressSprite: cc.Sprite,
        recordProgressFrame: [cc.SpriteFrame],
        recordNowIndex: 3,
        recordBackNode: cc.Node,
        rbar: cc.Sprite,
        recordTip: cc.Node,
        leftMsgAni: cc.Node,
        rightMsgAni: cc.Node,
        selfMsgAni: cc.Node,
        chatNode: cc.Node,
        leftMsgNode: cc.Node,
        rightMsgNode: cc.Node,
        selfMsgNode: cc.Node,
        game_result: cc.Prefab,
        allMsgShowTime: 2,
        leftShowTime: 0,
        rightShowTime: 0,
        selfShowTime: 0
    },

    ctor: function ctor() {
        this.resetStartTime();
        this._isOnRecord = false;
        this._maxRecordTime = 8;
        this._cancelRecord = false;
        this.chatStringList = ["咱们一会儿再开一场!", "炸的漂亮!", "哎呀,一不小心又赢了。", "来呀,互相伤害呀!", "稍等一会儿,我马上回来。", "来来来，炸我呀!", "你的牌打得也太好了!", "我等的假花儿都谢了!"];
    },

    resetStartTime: function resetStartTime() {
        this._recordTime = 0;
    },

    setTableScene: function setTableScene(val) {
        this._tableScene = val;
        this.refresh();
    },

    refresh: function refresh() {
        var ftInfo = this._tableScene.tableInfo().ftInfo;
        this.setBtnReadyState(!ftInfo.allComplete && this._tableScene._mySeatinfo.model.m_state == ddz.Enums.SeatState.SEATDZSTAT_WAIT);
        this._tableScene.myAvatar.active = this._tableScene._tableState.normalInfo.m_state != ddz.Enums.TableState.TABLEDSTAT_PLAYING;
        // this._tableScene._leftPlayerController.setClockVisible(false);
        // this._tableScene._rightPlayerController.setClockVisible(false);
        this.updateDuiJuBtnLabel();

        if (debugMode) {
            this.lblNum.string = "牌桌号:" + this._tableScene.tableInfo().ftInfo.ftId;
        }

        if (this._tableScene._tableState && this._tableScene._tableState.normalInfo.m_call > -1) {
            this._tableScene._refreshMultipleLabel(false, true, true);
        }
    },

    updateMultiple: function updateMultiple(baseScore, multiple) {
        this.lblDiFen.string = baseScore + "分 x " + multiple + "倍";
    },

    updateDuiJuBtnLabel: function updateDuiJuBtnLabel() {
        var lbl = this.btnDuiJu.node.getChildByName('Label').getComponent(cc.Label);
        lbl.string = this._tableScene.tableInfo().ftInfo.curRound + "/" + this._tableScene.tableInfo().ftInfo.totalRound + "局";
    },

    endResultShow: function endResultShow() {
        if (this.shouldLeave && this._tableScene.tableInfo().ftInfo.curRound < 1) {
            hall.GlobalFuncs.gotoDdz();
            return;
        }
        // hall.GlobalFuncs.gotoDdz();
        // if (hall.GlobalFuncs && hall.GlobalFuncs.gotoDdz)
        if (this.disbindResult == 1) {
            if (ddz.detailsModel.resuslts.length <= 0 || ddz.detailsModel.isNowin == 1) {
                hall.GlobalFuncs.gotoDdz();
            } else {
                ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeEndFriendGame, [this._tableScene.tableInfo().ftInfo.totalRound, this._tableScene.tableInfo().ftInfo.curRound, ddz.Share.shareKeywordReplace.goodCard]);
                hall.GlobalFuncs.onShowDetail();
                this.shouldLeave = true;
                ty.Timer.setTimer(this, this.leaveAction, 300);
            }
        }
    },
    leaveAction: function leaveAction() {
        this.unscheduleAllCallbacks();
        hall.GlobalFuncs.gotoDdz();
    },
    reciveOnHide: function reciveOnHide() {},
    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_PLAYER_INFO, this._onUpdateInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_READY, this._onGameReady, this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_DISBIND, this.reciveFtDisbind, this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_REQ_DISBIND, this.reciveDisbind, this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_REQ_DISBIND_ANSWER, this.reciveDisbindAnswer, this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_FT_REQ_DISBIND_RESULT, this.reciveDisbindResult, this);
        // ty.NotificationCenter.listen(ddz.EventType.ACTION_CAN_ROOM_LEAVE,this.reciveCanRoomLeave,this);
        ty.NotificationCenter.listen(ddz.EventType.ACTION_END_RESULT_SHOW, this.endResultShow, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE, this.reciveOnHide, this);

        ty.NotificationCenter.listen(ddz.EventType.FTINFO_CHANGE, this.onFtInfoChange, this);

        ddz.NetWorkCenter.canNotLeave = true;

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.btnBack.node.y = backButtonH;
        }

        this.btnRecord.node.on(cc.Node.EventType.TOUCH_START, this._onRecordBtnTouchBegan, this, true);
        this.btnRecord.node.on(cc.Node.EventType.TOUCH_MOVE, this._onRecordBtnTouchMoved, this, true);
        this.btnRecord.node.on(cc.Node.EventType.TOUCH_END, this._onRecordBtnTouchEnded, this, true);
        this.btnRecord.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onRecordBtnTouchCancel, this, true);

        // var that = this;
        // ty.Timer.setTimer(this, function () {
        //     that.upDataScore('my', 200, 6);
        // }, 5, 0);

        ty.NotificationCenter.listen(ddz.EventType.STOP_RECORD, this._onRecordComplete, this);
        ty.NotificationCenter.listen(ddz.EventType.ERROR_RECORD, this._onRecordError, this);
        ty.NotificationCenter.listen(ddz.EventType.START_PLAY_TABLE_CHAT, this._onStartPlayTableChat, this);
        ty.NotificationCenter.listen(ddz.EventType.SHOW_TABLE_CHAT, this._onShowPlayTableChat, this);
        ty.NotificationCenter.listen(ddz.EventType.END_PLAY_TABLE_CHAT, this._onEndTableChat, this);

        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this._onRemoveAni, this);

        if (ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType) {
            var wid = this.bottomNode.getComponent(cc.Widget);
            wid.bottom = 30;
            var widL = this.jifenLeftNode.getComponent(cc.Widget);
            widL.top = 160;
            var widR = this.jifenRightNode.getComponent(cc.Widget);
            widR.top = 160;
        }
        this.initScore();
    },

    _onUpdateInfo: function _onUpdateInfo(obj) {
        var userPanel;
        if (obj.pos == 'left') {
            userPanel = this.jifenLeftNode;
        } else if (obj.pos == 'right') {
            userPanel = this.jifenRightNode;
        }
        userPanel.active = true;
        if (obj.type == 'leave' || obj.type == 'none') {
            userPanel.active = false;
        }
    },
    _onGameReady: function _onGameReady() {
        this.jifenLeftNode.active = true;
        this.jifenRightNode.active = true;
    },

    onBtnChat: function onBtnChat() {
        this.chatNode.active = true;
    },

    _onRemoveAni: function _onRemoveAni() {
        this.leftMsgAni.removeFromParent();
        this.rightMsgAni.removeFromParent();
        this.selfMsgAni.removeFromParent();
    },

    _onStartPlayTableChat: function _onStartPlayTableChat(seatId) {
        //打开相应动画
        if (seatId == ddz.GlobalFuncs.GetNextIndex(this._tableScene._mySeatIndex)) {
            //是我的下家说话
            this._showChatAni(this.rightMsgAni);
        } else if (seatId == ddz.GlobalFuncs.getPreIndex(this._tableScene._mySeatIndex)) {
            //是我的上家说话
            this._showChatAni(this.leftMsgAni);
        } else if (seatId == this._tableScene._mySeatIndex) {
            //是我自己在说话
            this._showChatAni(this.selfMsgAni);
        }
    },
    _onShowPlayTableChat: function _onShowPlayTableChat(result) {
        var seatId = parseInt(result.seatId);
        if (seatId == ddz.GlobalFuncs.GetNextIndex(this._tableScene._mySeatIndex)) {
            //是我的下家说话
            this.rightShowTime = this.allMsgShowTime;
            this._showChatMsgRight(this.rightMsgNode, result.msg);
        } else if (seatId == ddz.GlobalFuncs.getPreIndex(this._tableScene._mySeatIndex)) {
            //是我的上家说话
            this.leftShowTime = this.allMsgShowTime;
            this._showChatMsgRight(this.leftMsgNode, result.msg);
        } else if (seatId == this._tableScene._mySeatIndex) {
            //是我自己在说话
            this.selfShowTime = this.allMsgShowTime;
            this._showChatMsgRight(this.selfMsgNode, result.msg);
        }
    },

    _onEndTableChat: function _onEndTableChat(seatId) {
        //关闭相应动画
        if (seatId == ddz.GlobalFuncs.GetNextIndex(this._tableScene._mySeatIndex)) {
            //是我的下家停止说话
            this._stopChatAni(this.rightMsgAni);
        } else if (seatId == ddz.GlobalFuncs.getPreIndex(this._tableScene._mySeatIndex)) {
            //是我的上家停止说话
            this._stopChatAni(this.leftMsgAni);
        } else if (seatId == this._tableScene._mySeatIndex) {
            //是我自己停止说话
            this._stopChatAni(this.selfMsgAni);
        }
    },

    _showChatAni: function _showChatAni(aniNode) {
        aniNode.active = true;
        var ani = aniNode.getComponent(cc.Animation);
        ani.play('table_chat_ani');
    },
    _showChatMsgRight: function _showChatMsgRight(msgNode, msgString) {
        msgNode.active = true;
        var nodeMa = msgNode.getComponent("ddz_item_ft_chat");
        nodeMa.setDetailMsg(msgString);
    },

    _stopChatAni: function _stopChatAni(aniNode) {
        aniNode.active = false;
        var ani = aniNode.getComponent(cc.Animation);
        ani.stop('table_chat_ani');
    },

    _onRecordComplete: function _onRecordComplete(audioFilePath) {
        var fs = wx.getFileSystemManager();

        if (this.recordNode.active) {
            this.recordNode.active = false;
            this._isOnRecord = false;
        }

        if (this._recordTime < 1) {
            var that = this;
            that.recordTip.active = true;
            this.scheduleOnce(function () {
                that.recordTip.active = false;
            }, 3);
            ddz.LOGD(null, "录音小于1S,不发送!");
            fs.unlinkSync(audioFilePath);
            return;
        }
        var tableInfo = this._tableScene.tableInfo();

        var fileStr = fs.readFileSync(audioFilePath, 'base64');

        // ddz.LOGD(null, "音频文件:" + fileStr + ":结束");
        // var filePath = wx.env.USER_DATA_PATH + '/seat_' + 2 + '_msg.' + ddz.recordFileType;
        // fs.writeFileSync(filePath ,fileStr , 'base64');
        //
        // var musicPlayManager = wx.createInnerAudioContext();
        // musicPlayManager.autoplay = true;
        // musicPlayManager.loop = false;
        // musicPlayManager.volume = 1;
        // musicPlayManager.src = filePath;

        // fs.unlinkSync(audioFilePath);

        // wx.uploadFile({
        //     url:'http://www.tuvovo.com/tu.php',
        //     filePath : audioFilePath,
        //     name : 'file',
        //     success:function () {
        //         hall.LOGD(null, "上传文件成功:" + JSON.stringify(arguments))
        //     },
        //     fail:function () {
        //         hall.LOGD(null, "上传文件失败:" + JSON.stringify(arguments))
        //     }
        // });

        hall.MsgFactory.sendChatMsg(tableInfo.roomId(), tableInfo.tableId(), this._tableScene._mySeatIndex, fileStr, 2, 0);
    },

    onBtnChatDetail: function onBtnChatDetail(event, type) {
        this.chatNode.active = false;
        if (type == "cancel") {
            return;
        }
        var sendMsg = this.chatStringList[parseInt(type)];
        var tableInfo = this._tableScene.tableInfo();
        hall.MsgFactory.sendChatMsg(tableInfo.roomId(), tableInfo.tableId(), this._tableScene._mySeatIndex, sendMsg, 0, 0);
    },

    _onRecordError: function _onRecordError() {
        hall.LOGE("", "file = [FriendModule] fun = [_onRecordError] 语音错误");
        if (this.recordNode.active) {
            this.recordNode.active = false;
            this._isOnRecord = false;
        }
    },

    _onRecordBtnTouchBegan: function _onRecordBtnTouchBegan(event) {
        ddz.LOGD(null, "Beganevent:" + event);
        ddz.AudioHelper.getMusicPlayManager().volume = 0;
        this.resetStartTime();
        // this._cancelRecord = false;
        this.recordNode.active = true;
        this._btnRecordStatePressed = true;
        this.recordProgressNode.active = true;
        this.recordBackNode.active = false;

        var that = this;
        var startRecord = function startRecord() {
            if (!that._btnRecordStatePressed) {
                return;
            }
            that._isOnRecord = true;
            that.recordNode.active = true;
            hall.recorder.startRecord(that._maxRecordTime);
        };

        wx.getSetting({
            success: function success(res) {
                if (!res.authSetting['scope.record']) {
                    wx.authorize({
                        scope: "scope.record",
                        success: function success() {
                            startRecord();
                        },
                        fail: function fail() {
                            hall.MsgBoxManager.showToast({ title: '授权失败,语音功能不可用,请手动进行授权!' });
                            ty.Timer.setTimer(cc.director, function () {
                                wx.openSetting();
                            }, 2, 0);
                        },
                        complete: function complete() {}
                    });
                } else {
                    startRecord();
                }
            }
        });
    },

    _onRecordBtnTouchMoved: function _onRecordBtnTouchMoved(event) {
        ddz.LOGD(null, "Movedevent:" + event);
        ddz.AudioHelper.getMusicPlayManager().volume = 0;
        if (event.touch._point.y - event.touch._startPoint.y > 20) {
            // this._cancelRecord = true;
            if (this._isOnRecord) {
                this._isOnRecord = false;
                // this.recordNode.active = true;
                this.recordProgressNode.active = false;
                this.recordBackNode.active = true;
                // hall.recorder.stop(true);
                hall.recorder.pauseRecord();
            }
        } else {
            if (!this._isOnRecord) {
                this._isOnRecord = true;
                // this.recordNode.active = true;
                this.recordProgressNode.active = true;
                this.recordBackNode.active = false;
                hall.recorder.resumeRecord();
            }

            var oriIndex = this.recordNowIndex;
            var indexp = hall.GlobalFuncs.getRandomNumberBefore(2);
            var changeNumber = hall.GlobalFuncs.getRandomNumberBefore(3);
            oriIndex = indexp == 0 ? oriIndex - changeNumber : oriIndex + changeNumber;
            oriIndex = oriIndex < 0 ? 0 : oriIndex;
            oriIndex = oriIndex > 6 ? 6 : oriIndex;
            this.recordNowIndex = oriIndex;
            this.recordProgressSprite.spriteFrame = this.recordProgressFrame[oriIndex];
        }
    },

    _onRecordBtnTouchEnded: function _onRecordBtnTouchEnded(event) {
        ddz.LOGD(null, "Endedevent:" + event);
        ddz.AudioHelper.getMusicPlayManager().volume = 1;
        this._btnRecordStatePressed = false;
        // this.recordNode.active = false;
        hall.recorder.stop(false);
    },

    _onRecordBtnTouchCancel: function _onRecordBtnTouchCancel(event) {
        ddz.LOGD(null, "Cancelevent:" + event);
        ddz.AudioHelper.getMusicPlayManager().volume = 1;
        this._btnRecordStatePressed = false;
        this._isOnRecord = false;
        this.recordNode.active = false;
        hall.recorder.stop(true);
    },

    onFtInfoChange: function onFtInfoChange() {
        this.updateDuiJuBtnLabel();
    },

    onBigBtnClick: function onBigBtnClick(event, par0) {
        var tableInfo = this._tableScene.tableInfo();
        ddz.LOGD("FriendModule", "par0:" + par0);
        if (this.shouldLeave) {
            this.unscheduleAllCallbacks();
            hall.GlobalFuncs.gotoDdz();
            return;
        }

        switch (par0) {
            case 'invire':
                {
                    //邀请好友
                    ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeInviteFriend);
                    break;
                }
            case 'ready':
                {
                    //准备
                    ddz.MsgFactory.getReady(tableInfo.roomId(), tableInfo.tableId(), this._tableScene._mySeatIndex);
                    break;
                }
            case 'back':
                {
                    //解散,返回
                    var state = this._tableScene._tableState.normalInfo.m_state;
                    // var gameStatus = this._tableScene._status;
                    // this._tableScene.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_GAMEOVER
                    if (this._tableScene.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_GAMEOVER)) {
                        return;
                    }
                    if (state == ddz.Enums.TableState.TABLEDSTAT_IDLE && this._tableScene.tableInfo().ftInfo.curRound == 0) {
                        if (tableInfo.ftInfo.iscreator) {
                            this.showTipsWindow("你确定要解散牌桌吗?");
                        } else {
                            ddz.friendModel.reqDisbind(tableInfo.roomId(), tableInfo.tableId(), this._tableScene._mySeatIndex);
                        }
                    } else {
                        this.showTipsWindow("你确定要发起投票中途退出吗?");
                    }
                    break;
                }
        }
    },

    showTipsWindow: function showTipsWindow(tipsString) {
        var preFabPath = "prefabs/ddz_window_tips";
        var comName = "ddz_tipsWindow";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [{ title: "取消" }, { title: "确定" }];
            window.setTitleContentAndButtons("提示", tipsString, testArray);
        });
    },
    onClickRightButton: function onClickRightButton() {
        var tableInfo;
        if (this.waitAnswer) {
            tableInfo = this._tableScene.tableInfo();
            ddz.friendModel.ansDisbind(this._tableScene._roomId, tableInfo.tableId(), this._tableScene._mySeatIndex, 0);
            // return;
        } else {
            tableInfo = this._tableScene.tableInfo();
            ddz.friendModel.reqDisbind(tableInfo.roomId(), tableInfo.tableId(), this._tableScene._mySeatIndex);
        }
        this.waitAnswer = false;
    },
    onClickLeftButton: function onClickLeftButton() {
        if (this.waitAnswer) {
            var tableInfo = this._tableScene.tableInfo();
            ddz.friendModel.ansDisbind(this._tableScene._roomId, tableInfo.tableId(), this._tableScene._mySeatIndex, 1);
            this.waitAnswer = false;
        }
    },
    reciveFtDisbind: function reciveFtDisbind(result) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomDissolveClick, ["success"]);
        if (this.disbinds && this.disbinds.length && this.disbinds.length > 0) {
            return;
        }
        hall.LOGE("===", "====reciveFtDisbind=========" + JSON.stringify(result));
        this.shouldLeave = true;
        var preFabPath = "prefabs/dissolveNode";
        var comName = "ddz_window_dissolve";
        // var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            // var tableInfo = that._tableScene.tableInfo();
            if (!ddz.NetWorkCenter.canNotLeave) {
                window.setTipsSString("你已解散牌桌");
            } else {
                window.setTipsSString("房主已解散牌桌");
            }
        });
    },
    reciveDisbind: function reciveDisbind(result) {
        this.disbinds = [];
        hall.LOGD("===", "====reciveDisbind=========" + JSON.stringify(result));
        var that = this;
        var callBack = function callBack(preFabNode, comName) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            if (result.userId == ty.UserInfo.userId) {
                //发起者
                window.setDissolvePregrossForCreator(result.optime, [1, -1, -1]);
                window.noDissolve = true;
                that.disbindsOwer = true;
            } else {
                var tableInfo = that._tableScene.tableInfo();
                var name;
                if (tableInfo.nameList.length > 2) {
                    name = tableInfo.nameList[result.seatId - 1];
                } else {
                    name = "玩家未知";
                }
                window.setDissolvePregrossForAnswer(result.optime, [1, -1, -1], name);
                window.noDissolve = true;
                that.disbindsOwer = false;
                that.waitAnswer = true;
            }
            that.disbinds.push(1);
        };
        ddz.GlobalFuncs.showWindowTipsForFriend(callBack);
    },

    reciveDisbindAnswer: function reciveDisbindAnswer(result) {
        hall.LOGD("===", "====reciveDisbindAnswer=========" + JSON.stringify(result));
        var disbindsR = result.disbinds;
        var anser = disbindsR[result.seatId - 1];
        this.disbinds.push(anser);
        var window;
        if (ddz.friendModel.tipsWindow) {
            window = ddz.friendModel.tipsWindow.getComponent("ddz_tipsWindow");
        } else {
            return;
        }
        window.changePregross(this.disbinds);

        if (ty.UserInfo.userId == result.userId) {
            if (!this.disbindsOwer) {
                window.changeStateToWait(anser);
            }
        }
    },

    reciveDisbindResult: function reciveDisbindResult(result) {
        this.waitAnswer = false;
        ddz.NetWorkCenter.canNotLeave = true;
        //出结果啦~~~~
        hall.LOGD("++++", "=======reciveDisbindResult=====" + JSON.stringify(result));
        var window;
        if (ddz.friendModel.tipsWindow) {
            window = ddz.friendModel.tipsWindow.getComponent("ddz_tipsWindow");
        } else {
            return;
        }
        // window.noDissolve = false;
        window.onClose();
        var disbindResult = result.disbindResult;
        this.disbindResult = disbindResult;
        var disbinds = result.disbinds;
        var preFabPath = "prefabs/dissolveNode";
        var comName = "ddz_window_dissolve";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            var tableInfo = that._tableScene.tableInfo();
            var nameA = [];
            if (disbindResult == 0) {
                if (tableInfo.nameList.length < 3) {
                    window.setDissolveFailDetailTextString("玩家1", "玩家2");
                    return;
                }
                for (var i = 0; i < 3; i++) {
                    if (disbinds[i] == 0) {
                        var name = tableInfo.nameList[i];
                        nameA.push(name);
                    }
                }
                window.setDissolveFailDetailTextString(nameA, false);
                hall.LOGW("==", "=======被拒绝=====");
            } else {
                if (tableInfo.nameList.length < 3) {
                    window.setDissolveFailDetailTextString("玩家1", "玩家2");
                    return;
                }
                for (var i = 0; i < 3; i++) {
                    if (disbinds[i] == 1) {
                        var name = tableInfo.nameList[i];
                        nameA.push(name);
                    }
                }
                window.setDissolveFailDetailTextString(nameA, true);

                ddz.detailsModel.setIsOver(true);
                that.shouldLeave = true;
                hall.LOGW("==", "=======解散成功=====");
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

    deleteDisbindState: function deleteDisbindState() {},
    refreshDisbindState: function refreshDisbindState(disbind) {

        var states = disbind.states;
        var stateDic = { "before": [], "one": [], "zero": [] };
        for (var i = 0; i < states.length; i++) {
            if (states[i] == -1) {
                stateDic.before.push(states[i]);
            } else if (states[i] == 0) {
                stateDic.zero.push(states[i]);
            } else {
                stateDic.one.push(states[i]);
            }
        }
        var oneL = stateDic.one;
        var zeroL = stateDic.zero;
        this.disbinds = oneL.concat(zeroL);
        var that = this;
        var preFabNodeAction = function preFabNodeAction(preFabNode, comName) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            if (disbind.reqSeatId == that._tableScene._mySeatIndex) {
                //发起者
                window.setDissolvePregrossForCreator(disbind.optime, that.disbinds);
                window.noDissolve = true;
                that.disbindsOwer = true;
            } else {
                var tableInfo = that._tableScene.tableInfo();
                var name;
                if (tableInfo.nameList.length > 2) {
                    name = tableInfo.nameList[disbind.reqSeatId - 1];
                } else {
                    name = "玩家未知";
                }
                window.setDissolvePregrossForAnswer(disbind.optime, that.disbinds, name);
                window.noDissolve = true;
                that.disbindsOwer = false;
                if (states[that._tableScene._mySeatIndex - 1] == -1) {
                    that.waitAnswer = true;
                } else {
                    that.waitAnswer = false;
                    window.changeStateToWait(states[that._tableScene._mySeatIndex - 1]);
                }
            }
        };
        ddz.GlobalFuncs.showWindowTipsForFriend(preFabNodeAction);
    },

    initScore: function initScore() {

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

    updateAllScore: function updateAllScore() {

        var myIndex = this._tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var ftInfo = this._tableScene.tableInfo().ftInfo;

        var score = ftInfo.getScore(myIndex - 1);
        var delta = ftInfo.getDelta(myIndex - 1);

        this.upDataScore('my', score, delta);

        score = ftInfo.getScore(leftindex - 1);
        delta = ftInfo.getDelta(leftindex - 1);

        this.upDataScore('left', score, delta);

        score = ftInfo.getScore(rightindex - 1);
        delta = ftInfo.getDelta(rightindex - 1);

        this.upDataScore('right', score, delta);
    },

    //更新分数
    upDataScore: function upDataScore(pos, scroe, delta) {
        var lblScoreChange, lblName;
        var deltaStr = "";
        if (delta >= 0) {
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

        if (scroe > 0) {
            scroe = "+" + scroe;
        }
        lblScore.string = scroe + "";
    },

    getScoreLabel: function getScoreLabel(scoreNode, lblName) {
        return scoreNode.getChildByName(lblName).getComponent(cc.Label);
    },

    setBtnInviteState: function setBtnInviteState(val) {
        this.btnInvite.node.active = val;
    },

    setBtnReadyState: function setBtnReadyState(val) {
        if (val) {
            this.lblDiFen.string = "";
        }
        // this.btnContinue.node.active = false;
        this.btnReady.node.active = false;

        var btnReady;
        if (this._tableScene.tableInfo().ftInfo.curRound == 0) {
            btnReady = this.btnReady;
            btnReady.node.active = val;
        }
    },

    // getBtnReady:function () {
    //     if (this._tableScene.tableInfo().ftInfo.curRound == 0)  {
    //         return this.btnReady;
    //     }
    //     // return this.btnContinue;
    // },

    onDuiJuBtnClick: function onDuiJuBtnClick(event) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeFriendRoomDuiju, []);
        //打开对局流水面板
        hall.GlobalFuncs.onShowDetail();
    },

    showResult: function showResult(result) {
        ddz.LOGD("", "file = [DdzTableScene] fun = [_startGameOverAnimation] 好友桌显示结算界面");
        this._tableScene._reset();
        ty.NotificationCenter.trigger(ddz.EventType.STOP_MATCHING);
        // this.matchNode.active = false;
        if (!this._gameResult) {
            var game_result_wnd = cc.instantiate(this.game_result);
            cc.director.getScene().addChild(game_result_wnd);
            this._gameResult = game_result_wnd.getComponent("ddz_game_result");
            this._gameResult.setTableScene(this._tableScene);
        }

        if (result['curRound'] < result['totalRound']) {
            this._gameResult.showFtResult(result, true);
        } else {
            this._gameResult.showFtResult(result, false);
        }
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


    onDestroy: function onDestroy() {

        // this.btnRecord.node.off(cc.Node.EventType.TOUCH_START, this._onRecordBtnTouchBegan, this);
        // this.btnRecord.node.off(cc.Node.EventType.TOUCH_MOVE, this._onRecordBtnTouchMoved, this);
        // this.btnRecord.node.off(cc.Node.EventType.TOUCH_END, this._onRecordBtnTouchEnded, this);
        ddz.NetWorkCenter.canNotLeave = false;
        ddz.tableChatModel.clear();
        ty.NotificationCenter.ignoreScope(this);
        if (ddz.friendModel.tipsWindow) {
            ddz.friendModel.tipsWindow.removeFromParent();
        }
        ddz.friendModel.tipsWindow = null;
        this._tableScene = null;
        this.unscheduleAllCallbacks();
    },

    update: function update(dt) {
        this.rightShowTime -= dt;
        this.rightMsgNode.active = this.rightShowTime >= 0;
        this.leftShowTime -= dt;
        this.leftMsgNode.active = this.leftShowTime >= 0;
        this.selfShowTime -= dt;
        this.selfMsgNode.active = this.selfShowTime >= 0;
        if (this._isOnRecord) {
            //正在录音,要更新进度条
            if (this._recordTime < this._maxRecordTime) {
                this._recordTime += dt;
                // this.rbar.fillRange = -(this._recordTime/this._maxRecordTime);
                // // ddz.LOGD(null, "当前进度:" + this.rbar.fillRange);
            }
        }
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
        //# sourceMappingURL=FriendModule.js.map
        