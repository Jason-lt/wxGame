(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_window_dissolve.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '038e6K36xlMY4tpcPy7/uTg', 'ddz_window_dissolve', __filename);
// Script/ComponentScript/window/ddz_window_dissolve.js

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
        detailText: {
            default: null,
            type: cc.RichText
        }
    },

    onLoad: function onLoad() {
        ty.Timer.setTimer(this, this.cancelDismiss, 3);
    },

    setTipsSString: function setTipsSString(tips) {
        this.detailText.string = "<color=#ffffff>" + tips + "</c>";
    },

    setDissolveFailDetailTextString: function setDissolveFailDetailTextString(nameA, success) {

        var nameString = "";
        for (var i = 0; i < nameA.length; i++) {
            if (i == 0) {
                nameString = nameString + nameA[i];
            } else {
                nameString = nameString + " 、 " + nameA[i];
            }
        }
        var successString = "";
        if (success) {
            successString = "<color=#ffffff>同意解散牌桌</c>";
        } else {
            successString = "<color=#ffffff>不同意解散牌桌,请继续游戏</c>";
        }
        this.detailText.string = "<color=#ffffff>玩家 </c><color=#fff888>" + nameString + "</color><br/>" + successString;
    },
    cancelDismiss: function cancelDismiss() {
        ty.NotificationCenter.trigger(ddz.EventType.ACTION_END_RESULT_SHOW);
        this.node.removeFromParent();
    },
    onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


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
        //# sourceMappingURL=ddz_window_dissolve.js.map
        