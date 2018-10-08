(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/Scenes/RechargeScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7fccc6mv8JA37iX9x6KseIm', 'RechargeScene', __filename);
// Script/ComponentScript/Scenes/RechargeScene.js

"use strict";

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

        personalAssets: {
            default: null,
            type: cc.Node
        },

        conversionSuccess: {
            default: null,
            type: cc.Prefab
        }

    },

    onLoad: function onLoad() {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH) {
            this.backButton.node.y = backButtonH;
            this.personalAssets.y = backButtonH;
        }

        this.updateMallData();
    },

    updateMallData: function updateMallData() {
        var _m_diamondList = hall.gameWorld.model.m_diamondList;

        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();

        var resultArr = [];
        if (_m_diamondList.length <= 0) {
            return;
        }
        for (var i = 0; i < _m_diamondList.length; i++) {
            var addMap = {};
            addMap.m_diamond = _m_diamondList[i].m_price_diamond;
            addMap.m_mallet = _m_diamondList[i].m_price;
            addMap.m_id = _m_diamondList[i].m_id;
            addMap.m_name = _m_diamondList[i].m_name;
            // addMap.radio = 0;
            resultArr.push(addMap);
        }
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(resultArr);
    },

    backAction: function backAction() {
        ddz.LOGD(null, "file = [MallScene] fun = [backAction]");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=RechargeScene.js.map
        