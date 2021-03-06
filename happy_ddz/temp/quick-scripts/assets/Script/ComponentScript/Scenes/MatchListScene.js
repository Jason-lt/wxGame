(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/Scenes/MatchListScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f5070RMeZxFybZxWkyOs5ve', 'MatchListScene', __filename);
// Script/ComponentScript/Scenes/MatchListScene.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        backButton: {
            default: null,
            type: cc.Button
        },
        tableView: {
            default: null,
            type: cc.Node
        },

        scrollView: {
            default: null,
            type: cc.ScrollView
        },

        personalAssets: {
            default: null,
            type: cc.Node
        },

        colorbgOver: {
            default: null,
            type: cc.Node
        },

        ddz_cell_matchlist: cc.Prefab,
        match_enter: cc.Prefab,

        leftCellX: -156,
        rightCellX: 156
    },

    onLoad: function onLoad() {
        ddz.GlobalFuncs.drawGameCanvas();
        this.cellHeight = 240;
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backButton.node.y = backButtonH;
            this.personalAssets.y = backButtonH;
        }
        this.content = this.scrollView.content;
        ty.NotificationCenter.listen(ddz.EventType.ASYNC_COMMON_ARENA_MATCH, this.onMatchList, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.showMatchInfo, this);
        ty.NotificationCenter.listen(ddz.EventType.SHOW_MATCHING, this.showColorBgOver, this);
        ty.NotificationCenter.listen(ddz.EventType.CLICK_MATCHING_ITEM, this.onClickMatchItem, this);
        ty.NotificationCenter.listen(ddz.EventType.OPEN_BANNER, this.playBanner, this);
        // 请求房间列表
        hall.MsgFactory.getArenaMatchList(ty.SystemInfo.gameId);
        this.setPersonalAssets();

        var bc = ddz.gameModel.getRoomListBannerConfigJson();
        if (bc) {
            this.playBanner(bc);
        }
        // hall.adManager.hideAd();
    },

    playBanner: function playBanner(bc) {
        var winnerCount = ddz.matchModel.getCurWinnerCount();
        if (bc.start) {
            if (winnerCount >= bc.start) {
                var pw = this.personalAssets.getComponent(cc.Widget);
                pw.bottom = 265;

                var sw = this.scrollView.getComponent(cc.Widget);
                sw.bottom = 494;
                hall.adManager.canShowListSceneBanner = true;
                this.showBannerAd();
                if (bc.delay && bc.delay > 0) {
                    ty.Timer.setTimer(this, this.showBannerAd, bc.delay);
                }
            }
        } else {
            var pw = this.personalAssets.getComponent(cc.Widget);
            pw.bottom = 265;

            var sw = this.scrollView.getComponent(cc.Widget);
            sw.bottom = 494;
            hall.adManager.canShowListSceneBanner = true;
            this.showBannerAd();
            if (bc.delay && bc.delay > 0) {
                ty.Timer.setTimer(this, this.showBannerAd, bc.delay);
            }
        }
    },

    showBannerAd: function showBannerAd() {
        hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
    },

    onClickMatchItem: function onClickMatchItem(matchId) {
        this.clickedMatchId = matchId;
    },

    showColorBgOver: function showColorBgOver() {
        this.colorbgOver.active = true;
    },

    showMatchInfo: function showMatchInfo(matchInfo) {
        if (this.clickedMatchId != matchInfo.matchId) {
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        var nofityW = cc.instantiate(this.match_enter);
        this.node.addChild(nofityW);
        var window = nofityW.getComponent('ddz_window_match_enter');
        window.updateByMatchData(matchInfo);
        this.clickedMatchId = -1;
    },

    onMatchList: function onMatchList() {
        var matchList = [];
        for (var key in hall.ME.matchInfo.matchArray) {
            matchList.push(hall.ME.matchInfo.matchArray[key]);
        }
        this.updateRoomList(matchList);
    },

    updateRoomList: function updateRoomList(roomInfo) {
        this.content.removeAllChildren();
        this.content.height = roomInfo.length * this.cellHeight;
        if (roomInfo.length > 0) {
            for (var i = 0; i < roomInfo.length; i++) {
                var cell = cc.instantiate(this.ddz_cell_matchlist);
                var com = cell.getComponent('ddz_cell_matchlist');
                com.addDataWithObject(roomInfo[i]);

                com.index = i;
                if (i % 2 == 0) {
                    cell.x = this.leftCellX;
                } else {
                    cell.x = this.rightCellX;
                }

                // cell.y = - i * this.cellHeight - (this.cellHeight / 2);
                cell.y = -Math.floor(i / 2) * this.cellHeight - this.cellHeight / 2 - 5;
                this.content.addChild(cell);
            }
        }
    },

    setPersonalAssets: function setPersonalAssets() {
        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();
    },

    backAction: function backAction() {
        ddz.LOGD(null, "file = [RoomListScene] fun = [backAction]");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=MatchListScene.js.map
        