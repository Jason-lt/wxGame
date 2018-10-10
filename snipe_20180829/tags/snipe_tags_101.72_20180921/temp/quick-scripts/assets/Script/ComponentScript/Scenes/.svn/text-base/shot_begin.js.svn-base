(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/Scenes/shot_begin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '40f1fwOvnBKBbO37+jJ+lIQ', 'shot_begin', __filename);
// Script/ComponentScript/Scenes/shot_begin.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // aniSpriteNode :{
        //     default : null,
        //     type : cc.Node
        // },
        bestScoreLabel: {
            default: null,
            type: cc.Label
        },
        diamondNode: {
            default: null,
            type: cc.Node
        },
        freeToolNode: {
            default: null,
            type: cc.Node
        }
    },

    onGetGift: function onGetGift() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["getDiamond"]);
        shot.GlobalFuncs.showDiamondGift(0);
    },

    onFreeTool: function onFreeTool() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["freeTool"]);
        shot.GlobalFuncs.showFreeTool();
    },

    startGame: function startGame() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["startGame"]);
        var sceneName = 'shot_main';
        var onLaunched = function onLaunched() {
            // var logicScene = cc.director.getScene();
            // var no = logicScene.children[0];
            // var window = no.getComponent('shot_rank');
            // window.showRankListForShare();
        };
        cc.director.loadScene(sceneName, onLaunched);
    },

    friendRank: function friendRank() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["friendRank"]);
        shot.GlobalFuncs.showRankList("");
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        ty.NotificationCenter.listen(shot.EventType.UPDATE_USERINFO, this.updateUserInfo, this);
        this.bestScoreLabel.string = "最佳得分:" + shot.Share.shareKeywordReplace.bestScoreForSelf;
        shot.gameModel.getUserInfoForShot();

        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicStart, true);
        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC, this.rePlayBgMusic, this);

        hall.adManager.checkVideoAd(); //Load广告
        hall.GlobalTimer.getCurWeek();

        this.changeDiamondNodeActive();
        this.changeGameClubButtonActive();
        ty.NotificationCenter.listen(shot.EventType.GUNNER_SHARE_SCHEME, this.changeDiamondNodeActive, this);
        ty.NotificationCenter.listen(shot.EventType.BSGS_CHECK_RESULT, this.changeDiamondNodeActive, this);
        ty.NotificationCenter.listen(shot.EventType.GUNNER_SHARE_SCHEME, this.changeGameClubButtonActive, this);

        this.getAdMsg();
        ty.NotificationCenter.listen(ty.EventType.GET_AD_MSG_SUCCESS, this.getAdMsg, this);

        shot.gameModel.checkRewardWithSharePoint(shot.Share.SharePointType.getFreeTool);
        ty.NotificationCenter.listen(shot.EventType.GET_CHECK_REWARD, this.changeFreeToolNodeActive, this);

        var result = ty.UserInfo.onShowParam;
        if (!result) {
            return;
        }
        //取相关参数
        var scene = result.scene;
        var query = result.query;
        var shareTicket;
        if (query && query.sourceCode && result.isFirstOpen) {
            //从小程序消息卡片中点入
            if (query.sourceCode == shot.Share.onShareType.clickStatShareTypeRankList && scene == 1044) {
                //群排行榜
                shareTicket = result.shareTicket;
                if (shareTicket) {
                    shot.GlobalFuncs.showRankList(shareTicket);
                }
            }
        }

        ty.UserInfo.onShowParam.isFirstOpen = false;
    },

    getAdMsg: function getAdMsg() {
        if (!shot.gameModel.getAllCheckConfig()) {
            if (hall.adManager.getAdNodeList().length < 1) {
                var sceneSize = cc.director.getWinSize();
                hall.adManager.showAd({ x: 72, y: sceneSize.height / 2 + 50 });
            } else {
                hall.adManager.getAdNodeList()[0].showAdNode();
            }
        }
    },

    changeDiamondNodeActive: function changeDiamondNodeActive() {
        if (shot.gameModel.getAllCheckConfig()) {
            this.diamondNode.active = false;
        } else {
            if (ty.UserInfo.isInBSGS) {
                this.diamondNode.active = shot.GameWorld.toolUserTimeConfig.diamondShow.bsgs;
            } else {
                this.diamondNode.active = shot.GameWorld.toolUserTimeConfig.diamondShow.nBsgs;
            }
        }
    },
    changeFreeToolNodeActive: function changeFreeToolNodeActive(result) {
        //{"cmd":"hall_share2","result":{"action":"check_reward","gameId":6,"userId":10042,"pointId":67890009,"leftCount":0}}
        this.freeToolNode.active = result.leftCount;
    },
    changeGameClubButtonActive: function changeGameClubButtonActive() {

        if (shot.GameWorld.gunnerShareSchemeConfig && shot.GameWorld.gunnerShareSchemeConfig.showGameClubButton) {
            if (!shot.gameClubButton) {
                var sysInfo = hall.adManager.getSysInfo();
                var screenHeight = sysInfo.screenHeight;
                hall.LOGD("===", "===screenHeight===" + screenHeight);
                shot.gameClubButton = wx.createGameClubButton({
                    type: "image",
                    image: "https://nslyqn.nalrer.cn/nsly/crazygun/icon/game.png",
                    icon: 'green',
                    style: {
                        left: 10,
                        top: screenHeight - 68,
                        width: 42,
                        height: 42
                    }
                });
            }
            shot.gameClubButton.show();
        }
    },

    rePlayBgMusic: function rePlayBgMusic() {
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicStart, true);
        // shot.AudioHelper.rePlayMusic();
    },

    updateUserInfo: function updateUserInfo(result) {

        if (result.playinfo.max_score) {
            shot.Share.shareKeywordReplace.bestScoreForSelf = result.playinfo.max_score;
            shot.GlobalFuncs.upDateRankData(result.playinfo.max_score);
        }
        // this.bestScoreLabel.string = "最佳得分:"+shot.Share.shareKeywordReplace.bestScoreForSelf;

        if (result.playinfo.history_score) {
            this.bestScoreLabel.string = "历史最佳:" + result.playinfo.history_score;
        }
    },

    update: function update(dt) {
        // this.aniSpriteNode.rotation += 1;
    },
    onDestroy: function onDestroy() {
        if (shot.gameClubButton) {
            shot.gameClubButton.destroy();
        }

        if (hall.adManager.getAdNodeList().length >= 1) {
            for (var i = 0; i < hall.adManager.getAdNodeList().length; i++) {
                hall.adManager.getAdNodeList()[i].hideAdNode();
            }
        }

        shot.gameClubButton = null;
        ty.NotificationCenter.ignoreScope(this);
    }
    // start () {shot.GlobalFuncs.showRankList
    //
    // },

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
        //# sourceMappingURL=shot_begin.js.map
        