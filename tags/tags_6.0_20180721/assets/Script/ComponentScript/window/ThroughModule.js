
cc.Class({
    extends: cc.Component,

    properties: {
        lblDiFen : cc.Label,
        game_result : cc.Prefab,
        boxBtn:cc.Button,
        box_donghua:cc.Node,

        boxSprite:cc.Sprite,
        boxSpriteFrame:[cc.SpriteFrame],

        box_up:cc.Node,
        aniDiFen:cc.Label,
    },

    ctor:function () {
    },

    setTableScene:function (val) {
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

    updateMultiple:function (baseScore, multiple) {
        // this.lblDiFen.string = baseScore + " x " + multiple + "倍";

        this.boxBtn.node.active = true;
        this.aniDiFen.node.active = true;

        var _defen = parseInt(this.lblDiFen.string);
        var isAni = false;
        if (multiple == _defen * 2) {
            this.aniDiFen.string = "x2";
            isAni = true;
        }

        this.aniDiFen.node.y = 120;

        var tableinfo = this._tableScene.tableInfo();
        var boxConfig = tableinfo.m_boxConfig;
        var boxType = "";
        if(boxConfig){
            if (boxConfig.length && boxConfig.length > 0){
                for (var i = 0; i < boxConfig.length; i++){
                    if (boxConfig[i].windoubles != "") {
                        if(boxConfig[i].windoubles <= multiple){
                            boxType = boxConfig[i].boxType;
                        }
                    }
                }
            }
        }

        this.aniDiFen.node.stopAllActions();
        this.lblDiFen.node.stopAllActions();
        var pos = this.lblDiFen.node.getPosition();
        var move = cc.moveTo(0.5, pos);
        var inout = move.easing(cc.easeIn(4.0));
        var scale_1 = cc.scaleTo(0.1, 0);
        var scale_2 = cc.scaleTo(0.1, 2);
        var scale_3 = cc.scaleTo(0.1, 1);

        var that = this;

        if (isAni) {
            this.aniDiFen.node.runAction(cc.sequence(inout,cc.callFunc(function(){
                that.aniDiFen.node.active = false;
                that.lblDiFen.string = multiple + "倍";
                that.lblDiFen.node.runAction(cc.sequence(scale_1,scale_2,scale_3,cc.callFunc(function(){
                    that.setBoxType(boxType);
                },that)));
            },that)));
        }else {
            that.lblDiFen.string = multiple + "倍";
            that.aniDiFen.node.active = false;
        }

        if (!this.isOnce){
            this.isOnce = true;
            var tips = "打高倍赢宝箱";
            hall.GlobalFuncs.onBubbleTips(this.boxBtn.node,tips,-56,-60,15);
        }
    },

    setBoxType:function(type){
        if (type != this.boxType) {
            this.boxType = type;
            // var ani = this.box_donghua.getComponent(cc.Animation);
            // var anim1 = ani.getAnimationState('box_doudong');
            // anim1.play();
            
            var com = this.box_up.getComponent('box_up');
            com.setBoxSprite(type);
        }
        switch (type){
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

    onLoad : function() {
        ddz.LOGD("","file = [ThroughModule] fun = [onLoad]");

        this.boxType = "";

        ty.NotificationCenter.listen(ddz.EventType.GAME_READY, this._onGameReady, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
        ty.NotificationCenter.listen(ddz.EventType.SET_BOX_TYPE, this.setBoxType, this);
    },

    onRemoveAni:function () {
        var ani = this.box_donghua.getComponent(cc.Animation);
        var anim_1 = ani.getAnimationState('box_doudong');
        anim_1.stop();
    },

    _onGameReady:function () {

    },

    onClickBoxBtn:function(){
        hall.GlobalFuncs.onbetBoxAbstract();
    },


    showResult:function (result) {
        ddz.LOGD("","file = [ThorughModule] fun = [showResult] 闯关赛显示结算页面");
        this._tableScene._reset();
        if (!this._gameResult){
            var game_result_wnd = cc.instantiate(this.game_result);
            cc.director.getScene().addChild(game_result_wnd);
            this._gameResult = game_result_wnd.getComponent("ddz_game_result_through");
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
        
    },
    

    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        this._tableScene = null;
    },

    reset:function () {
        this.lblDiFen.string = "";
        this.isOnce = false;
        this.boxBtn.node.active = false;
        this.boxSprite.spriteFrame = this.boxSpriteFrame[2];
        this.aniDiFen.node.active = false;
    },

    update:function (dt) {

    },

    onBack:function () {
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
