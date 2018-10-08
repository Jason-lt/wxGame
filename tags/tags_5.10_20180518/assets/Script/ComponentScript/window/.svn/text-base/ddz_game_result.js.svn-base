
cc.Class({
    extends: cc.Component,

    properties: {
        // resultSpr : {
        //     default : null,
        //     type : cc.Sprite
        // },
        // sprFrame : [
        //     cc.SpriteFrame
        // ],
        betLabel_1 : {
            default : null,
            type : cc.Label
        },
        betLabel_2 : {
            default : null,
            type : cc.Label
        },
        betLabel_3 : {
            default : null,
            type : cc.Label
        },
        betLabel_4 : {
            default : null,
            type : cc.Label
        },
        tipsRich : {
            default : null,
            type : cc.RichText
        },
        backButton : {
            default : null,
            type : cc.Button
        },

        scoreGoldSprite : {
            default : null,
            type : cc.Sprite
        },

        winNode : cc.Node,
        failNode : cc.Node,
        winLabel : cc.Label,
        failLabel : cc.Label,
        nextBtn : cc.Button,
        shareButton : cc.Button,
        nextBtnLabel : cc.RichText,
        timeNumber : 5,
        shareType : "",
        shareData : ""
        // hasClickNext : false
    },

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
    },

    setTableScene:function (tableScene) {
        this._tableScene = tableScene;
    },

    nextBtnAction:function (event,type) {
        // this.hasClickNext = true;
        if(this._tableScene._friendPanel){
            var tableInfo = this._tableScene.tableInfo();
            var mySeatIndex = this._tableScene._mySeatIndex;
            ddz.MsgFactory.getReady(tableInfo.roomId(), tableInfo.tableId(), mySeatIndex);
            ty.Timer.cancelTimer(this,this.callBackFun);
            this.node.active = false;
            ddz.gameResultPanel = null;
            var anim = this.winNode.getComponent(cc.Animation);
            anim.stop();
            var anim2 = this.failNode.getComponent(cc.Animation);
            anim2.stop();
            return;
        }
        if(type == "next1" && this.shareType != ""){
            ddz.GlobalFuncs.showShareMomentsItem(this.shareType,this.shareData);
            return;
        }

        var playModel = this._tableScene.tableInfo().playMode;
        var _mixID = this._tableScene.tableInfo().mixId;

        // hall.MsgFactory.getQuickStart(ty.UserInfo.userId, ddz.GameId, ddz.quickStartModel.getRoomId(), hall.staticSystemInfo.version, null, null, null,null,ddz.quickStartModel.getMixId(),playModel);
        hall.MsgFactory.getQuickStart(ty.UserInfo.userId, ddz.GameId, ddz.quickStartModel.getRoomId(),
            hall.staticSystemInfo.version, null, null, null,null,
            _mixID,
            playModel);

        this.node.active = false;
        ddz.gameResultPanel = null;
        var anim = this.winNode.getComponent(cc.Animation);
        anim.stop();
        var anim2 = this.failNode.getComponent(cc.Animation);
        anim2.stop();
        this._tableScene._reset();
    },

    backAction : function () {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var tableinfo = this._tableScene.tableInfo();
        var _mixID = tableinfo.mixId;
        ddz.gameResultPanel = null;
        // var _mixID = hall.gameWorld.getRoomMixId(ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN,tableinfo.roomName);
        ddz.MsgFactory.getRoomLeave(tableinfo.roomId(), tableinfo.tableId(), this._tableScene._mySeatIndex, _mixID);
    },
    
    show:function (result) {
        this.backButton.node.active = true;
        var mySeatIndex = result.mySeatIndex;
        var dizhuWin = result.dizhuwin == 1;
        var isWin = false;
        if (mySeatIndex == result.stat.dizhu){
            isWin = dizhuWin;
        }
        else{
            isWin = !dizhuWin;
        }

        var mySeatInfo = result['seat' + mySeatIndex];
        var delta = mySeatInfo[0];
        var deltaAll = mySeatInfo[12];

        if (delta > 0){
            delta = "+"+ delta;
        }
        this.scoreGoldSprite.node.active = true;

        if(isWin){
            this.winNode.active = true;
            this.failNode.active = false;
            this.winLabel.node.active = true;
            this.winLabel.string = delta;
            this.failLabel.node.active = false;
            var anim = this.winNode.getComponent(cc.Animation);
            anim.play('winTitle');
        }else {
            this.winNode.active = false;
            this.failNode.active = true;
            this.winLabel.node.active = false;
            this.failLabel.node.active = true;
            this.failLabel.string = delta;
            var anim = this.failNode.getComponent(cc.Animation);
            anim.play('loseTitle');
        }

        var notice = "";

        if (this._tableScene.tableInfo().roomName != '新手场' && delta != deltaAll){
            if (isWin){
                //没赢那么多
                notice = "<color=#ffffff>因开局时你有 </color><img src = 'ddz_coin_white'/><color=#ffffff> "+delta+"，所以本局最多赢"+delta+"</color>";
            }
            else{
                //没输那么多
                delta = -delta;
                notice = "<color=#ffffff>因开局时对手有 </color><img src = 'ddz_coin_white'/><color=#ffffff> "+delta+"，所以本局最多输"+delta+"</color>";
            }
        }

        this.tipsRich.string = notice;

        // this.resultSpr.spriteFrame = this.sprFrame[isWin ? 0 : 1];
        var call = result.stat.call;
        var bc = result.stat.bomb;
        bc = Math.pow(2, bc);
        var chuntian = result.stat.chuntian;

        this.betLabel_1.string = call + "倍";
        this.betLabel_2.string = bc > 1 ? parseInt(bc) + "倍" : "--";
        this.betLabel_3.string = chuntian > 1 ? chuntian + "倍" : "--";
        this.betLabel_4.string = parseInt(call * bc * chuntian) + "倍";
        this.node.active = true;
        ddz.gameResultPanel = this;

        // "currWinDoubles", {"multi" : 24, "percent":65 , "isChunTian": 1}
        if(result.currWinDoubles){
            this.nextBtnLabel.string = "<color=#ffffff>分享战绩</color>";
            this.shareButton.node.active = true;
            if(result.currWinDoubles.isChunTian){
                this.shareType = "showy_spring";
            }else {
                this.shareType = "showy_highPower";
            }
            this.shareData = result.currWinDoubles;
        }else {
            this.nextBtnLabel.string = "<color=#ffffff>下一局</color>";
            this.shareButton.node.active = false;
            this.shareType = "";
        }
    },

    showFtResult : function (result) {
        this.shareType = "";
        if(result.stat.dizhu == 0){
            this.nextBtnAction();
            return;
        }
        this.backButton.node.active = false;
        var tableInfo = this._tableScene.tableInfo();
        var mySeatIndex = this._tableScene._mySeatIndex;
        var dizhuWin = result.dizhuwin == 1;
        var isWin = false;
        if (mySeatIndex == result.stat.dizhu){
            isWin = dizhuWin;
        }
        else{
            isWin = !dizhuWin;
        }

        var mySeatInfo = result['seat' + mySeatIndex];
        var delta = mySeatInfo[0];
        var deltaAll = mySeatInfo[12];

        if (delta > 0){
            delta = "+"+ delta;
        }
        this.winLabel.x = 0;
        this.failLabel.x = 0;
        if(isWin){
            this.winNode.active = true;
            this.failNode.active = false;
            this.winLabel.node.active = true;
            this.failLabel.node.active = false;
            this.winLabel.string = "分 "+delta;
            var anim = this.winNode.getComponent(cc.Animation);
            anim.play('winTitle');
        }else {
            this.winNode.active = false;
            this.failNode.active = true;
            this.winLabel.node.active = false;
            this.failLabel.node.active = true;
            this.failLabel.string = "分 "+delta;
            var anim = this.failNode.getComponent(cc.Animation);
            anim.play('loseTitle');
        }
        this.scoreGoldSprite.node.active = false;

        var call = result.stat.call;
        var bc = result.stat.bomb;
        bc = Math.pow(2, bc);
        var chuntian = result.stat.chuntian;

        this.betLabel_1.string = call + "倍";
        this.betLabel_2.string = bc > 1 ? parseInt(bc) + "倍" : "--";
        this.betLabel_3.string = chuntian > 1 ? chuntian + "倍" : "--";
        this.betLabel_4.string = parseInt(call * bc * chuntian) + "倍";
        this.node.active = true;
        ddz.gameResultPanel = this;

        this.timeNumber = 5;
        this.nextBtnLabel.string = '继续('+this.timeNumber+')';

        ty.Timer.setTimer(this,this.callBackFun,1);
    },
    callBackFun : function () {
        var tableInfo = this._tableScene.tableInfo();
        var mySeatIndex = this._tableScene._mySeatIndex;
        this.timeNumber -- ;
        if(this.timeNumber <= -1){
            ddz.MsgFactory.getReady(tableInfo.roomId(), tableInfo.tableId(), mySeatIndex);
            // this._tableScene._mySeatIndex
            ty.Timer.cancelTimer(this,this.callBackFun);
            this.node.active = false;
            ddz.gameResultPanel = null;
            var anim = this.winNode.getComponent(cc.Animation);
            anim.stop();
            var anim2 = this.failNode.getComponent(cc.Animation);
            anim2.stop();
        }
        this.nextBtnLabel.string = '继续('+this.timeNumber+')';
    },

    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        this._tableScene = null;
        ddz.gameResultPanel = null;
    }
});
