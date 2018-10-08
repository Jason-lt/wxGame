
cc.Class({
    extends: cc.Component,

    properties: {
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
        betLabel_win : {
            default : null,
            type : cc.Label
        },

        betLabel_lose : {
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
        shareData : "",

        lizi01: cc.Node,
        lizi02: cc.Node,
        lizi03: cc.Node,
        lizi04: cc.Node,

        jiesuanguodu:cc.Node,

        betLabel:cc.Label,

        bottomNode:cc.Node,

        // hasClickNext : false
    },

    onLoad:function () {
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        ty.NotificationCenter.listen(ty.EventType.UPDATE_BUTTON_TEXT, this.onGetRewardCount, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
        var bc = ddz.gameModel.getRoomListBannerConfigJson();
        if (bc) {
            this.playResurtBanner();
        }
    },

    playResurtBanner:function(bc){
        var winnerCount = ddz.matchModel.getCurWinnerCount();
        if (bc.start) {
            if (winnerCount >= bc.start) {
                if (!ddz.curAllWidthBannerAd){
                    hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
                }
            }
        }else {
            if (!ddz.curAllWidthBannerAd){
                hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
            }
        }
    },

    onGetRewardCount:function (val) {
        var that = this;

        if (val.pointId != ddz.Share.SharePointType.alms){
            return
        }

        if (val.leftCount > 0){
            //弹出领取救济金窗口
            var almsConfig = ddz.gameModel.getAlmsConfigJson();
            var cityKey = ty.UserInfo.isInBSGS ? 'bsgsCity' : 'otherCity';
            var par = almsConfig[cityKey];
            if (ddz.almsWindow) {
                ddz.almsWindow.initWithPar(par);
                return
            }
            hall.GlobalFuncs.showPopWinByPreFab('prefabs/ddz_window_alms', function (preFabNode) {
                ddz.almsWindow = preFabNode.getComponent('AlmsWindow');
                ddz.almsWindow.initWithPar(par);
            });
        }
    },

    setTableScene:function (tableScene) {
        this._tableScene = tableScene;
    },

    onRemoveAni:function () {
        var ani = this.jiesuanguodu.getComponent(cc.Animation);
        var anim_1 = ani.getAnimationState('jiesuanguodu01');
        if (anim_1) {
            anim_1.stop();
        }
    },

    nextBtnAction:function () {

        hall.adManager.destroyWidthBannerAd();
        ddz.gameResultPanel = null;
        var anim = this.winNode.getComponent(cc.Animation);
        anim.stop();
        var anim2 = this.failNode.getComponent(cc.Animation);
        anim2.stop();
        this._tableScene._reset();
        this.node.stopAllActions();
        //弹出宝箱
        if (this.box_share && this.box_share.boxId && this.box_share.boxId != ""){
            ddz.Share.shareKeywordReplace.inviteTreasureID = this.box_share.boxId;
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeEndGiveProp,
                [this.box_share.boxId]);
            this.bottomNode.active = false;
            this.jiesuanguodu.active = true;
            var that = this;
            if (this.box_share.desc == "春天宝箱") {
                that.node.active = false;
                hall.GlobalFuncs.onTreasureBox(that.box_share,that.windoubles);
                that.jiesuanguodu.active = false;
            }else {
                var ani = this.jiesuanguodu.getComponent(cc.Animation);
                var anim1 = ani.getAnimationState('jiesuanguodu01');
                anim1.once("finished", function () {
                    that.node.active = false;
                    hall.GlobalFuncs.onTreasureBox(that.box_share,that.windoubles);
                    that.jiesuanguodu.active = false;
                });
                anim1.play();
            }
        }else {
            this.node.active = false;
            if (ddz.matchResultPanel) {
                ddz.matchResultPanel.showResults(true);
            }
        }
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
        ddz.LOGD("","file = [ddz_]");
        // this.backButton.node.active = true;
        var mySeatIndex = result.mySeatIndex;
        var dizhuWin = result.dizhuwin == 1;
        var isWin = false;

        this.box_share = result["box_share"];
        this.windoubles = result["windoubles"];

        if (mySeatIndex == result.stat.dizhu){
            isWin = dizhuWin;
        }
        else{
            isWin = !dizhuWin;
        }
        ty.NotificationCenter.trigger(ddz.EventType.CLOSE_BETBOXABSTRACT);
        var mySeatInfo = result['seat' + mySeatIndex];
        var delta = mySeatInfo[0];
        // this.scoreGoldSprite.node.active = true;
        var anim;

        if(isWin){
            this.winNode.active = true;
            this.failNode.active = false;
            // this.winLabel.node.active = true;
            // this.winLabel.string = delta;
            // this.failLabel.node.active = false;
            anim = this.winNode.getComponent(cc.Animation);
            anim.play('winTitle');
            this.betLabel_win.node.active = true;
            this.betLabel_lose.node.active = false;
            this.tipsRich.node.active = true;
            this.tipsRich.string = "<color=#ffffff><size=30>获得奖励 </color><img src = 'ddz_coin_white'/><color=#ffffff><size=48> "+ result.winChip +"</color>" +
                "<color=#ffffff><size=24> ("+ result.windoubles + "倍*"+result.roomMutil+")</color>";
        }else {
            this.winNode.active = false;
            this.failNode.active = true;
            // this.winLabel.node.active = false;
            // this.failLabel.node.active = true;
            // this.failLabel.string = delta;
            this.tipsRich.node.active = false;
            anim = this.failNode.getComponent(cc.Animation);
            anim.play('loseTitle');
            this.betLabel_win.node.active = false;
            this.betLabel_lose.node.active = true;
            // if(!result.winShare && !result.loseShare) {
            //     var chip = hall.ME.getChip();
            //     if (chip < 1000){
            //         ddz.gameModel.checkShareReward(ddz.Share.SharePointType.alms);
            //     }
            // }
        }

        var call = result.stat.call;
        var bc = result.stat.bomb;
        bc = Math.pow(2, bc);
        var chuntian = result.stat.chuntian;

        this.betLabel_1.string = call + "倍";
        this.betLabel_2.string = bc > 1 ? parseInt(bc) + "倍" : "--";
        this.betLabel_3.string = chuntian > 1 ? chuntian + "倍" : "--";
        this.betLabel_win.string = parseInt(call * bc * chuntian) + "倍";
        this.betLabel_lose.string = parseInt(call * bc * chuntian) + "倍";
        this.betLabel.string = parseInt(call * bc * chuntian) + "倍";
        this.node.active = true;
        this.bottomNode.active = true;

        this.lizi01.getComponent('cc.ParticleSystem').resetSystem();
        this.lizi02.getComponent('cc.ParticleSystem').resetSystem();
        this.lizi03.getComponent('cc.ParticleSystem').resetSystem();
        this.lizi04.getComponent('cc.ParticleSystem').resetSystem();

        var bc = ddz.gameModel.getRoomListBannerConfigJson();
        if (bc) {
            this.playResurtBanner();
        }
        ddz.gameResultPanel = this;

        // "currWinDoubles", {"multi" : 24, "percent":65 , "isChunTian": 1}
        // if(result.currWinDoubles){
        //     this.nextBtnLabel.string = "<color=#ffffff>分享战绩</color>";
        //     this.shareButton.node.active = true;
        //     if(result.currWinDoubles.isChunTian){
        //         this.shareType = "showy_spring";
        //     }else {
        //         this.shareType = "showy_highPower";
        //     }
        //     this.shareData = result.currWinDoubles;
        //     if (ddz.haveBanner) {
        //         var bottomNode = this.node.getChildByName('bottomNode');
        //         var bw = bottomNode.getComponent(cc.Widget);
        //         bw.bottom = 100;
        //     }
        // }else {
        //     this.nextBtnLabel.string = "<color=#ffffff>点击屏幕任意位置继续  5</color>";
        //     this.shareButton.node.active = false;
        //     this.shareType = "";
        //     if (ddz.haveBanner) {
        //         var bottomNode = this.node.getChildByName('bottomNode');
        //         var bw = bottomNode.getComponent(cc.Widget);
        //         bw.bottom = 50;
        //     }
        // }
        this.nextBtnLabel.string = "<color=#B3B3B3>点击屏幕任意位置继续  5</color>";
        this.updateNextBtnLabel();
        this.shareButton.node.active = false;
        this.shareType = "";
        // if (ddz.haveBanner) {
        //     var bottomNode = this.node.getChildByName('bottomNode');
        //     var bw = bottomNode.getComponent(cc.Widget);
        //     bw.bottom = 50;
        // }
    },

    updateNextBtnLabel:function(){
        var tiemr = 10;
        this.node.stopAllActions();
        var that = this;
        var callFunc = function(){
            tiemr--;
            if (tiemr > 0){
                that.nextBtnLabel.string = "<color=#B3B3B3>点击屏幕任意位置继续  "+ tiemr +"</color>";
            }else {
                that.nextBtnAction()
            }

            that.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(callFunc, this)));
        };

        callFunc();
    },

    callBackFun : function () {
        
    },

    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        this._tableScene = null;
        ddz.gameResultPanel = null;
        ddz.almsWindow = null;
        hall.adManager.destroyWidthBannerAd();
    }
});
