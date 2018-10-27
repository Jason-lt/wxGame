(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_game_result.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e8287EWkLRG95XOxKf3VqG5', 'ddz_game_result', __filename);
// Script/ComponentScript/window/ddz_game_result.js

"use strict";

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
        betLabel_0: {
            default: null,
            type: cc.Label
        },
        betLabel_1: {
            default: null,
            type: cc.Label
        },
        betLabel_2: {
            default: null,
            type: cc.Label
        },
        betLabel_3: {
            default: null,
            type: cc.Label
        },
        betLabel_4: {
            default: null,
            type: cc.Label
        },
        failBetLabel_0: {
            default: null,
            type: cc.Label
        },
        failBetLabel_1: {
            default: null,
            type: cc.Label
        },
        failBetLabel_2: {
            default: null,
            type: cc.Label
        },
        failBetLabel_3: {
            default: null,
            type: cc.Label
        },
        failBetLabel_4: {
            default: null,
            type: cc.Label
        },

        winLight: cc.Node,
        loseLight: cc.Node,
        winNode: cc.Node,
        failNode: cc.Node,
        doubleHalve: cc.Node,
        winLabel: cc.Label,
        failLabel: cc.Label,
        nextBtn: cc.Button,
        shareButton: cc.Button,
        btnText: cc.Label,
        timeNumber: 5,
        shareType: "",
        shareData: "",
        // hasClickNext : false
        rewardSpr: cc.Sprite,
        rewardSpriteFrame: [cc.SpriteFrame]
    },

    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.updateShareState, this);
    },

    setTableScene: function setTableScene(tableScene) {
        this._tableScene = tableScene;
    },

    nextBtnAction: function nextBtnAction() {
        this.node.active = false;
        this.stopAni();
        this._tableScene.onClickSureBtn();
    },

    updateShareState: function updateShareState(shareType) {
        if (shareType == ddz.Share.onShareType.clickStatShareTypeGoldDoubleHalve) {
            this.shareButton.node.active = false;
            this.rewardSpr.node.active = true;
            if (this.win) {
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[0];
            } else {
                this.rewardSpr.spriteFrame = this.rewardSpriteFrame[1];
                this.winLoseGold /= 2;
            }
            var chip = hall.ME.getChip() + this.winLoseGold;
            hall.ME.setChip(chip);
            this._tableScene._mySeatinfo.model.m_buyinChip = chip;
            var anim = this.doubleHalve.getComponent(cc.Animation);
            anim.play('djddz_jiesuan_fbjb');
            this._tableScene._goldPanel.initScore();
        }
    },

    rewardBtn: function rewardBtn() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["rewardBtn", "click"]);
        var _config = ddz.gameConfig.getShareVideoConfigToCity();
        if (_config && _config["doubleHalve"].type == "share") {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGoldDoubleHalve);
        }
    },

    stopAni: function stopAni() {
        var animationCom = this.winNode.getComponent(cc.Animation);
        var ani = animationCom.getAnimationState('djddz_jiesuan_sl');
        ani.stop();

        animationCom = this.failNode.getComponent(cc.Animation);
        ani = animationCom.getAnimationState('djddz_jiesuan_sb');
        ani.stop();

        animationCom = this.doubleHalve.getComponent(cc.Animation);
        ani = animationCom.getAnimationState('djddz_jiesuan_fbjb');
        ani.stop();
    },

    backAction: function backAction() {
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
    },

    show: function show(result) {
        this.shareButton.node.active = true;
        this.rewardSpr.node.active = false;
        this.winLoseGold = 0;
        var mySeatIndex = result.mySeatIndex;
        var dizhuWin = result.dizhuwin;
        var isWin = false;

        if (mySeatIndex == result.stat.dizhu) {
            isWin = dizhuWin;
        } else {
            isWin = !dizhuWin;
        }
        this.win = isWin;
        // var mySeatInfo = result['seat' + mySeatIndex];
        // var delta = mySeatInfo[0];
        // var deltaAll = mySeatInfo[12];
        //
        // if (delta > 0){
        //     delta = "+"+ delta;
        // }

        var anim;
        var call = result.stat.call;
        var bc = result.stat.bomb;
        bc = Math.pow(2, bc);
        var chuntian = result.stat.chuntian;
        var base = result.stat.base;
        var ismulit = 1;
        if (mySeatIndex == result.stat.dizhu) {
            ismulit *= 2;
        }
        var _config = ddz.gameConfig.getShareVideoConfigToCity();
        if (_config && _config["doubleHalve"].type == "none") {
            this.shareButton.node.active = false;
        }
        if (isWin) {
            this.winNode.active = true;
            this.failNode.active = false;

            anim = this.winNode.getComponent(cc.Animation);
            anim.play('djddz_jiesuan_sl');

            this.btnText.string = "分享双倍";

            this.betLabel_0.string = base;
            this.betLabel_1.string = call + "倍";
            this.betLabel_2.string = bc > 1 ? parseInt(bc) + "倍" : "--";
            this.betLabel_3.string = chuntian > 1 ? chuntian + "倍" : "--";
            this.betLabel_4.string = parseInt(call * bc * chuntian) + "倍";

            this.winLabel.string = "+" + parseInt(call * bc * chuntian * base * ismulit);
            this.winLoseGold = parseInt(call * bc * chuntian * base * ismulit);
        } else {
            this.winNode.active = false;
            this.failNode.active = true;
            anim = this.failNode.getComponent(cc.Animation);
            anim.play('djddz_jiesuan_sb');
            this.btnText.string = "分享减半";
            this.failBetLabel_0.string = base;
            this.failBetLabel_1.string = call + "倍";
            this.failBetLabel_2.string = bc > 1 ? parseInt(bc) + "倍" : "--";
            this.failBetLabel_3.string = chuntian > 1 ? chuntian + "倍" : "--";
            this.failBetLabel_4.string = parseInt(call * bc * chuntian) + "倍";
            this.failLabel.string = "-" + parseInt(call * bc * chuntian * base * ismulit);
            this.winLoseGold = parseInt(call * bc * chuntian * base * ismulit);
            // if(!result.winShare && !result.loseShare) {
            //     var chip = hall.ME.getChip();
            //     if (chip < 1000){
            //         ddz.gameModel.checkShareReward(ddz.Share.SharePointType.alms);
            //     }
            // }
        }
        // this.resultSpr.spriteFrame = this.sprFrame[isWin ? 0 : 1];
        this.node.active = true;

        ddz.gameResultPanel = this;
    },

    update: function update(dt) {
        if (this.winLight.active) {
            this.winLight.rotation += 0.3;
        }
        if (this.loseLight.active) {
            this.winLight.rotation += 0.3;
        }
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this._tableScene = null;
        ddz.gameResultPanel = null;
        ddz.almsWindow = null;
        hall.adManager.destroyWidthBannerAd();
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
        //# sourceMappingURL=ddz_game_result.js.map
        