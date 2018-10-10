(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/double_weaponsDepot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c1657EOHvZHxZKAYM2l+RFe', 'double_weaponsDepot', __filename);
// Script/ComponentScript/window/double_weaponsDepot.js

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

        coinLabel: {
            default: null,
            type: cc.Label
        },

        pageTypeSprite: {
            default: null,
            type: cc.Sprite
        },
        pageTypeSpriteFrameList: [cc.SpriteFrame],
        progressLabel: {
            default: null,
            type: cc.Label
        },

        weaponSpriteFrameList: [cc.SpriteFrame],
        weaponSpriteFrameList2: [cc.SpriteFrame],
        weaponNodeList: [cc.Node],

        myPageView: {
            default: null,
            type: cc.PageView
        },
        nowPageIndex: 0,
        tempPageIndex: 0,

        pageCellPrefab: {
            default: null,
            type: cc.Prefab
        },

        solveButton: {
            default: null,
            type: cc.Button
        }
    },
    blackAction: function blackAction() {},
    backAction: function backAction() {
        this.node.removeFromParent();
    },
    onLoad: function onLoad() {
        this.solveButton.enableAutoGrayEffect = true;
        this.myPageView.node.on("scrolling", this.pageViewScrolling, this);

        var pages = this.myPageView.getPages();
        var pageView;
        var tempColor;
        for (var i = 0; i < pages; i++) {
            pageView = pages[i];
            if (i == 0) {
                tempColor = double.weaponsPageCellColor.weaponBgGreen;
            } else if (i == 1) {
                tempColor = double.weaponsPageCellColor.weaponBgYellow;
            } else {
                tempColor = double.weaponsPageCellColor.weaponBgPink;
            }
            for (var j = 0; j < 12; j++) {
                var addWindow = cc.instantiate(this.pageCellPrefab);
                addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(tempColor);
                addWindow.getComponent("double_cell_weaponsDepot").changeWeaponSpriteFrame(this.weaponSpriteFrameList[i]);
                //TODO:选出已有武器
                // if(1){
                //     addWindow.getComponent("double_cell_weaponsDepot").changeBackgroundColor(double.weaponsPageCellColor.weaponBgWhite);
                //     addWindow.getComponent("double_cell_weaponsDepot").changeWeaponSpriteFrame(this.weaponSpriteFrameList2[i*12+j]);
                // }
                this.weaponNodeList.push(addWindow);
                addWindow.x = j % 3 * 150 - 150;
                addWindow.y = 249 - parseInt(j / 3) * 166;
                pageView.addChild(addWindow);
            }
        }
    },
    updateWeaponsDepotInfo: function updateWeaponsDepotInfo() {
        this.coinLabel.string = double.GameWorld.chipNumber;
        //TODO: 计算解锁所需金币
        this.solveButton.interactable = double.GameWorld.chipNumber >= 35;
        //TODO:计算武器状况
        this.progressLabel.string = "4/12";

        var pages = this.myPageView.getPages();
        var pageView;
        for (var i = 0; i < pages; i++) {
            pageView = pages[i];
            for (var j = 0; j < 12; j++) {
                var addWindow = cc.instantiate(this.pageCellPrefab);
            }
        }
    },

    pageViewScrolling: function pageViewScrolling(event) {
        this.tempPageIndex = this.myPageView.getCurrentPageIndex();
        if (this.tempPageIndex != this.nowPageIndex) {
            this.nowPageIndex = this.tempPageIndex;
            this.pageTypeSprite.spriteFrame = this.pageTypeSpriteFrameList[this.nowPageIndex];
            var number = 0;
            this.progressLabel.string = number + "/12";
        }
    },
    solveNewWeapon: function solveNewWeapon() {
        //TODO:随机在未解锁武器内抽取一个，配抽取动画,计算新武器ID
        double.GlobalFuncs.showWindowNewWeapon(double.windowNewWeaponType.newWeapon, 2);
    },
    addCoinAction: function addCoinAction() {
        hall.adManager.showRewardedVideo("weaponsDepot");
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:


    // start () {
    //
    // },

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
        //# sourceMappingURL=double_weaponsDepot.js.map
        