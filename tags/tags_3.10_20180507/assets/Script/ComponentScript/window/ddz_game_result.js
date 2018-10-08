
cc.Class({
    extends: cc.Component,

    properties: {
        resultSpr : {
            default : null,
            type : cc.Sprite
        },
        sprFrame : [
            cc.SpriteFrame
        ],
        scoreRich : {
            default : null,
            type : cc.RichText
        },
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

    nextBtn:function () {
        var playModel = this._tableScene.tableInfo().playMode;
        hall.MsgFactory.getQuickStart(ty.UserInfo.userId, ddz.GameId, ddz.quickStartModel.getRoomId(), hall.staticSystemInfo.version, null, null, null,null,ddz.quickStartModel.getMixId(),playModel);
        this.node.active = false;
        this._tableScene._reset();
    },

    backAction : function () {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var tableinfo = this._tableScene.tableInfo();
        ddz.MsgFactory.getRoomLeave(tableinfo.roomId(), tableinfo.tableId(), this._tableScene._mySeatIndex, ddz.quickStartModel.getMixId());
    },
    
    show:function (result) {

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
        this.scoreRich.string = "<img src = 'ddz_mall_coin_icon_mall'/><color=#ffffff> "+ delta +"</color>";

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

        this.resultSpr.spriteFrame = this.sprFrame[isWin ? 0 : 1];
        var call = result.stat.call;
        var bc = result.stat.bomb;
        bc = Math.pow(2, bc);
        var chuntian = result.stat.chuntian;

        this.betLabel_1.string = call + "倍";
        this.betLabel_2.string = bc > 1 ? parseInt(bc) + "倍" : "--";
        this.betLabel_3.string = chuntian > 1 ? chuntian + "倍" : "--";
        this.betLabel_4.string = parseInt(call * bc * chuntian) + "倍";



        this.node.active = true;
    },
    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        this._tableScene = null;
    },

});
