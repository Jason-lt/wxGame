"use strict";
cc._RF.push(module, '7fe3aBObiJLkqVzqgelbKxm', 'ThroughModule');
// Script/ComponentScript/window/ThroughModule.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lblDiFen: cc.Label,
        game_result: cc.Prefab,
        boxBtn: cc.Button,
        box_donghua: cc.Node,

        boxSprite: cc.Sprite,
        boxSpriteFrame: [cc.SpriteFrame],

        box_up: cc.Node,
        aniDiFen: cc.Label,
        lblDiFen_1: cc.Label,
        fanbei: cc.Node
    },

    ctor: function ctor() {},

    setTableScene: function setTableScene(val) {
        this._tableScene = val;
        // this._tableInfoChange(this._tableScene.tableInfo());
        // this.refresh();
    },

    // refresh:function () {
    //     this._tableScene.myAvatar.active = this._tableScene._tableState.normalInfo.m_state != ddz.Enums.TableState.TABLEDSTAT_PLAYING;
    //
    //     this.initScore();
    //     if (this._tableScene._leftSeatinfo.hasData && this._tableScene._rightSeatinfo.hasData){
    //         //坐滿了,
    //         this._onGameReady();
    //     }
    //
    //     if (this._tableScene._leftSeatinfo.hasData){
    //         this._onUpdateInfo({pos:'left', type:'sit'});
    //     }
    //
    //     if (this._tableScene._rightSeatinfo.hasData){
    //         this._onUpdateInfo({pos:'right', type:'sit'});
    //     }
    // },

    betScoreChangeAni: function betScoreChangeAni() {
        this.aniDiFen.node.active = true;
        this.fanbei.active = true;
        var _defen = this.lblDiFen.string;
        this.lblDiFen_1.string = _defen;
        var index = _defen.indexOf("倍");
        _defen = _defen.substring(0, index);
        this.aniDiFen.string = _defen * 2 + "倍";

        this.aniDiFen.node.y = 100;

        this.aniDiFen.node.stopAllActions();

        var to_pos = this.fanbei.getPosition();

        var pos_y = (to_pos.y + 120) / 1.2;
        var pos_y_1 = (to_pos.y + 120) / 1.5;
        var from_pos = cc.p(0, pos_y_1);
        var midPoint = cc.p(-120, to_pos.y);
        var controlPoints1 = [from_pos, midPoint, to_pos];
        var bezierToDst1 = cc.bezierTo(0.5, controlPoints1);

        // var pos = this.fanbei.getPosition();
        // var move = cc.moveTo(0.5, pos);
        // var inout = bezierToDst1.easing(cc.easeIn(4.0));

        var tableinfo = this._tableScene.tableInfo();
        var boxConfig = tableinfo.m_boxConfig;
        var boxType = "";
        if (boxConfig) {
            if (boxConfig.length && boxConfig.length > 0) {
                for (var i = 0; i < boxConfig.length; i++) {
                    if (boxConfig[i].windoubles != "") {
                        if (boxConfig[i].windoubles <= _defen * 2) {
                            boxType = boxConfig[i].boxType;
                        }
                    }
                }
            }
        }
        var that = this;
        this.aniDiFen.node.runAction(cc.sequence(bezierToDst1, cc.callFunc(function () {
            that.aniDiFen.node.active = false;
            that.lblDiFen.string = _defen * 2 + "倍";
            var ani = that.fanbei.getComponent(cc.Animation);
            var anim = ani.getAnimationState("times_anination");
            anim.once("finished", function () {
                that.setBoxType(boxType);
            });
            anim.play();
        }, that)));
    },

    updateMultiple: function updateMultiple(baseScore, multiple) {
        this.fanbei.active = true;
        this.lblDiFen.string = multiple + "倍";
        // var ani = this.fanbei.getComponent(cc.Animation);
        // var anim = ani.getAnimationState("times_anination");
        // anim.once("finished", function () {
        //
        // });
        // anim.play();

        this.boxBtn.node.active = true;

        var tableinfo = this._tableScene.tableInfo();
        var boxConfig = tableinfo.m_boxConfig;
        var boxType = "";
        if (boxConfig) {
            if (boxConfig.length && boxConfig.length > 0) {
                for (var i = 0; i < boxConfig.length; i++) {
                    if (boxConfig[i].windoubles != "") {
                        if (boxConfig[i].windoubles <= multiple) {
                            boxType = boxConfig[i].boxType;
                        }
                    }
                }
            }
        }
        this.setBoxType(boxType);

        if (!this.isOnce) {
            this.isOnce = true;
            var tips = "打高倍赢宝箱";
            hall.GlobalFuncs.onBubbleTips(this.boxBtn.node, tips, -40, -60, 15);
        }
    },

    setBoxType: function setBoxType(type) {
        if (type != this.boxType) {
            this.boxType = type;
            // var ani = this.box_donghua.getComponent(cc.Animation);
            // var anim1 = ani.getAnimationState('box_doudong');
            // anim1.play();

            var com = this.box_up.getComponent('box_up');
            com.setBoxSprite(type);
        }
        switch (type) {
            case "青铜宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[0];
                break;
            case "白银宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[1];
                break;
            case "黄金宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[2];
                break;
            case "春天宝箱":
                this.boxSprite.spriteFrame = this.boxSpriteFrame[3];
                break;
        }
    },

    onLoad: function onLoad() {
        ddz.LOGD("", "file = [ThroughModule] fun = [onLoad]");

        this.boxType = "";

        ty.NotificationCenter.listen(ddz.EventType.GAME_READY, this._onGameReady, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
        ty.NotificationCenter.listen(ddz.EventType.SET_BOX_TYPE, this.setBoxType, this);
        ty.NotificationCenter.listen(ddz.EventType.BET_SCORE_CHANGE_ANI, this.betScoreChangeAni, this);
    },

    onRemoveAni: function onRemoveAni() {
        var ani = this.box_donghua.getComponent(cc.Animation);
        var anim_1 = ani.getAnimationState('box_doudong');
        if (anim_1) {
            anim_1.stop();
        }

        var ani = this.fanbei.getComponent(cc.Animation);
        var anim = ani.getAnimationState("times_anination");
        if (anim) {
            anim.stop();
        }
    },

    _onGameReady: function _onGameReady() {},

    onClickBoxBtn: function onClickBoxBtn() {
        hall.GlobalFuncs.onbetBoxAbstract();
    },

    showResult: function showResult(result) {
        ddz.LOGD("", "file = [ThorughModule] fun = [showResult] 闯关赛显示结算页面");
        this._tableScene._reset();
        if (!this._gameResult) {
            var game_result_wnd = cc.instantiate(this.game_result);
            cc.director.getScene().addChild(game_result_wnd);
            this._gameResult = game_result_wnd.getComponent("ddz_game_result_through");
            this._gameResult.setTableScene(this._tableScene);
        }
        this._gameResult.show(result);

        var mySeatIndex = this._tableScene._mySeatIndex;
        if (mySeatIndex == result.stat.dizhu) {
            var saveCardsString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ORIGINCARDS, "");
            var saveCardsDic = JSON.parse(saveCardsString);
            var cards = saveCardsDic.myCards;
            var baseCards = saveCardsDic.baseCard;
            cards = cards.concat(baseCards);
            var saveDic = { myCards: cards, baseCard: baseCards };
            hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.ORIGINCARDS, JSON.stringify(saveDic));
        }
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this._tableScene = null;
    },

    reset: function reset() {
        this.lblDiFen.string = "";
        this.isOnce = false;
        this.boxBtn.node.active = false;
        this.boxSprite.spriteFrame = this.boxSpriteFrame[2];
        this.aniDiFen.node.active = false;
    },

    update: function update(dt) {},

    onBack: function onBack() {
        // ty.NotificationCenter.trigger(ddz.EventType.REMOVE_MATCHING);
        // ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        // ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        // var tableinfo = this._tableScene.tableInfo();
        // var _mixID = tableinfo.mixId;
        // var _roomId = tableinfo.roomId();
        // if (!_roomId) {
        //     var _queueInfo = ddz.matchModel.getCurQueueInfo();
        //     _roomId = _queueInfo.roomId
        // }
        // ddz.MsgFactory.getRoomLeave(_roomId, tableinfo.tableId(), this._tableScene._mySeatIndex, _mixID);
    }
});

cc._RF.pop();