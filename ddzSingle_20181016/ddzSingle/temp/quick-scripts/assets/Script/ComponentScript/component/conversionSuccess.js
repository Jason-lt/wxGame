(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/conversionSuccess.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '75ec8soNHxJfLolNaGddEn6', 'conversionSuccess', __filename);
// Script/ComponentScript/component/conversionSuccess.js

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
        coinText: {
            default: null,
            type: cc.RichText
        },
        tipsText: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function onLoad() {},

    updateInfo: function updateInfo(num) {
        var str = "<img src='ddz_coin_white'/><color=#FFFFFF> " + num + "</c>";
        this.coinText.string = str;
    },

    updateTipsText: function updateTipsText(str) {
        this.tipsText.string = str;
    },

    updateCoinText: function updateCoinText(str) {
        this.coinText.string = str;
    },

    updateDiamondCount: function updateDiamondCount(num) {
        this.tipsText.string = "领奖成功";
        var str = "<img src='ddz_button_diamond'/><color=#FFFFFF> + " + num + "</c>";
        this.coinText.string = str;
        ty.Timer.setTimer(this, function () {
            if (ddz.tipsNode) {
                ddz.tipsNode.removeFromParent();
                ddz.tipsNode = null;
            }
        }, 1.5, 0, 0);
    },

    removeTips: function removeTips() {
        // if (this.node) {
        //     this.node.removeFromParent();
        // }
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
        //# sourceMappingURL=conversionSuccess.js.map
        