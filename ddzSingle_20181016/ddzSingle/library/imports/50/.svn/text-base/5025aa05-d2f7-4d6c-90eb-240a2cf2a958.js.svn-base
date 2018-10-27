"use strict";
cc._RF.push(module, '5025aoF0vdNbJDrJAos8qlY', 'ControlPanel');
// Script/ComponentScript/component/ControlPanel.js

"use strict";

/**
 * 操作面板
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._TAG = "ddz.ControlPanel";
    },

    properties: {
        callNode: cc.Node,
        callNodeHuanle: cc.Node,
        playNode: cc.Node,

        btnNoCall: cc.Button,
        btnCall1: cc.Button,
        btnCall2: cc.Button,
        btnCall3: cc.Button,

        btnNoCallHuanle: cc.Button,
        btnCallHuanle: cc.Button,

        btnNoPlay: cc.Button,
        btnTip: cc.Button,
        btnPlay: cc.Button,

        lblMsg: cc.Label,
        tipsSpr: cc.Sprite,
        cardTipsSpr: cc.Sprite,
        lblTimer: cc.Label,
        nodeTimer: cc.Node,

        chatButton: { // 互动表情按钮
            default: null,
            type: cc.Button
        },
        lordSpriteFrame: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.btnNoPlay.interactable = false;
        this.btnNoPlay.node.on("click", this._playBuchu, this);
        this.btnTip.node.on("click", this._playTip, this);
        this.btnPlay.node.on("click", this._playPlay, this);

        this.btnNoCall.node.on("click", this._classicBujiao, this);
        this.btnCall1.node.on("click", this._classic1fen, this);
        this.btnCall2.node.on("click", this._classic2fen, this);
        this.btnCall3.node.on("click", this._classic3fen, this);

        this.btnNoCallHuanle.node.on("click", this._grabBujiao, this);
        this.btnCallHuanle.node.on("click", this._grabCall, this);

        this.chatButton.node.on("click", this.onChatButton, this);

        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE, this.onGameHide, this);
        this.state = 0;
    },

    onGameHide: function onGameHide() {
        // this.setClockVisible(false);
        // this._reset();
    },

    _grabBujiao: function _grabBujiao() {
        this._playcontroller.happyJiaodz(0);
    },

    _grabCall: function _grabCall() {
        this._playcontroller.happyJiaodz(1);
    },

    getCallNode: function getCallNode() {
        if (this._playcontroller.tableInfo().config.m_grab == 1) {
            if (this._playcontroller._mDizhuCalled) {
                //显示抢地主,不抢
                this.setCallBtnText('不抢', '抢地主');
            } else {
                this.setCallBtnText('不叫', '叫地主');
            }
            return this.callNodeHuanle;
        }
        return this.callNode;
    },

    setCallBtnText: function setCallBtnText(noCallText, callText) {
        var lbl = this.btnNoCallHuanle.node.getChildByName('Label');
        lbl.getComponent(cc.Label).string = noCallText;

        lbl = this.btnCallHuanle.node.getChildByName('Label');
        lbl.getComponent(cc.Label).string = callText;
    },

    showCallNode: function showCallNode(val) {
        this.getCallNode().active = val;
    },

    showPlayNode: function showPlayNode(val) {
        this.playNode.active = val;
    },

    init: function init(playcontrol) {

        this._playcontroller = playcontrol;

        this._bActiveBuChu = false;
        this._clockLeftTime = -1;

        this._reset();
    },

    _reset: function _reset() {
        this._bActiveBuChu = false;
        this._clockLeftTime = -1;

        this.hideAll();
    },

    setLblMsg: function setLblMsg(val) {
        if (val) {
            // this.lblMsg.node.active = true;
            this.lblMsg.node.active = false;
            this.lblMsg.string = val;
        } else {
            this.lblMsg.node.active = false;
        }
    },

    getState: function getState() {
        return this.state;
    },

    setCardTipsSpr: function setCardTipsSpr(state) {
        if (state == null) {
            this.cardTipsSpr.node.active = false;
            // this.state = 0;
        } else {
            /* 1:1分 2:2分 3:3分 4:不出 5:不叫 6:不抢 7:出牌不符合规则 8:叫地主 9:明牌
             *   10:你没有牌大过上家 11:抢地主 12:托管 13:要不起 14:pass
             *
             * */

            if (this.lordSpriteFrame[state - 1]) {
                this.cardTipsSpr.node.active = true;
                this.cardTipsSpr.spriteFrame = this.lordSpriteFrame[state - 1];
                this.state = state;
            }
        }
    },

    setTipsSpr: function setTipsSpr(state) {
        if (state == null) {
            this.tipsSpr.node.active = false;
            // this.state = 0;
        } else {
            /* 1:1分 2:2分 3:3分 4:不出 5:不叫 6:不抢 7:出牌不符合规则 8:叫地主 9:明牌
             *   10:你没有牌大过上家 11:抢地主 12:托管 13:要不起 14:pass
             *
             * */
            if (this.lordSpriteFrame[state - 1]) {
                this.tipsSpr.node.active = true;
                this.tipsSpr.spriteFrame = this.lordSpriteFrame[state - 1];
                this.state = state;
            }

            // switch (state) {
            //     case 1:{
            //
            //         break;
            //     }
            //     case 2:{
            //         break;
            //     }
            //     case 3:{
            //         break;
            //     }
            //     case 4:{
            //         break;
            //     }
            //     case 5:{
            //         break;
            //     }
            //     case 6:{
            //         break;
            //     }
            //     case 7:{
            //         break;
            //     }
            //     case 8:{
            //         break;
            //     }
            //     case 9:{
            //         break;
            //     }
            //     case 10:{
            //         break;
            //     }
            //     case 11:{
            //         break;
            //     }
            //     case 12:{
            //         break;
            //     }
            //     case 13:{
            //         break;
            //     }
            //     case 14:{
            //         break;
            //     }
            // }
        }
    },

    showBuchuSprite: function showBuchuSprite() {
        this.hideAll();
        // this.setLblMsg("不出");
        this.setTipsSpr(4);
    },

    showPrepare: function showPrepare(bReady) {
        this.hideAll();
        if (bReady) {
            this.setLblMsg("已准备");
        }
    },

    //play
    _playBuchu: function _playBuchu() {
        this._playcontroller._clearSelectedCards();
        this._playcontroller._playCards();
        this.setTipsSpr(4);
    },

    hideAll: function hideAll() {
        this.playNode.active = false;
        this.callNode.active = false;
        this.callNodeHuanle.active = false;
        this.setLblMsg("");
        this.setTipsSpr();
        this.setCardTipsSpr();
        this.setClockVisible(false);
        this.setChatButtonActive(false);
    },

    showJiaodz: function showJiaodz(call) {
        this.hideAll();
        // this.nodeTimer.active = true;
        this.getCallNode().active = true;

        for (var i = 1; i < 4; i++) {
            this['btnCall' + i].interactable = call < i;
            if (call < i) {
                this['btnCall' + i].node.getChildByName('bright').active = true;
                this['btnCall' + i].node.getChildByName('hui').active = false;
            } else {
                this['btnCall' + i].node.getChildByName('bright').active = false;
                this['btnCall' + i].node.getChildByName('hui').active = true;
            }
        }
    },

    showPlay: function showPlay(bNoCard) {
        var bNoCard = false;
        //出牌，显示出牌操作面板
        if (this._playcontroller._resetTopCardType()) {
            bNoCard = true;
        }
        this.hideAll();
        this.playNode.active = true;
        var ts = this._playcontroller._tableState;
        hall.LOGD(this._TAG, "in show play ,top seat : " + ts.normalInfo.m_topseat);

        if (ts.normalInfo.m_topseat == 0 || ts.normalInfo.m_topseat == this._playcontroller._mySeatIndex) {
            //主动出牌，应该禁止掉不出按钮
            this.btnNoPlay.node.active = false;
            this.btnTip.node.active = false;
            this.btnPlay.node.active = true;
            this.btnPlay.node.x = 0;
        } else {

            this.btnNoPlay.node.active = true;
            if (bNoCard) {
                //没有牌可以大过上家,只显示不出按钮,并居中
                this.btnNoPlay.node.x = 0;
                this.btnTip.node.active = false;
                this.btnPlay.node.active = false;
                this.setCardTipsSpr(10);
            } else {
                this.btnNoPlay.node.x = -209;
                this.btnTip.node.active = true;
                this.btnPlay.node.active = true;
            }

            this.btnPlay.node.x = 215;
        }

        if (this._playcontroller._selectedCards.length > 0) {
            // this.setButtonEnable(ddz.RECHOOSE_BUTTON_KEY, true);
            // this.btnPlay.interactable = true;
        } else {
                // this.setButtonEnable(ddz.RECHOOSE_BUTTON_KEY, false);
                // this.btnPlay.interactable = false;
            }
    },

    _classicBujiao: function _classicBujiao() {
        this._playcontroller._classicJiaodz(0);
        this.setTipsSpr(5);
    },

    _classic1fen: function _classic1fen() {
        this._playcontroller._classicJiaodz(1);
        this.setTipsSpr(1);
    },
    _classic2fen: function _classic2fen() {
        this._playcontroller._classicJiaodz(2);
        this.setTipsSpr(2);
    },
    _classic3fen: function _classic3fen() {
        this._playcontroller._classicJiaodz(3);
        this.setTipsSpr(3);
    },

    setChatButtonActive: function setChatButtonActive(isAvtive) {
        // this.chatButton.node.active = isAvtive;
    },

    onChatButton: function onChatButton() {
        // ddz.LOGD(null, "onChatButton index = " + ddz.LOCATION_SIGN.SELF);
        this._playcontroller.clickChatButton(ddz.LOCATION_SIGN.SELF);
    },

    _playRechoose: function _playRechoose() {
        // cc.audioEngine.playMusic(ddz.Res.ClickButtonEffect);
        this._playcontroller._clearSelectedCards();
    },
    _playTip: function _playTip() {
        // cc.audioEngine.playMusic(ddz.Res.ClickButtonEffect);
        ddz.LOGD(null, "-----------------------_playTip-----------------------------");
        this._playcontroller.playTip();
    },

    _playPlay: function _playPlay() {
        // cc.audioEngine.playMusic(ddz.Res.ClickButtonEffect);
        ddz.LOGD(null, "-----------------------_playPlay-----------------------------");
        if (this._playcontroller._selectedCards.length == 0) {
            this._playcontroller._setCardsTipVisible(true, ddz.Enums.PlayCardsTip.PLAYCARDSTIP_PLAY);
            return;
        }
        this._playcontroller._playCards();
    },

    _timeOutTip: function _timeOutTip() {
        ty.Timer.cancelTimer(this, this._timeOutTip);
        var str = this._playcontroller._tableInfo.config.m_optimedis;
        hall.LOGD(this._TAG, "时间到了啊" + str);
        hall.MsgBoxManager.showToast({ title: str });
    },

    getIsFriend: function getIsFriend() {
        return this._playcontroller.tableInfo().getSceneType() == ddz.Enums.SceneType.FRIEND;
    },

    getIsGold: function getIsGold() {
        return this._playcontroller.tableInfo().getSceneType() == ddz.Enums.SceneType.NORMAL;
    },

    _scheduleClock: function _scheduleClock() {
        this._clockLeftTime -= 1;
        this.lblTimer.string = "" + this._clockLeftTime;
        //播放警告和动画
        // if (this._clockLeftTime <= ddz.CLOCK_ANIMATION_SECOND && this._clockInAction == false) {
        //     this._alarmEffectId = ddz.AudioHelper.playEffect(ddz.EffectPath["audio_reminded_myself"], true);
        // }
        //时间到
        if (this._clockLeftTime <= 0) {
            ty.Timer.cancelTimer(this, this._scheduleClock);
            if (this.getIsFriend()) {
                //好友场倒计时到0后,不作任何操作
                return;
            }
            if (this._bActiveBuChu == true) {
                var state = this._playcontroller._tableState.normalInfo.m_state;
                if (state == ddz.Enums.TableState.TABLEDSTAT_CALLING) {
                    this.showCallNode(false);
                    //超时后,后端处理叫分,前端不要再发协议
                } else {
                    this._playBuchu();
                    this._bActiveBuChu = false;
                }
            } else {
                //3s后提示网络不好
                // ty.Timer.setTimer(this, this._timeOutTip, 6, 0, 0);
            }
            this.setClockVisible(false);
        }
    },

    setClockVisible: function setClockVisible(bVisible, time) {
        ty.Timer.cancelTimer(this, this._scheduleClock);
        this.nodeTimer.active = bVisible;
        //如果显示时钟
        if (bVisible) {
            if (time >= 5 && time < 30) {
                this._bActiveBuChu = true;
            }
            this._clockLeftTime = time;
            ty.Timer.setTimer(this, this._scheduleClock, 1);
            this.lblTimer.string = "" + this._clockLeftTime;
        }
    },

    hideClock: function hideClock() {
        this.nodeTimer.opacity = 0;
    },

    showClock: function showClock() {
        this.nodeTimer.opacity = 255;
    },

    // start () {
    //
    // },

    // update (dt) {},

    onDestroy: function onDestroy() {
        // if(this.btnNoPlay){
        //     this.btnNoPlay.node.off("click" , this._playBuchu, this);
        //     this.btnTip.node.off("click" , this._playTip, this);
        //     this.btnPlay.node.off("click" , this._playPlay, this);
        //
        //     this.btnNoCall.node.off("click" , this._classicBujiao, this);
        //     this.btnCall1.node.off("click" , this._classic1fen, this);
        //     this.btnCall2.node.off("click" , this._classic2fen, this);
        //     this.btnCall3.node.off("click" , this._classic3fen, this);
        // }
        ty.Timer.cancelTimer(this, this._scheduleClock);
        ty.NotificationCenter.ignoreScope(this);
    }
});

cc._RF.pop();