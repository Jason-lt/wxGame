(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/double_titlePage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '82de20H1ZxLYoWAs2WQySZp', 'double_titlePage', __filename);
// Script/ComponentScript/window/double_titlePage.js

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

        levelLabel: {
            default: null,
            type: cc.Label
        },
        solveLabel: {
            default: null,
            type: cc.Label
        },
        coinLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    blackAction: function blackAction() {},
    backAction: function backAction() {},
    onLoad: function onLoad() {},
    updateTitlePage: function updateTitlePage() {
        double.GameWorld.totalLevel = hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_LEVEL, 1);
        this.levelLabel.string = "第" + double.GameWorld.totalLevel + "关";
        var nextNewLevel = 0;
        var addTemp = 2;
        while (nextNewLevel < double.GameWorld.totalLevel) {
            nextNewLevel += addTemp;
            addTemp++;
        }
        this.solveLabel.string = "第" + (nextNewLevel + 1) + "关解锁新物品";
        this.scoreLabel.string = "最高成绩:" + hall.GlobalFuncs.ReadNumFromLocalStorage(double.gameModel.GAME_BEST_SCORE, "0");
        this.coinLabel.string = double.GameWorld.chipNumber;
    },

    rankAction: function rankAction() {
        // this.closeSelfWindow();
        double.GlobalFuncs.showRankList();
    },
    weaponsDepotAction: function weaponsDepotAction() {
        // this.closeSelfWindow();
        double.GlobalFuncs.showWeaponsDepot();
    },
    gameStartAction: function gameStartAction() {
        this.closeSelfWindow();
        ty.NotificationCenter.trigger(double.EventType.GAME_START, false);
    },
    closeSelfWindow: function closeSelfWindow() {
        this.node.removeFromParent();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
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
        //# sourceMappingURL=double_titlePage.js.map
        