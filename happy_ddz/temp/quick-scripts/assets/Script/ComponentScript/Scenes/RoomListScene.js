(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/Scenes/RoomListScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2c8a4G8blNEboghIzGJgmfL', 'RoomListScene', __filename);
// Script/ComponentScript/Scenes/RoomListScene.js

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

        conversionSuccess: {
            default: null,
            type: cc.Prefab
        },

        cellHeight: 210,

        ddz_cell_roomlist: cc.Prefab,

        leftCellX: -156,
        rightCellX: 156
    },

    onLoad: function onLoad() {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backButton.node.y = backButtonH;
            this.personalAssets.y = backButtonH;
        }
        this.isOnStart = false;
        this.play_mode;
        this.content = this.scrollView.content;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_HALL_INFO, this.onHallInfo, this);
        // 请求房间列表
        hall.MsgFactory.getHallInfo(ty.SystemInfo.gameId);

        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.onSaveMatch, this);
        ty.NotificationCenter.listen(ddz.EventType.OPEN_BANNER, this.playBanner, this);
        this.setPersonalAssets();

        var bc = ddz.gameModel.getRoomListBannerConfigJson();
        if (bc) {
            this.playBanner(bc);
        }
    },

    playBanner: function playBanner(bc) {
        var winnerCount = ddz.matchModel.getCurWinnerCount();
        if (bc) {
            if (bc.start) {
                if (winnerCount >= bc.start) {
                    var bottomNode = this.node.getChildByName('quicklyBtn');
                    var bw = bottomNode.getComponent(cc.Widget);
                    bw.bottom = 320;

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
                var bottomNode = this.node.getChildByName('quicklyBtn');
                var bw = bottomNode.getComponent(cc.Widget);
                bw.bottom = 320;

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
        }
    },

    showBannerAd: function showBannerAd() {
        if (hall.adManager.canShowListSceneBanner) {
            hall.adManager.showAllWidthBannerAd('adunit-811cc4e234425489');
        }
    },

    setPlayMode: function setPlayMode(_play_mode) {
        this._play_mode = _play_mode;
    },

    onHallInfo: function onHallInfo() {
        // 经典场
        var roomInfo = hall.gameWorld.getRoomsByType(ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN);
        this.chip_room_length = roomInfo.length;
        var laiRoomInfo = hall.gameWorld.getRoomsByType(ddz.Enums.PlayType.PLAY_TYPE_LAIZI);
        var roomInfo = roomInfo.concat(laiRoomInfo);
        if (roomInfo[0].play_mode) {
            this.play_mode = roomInfo[0].play_mode;
        }
        this.isOnStart = false;
        this.updateRoomList(roomInfo);
    },

    updateRoomList: function updateRoomList(roomInfo) {
        hall.LOGW("", "file = [RoomListScene] fun = [updateRoomList] this.play_mode = " + JSON.stringify(this.play_mode));
        this.content.removeAllChildren();
        this.scrollView.content.height = Math.ceil(roomInfo.length / 2) * this.cellHeight;
        var isOnce = true;
        if (roomInfo.length > 0) {
            for (var i = 0; i < roomInfo.length; i++) {
                var cell = cc.instantiate(this.ddz_cell_roomlist);
                var com = cell.getComponent('ddz_cell_roomlist');
                com.addDataWithObject(roomInfo[i]);
                com.index = i;
                if (i % 2 == 0) {
                    cell.x = this.leftCellX;
                } else {
                    cell.x = this.rightCellX;
                }
                cell.y = -Math.floor(i / 2) * this.cellHeight - this.cellHeight / 2 - 5;
                this.content.addChild(cell);
                if (roomInfo[i].play_mode == "123") {
                    var _chip = hall.ME.getChip();
                    if (isOnce && _chip <= roomInfo[i].minQuickStartChip) {
                        isOnce = false;
                        var index = 0;
                        if (i > 0) {
                            index = i - 1;
                        }
                        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_ROOMLIST_KUANG, index);
                    }
                }
            }

            if (isOnce) {
                var _index = roomInfo.length - 1;
                if (this.chip_room_length > 0) {
                    _index = this.chip_room_length - 1;
                }
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_ROOMLIST_KUANG, _index);
            }
        }
    },

    // 点击tips 邀请好友按钮
    onClickCenterButton: function onClickCenterButton() {
        var shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
        ddz.Share.shareWithType(shareType);
    },

    setPersonalAssets: function setPersonalAssets() {
        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();
    },

    onSaveMatch: function onSaveMatch() {
        if (this.isOnStart) {
            this.isOnStart = false;
            var _gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;

            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, null, hall.staticSystemInfo.version, null, null, null, null, null, this.play_mode);
        }
    },

    // 快速开始
    quickBegan: function quickBegan() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["roomListClick", "快速开始"]);
        if (ddz.matchModel.getCurWaitInfo()) {
            this.isOnStart = true;
            ddz.MsgFactory.saveMatch();
        } else {
            this.isOnStart = false;
            var _gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;
            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, null, hall.staticSystemInfo.version, null, null, null, null, null, this.play_mode);
        }
    },

    backAction: function backAction() {
        ddz.LOGD(null, "file = [RoomListScene] fun = [backAction]");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    onDestroy: function onDestroy() {
        this._playMode = null;
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
        //# sourceMappingURL=RoomListScene.js.map
        