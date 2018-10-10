(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/double_cell_weaponsDepot.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2d390E8EShM0ZJynWCBASMu', 'double_cell_weaponsDepot', __filename);
// Script/ComponentScript/component/double_cell_weaponsDepot.js

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
        weaponBgSprite: {
            default: null,
            type: cc.Sprite
        },
        weaponSprite: {
            default: null,
            type: cc.Sprite
        }
    },

    changeBackgroundColor: function changeBackgroundColor(type) {
        this.weaponBgSprite.node.color = double.weaponsPageCellColor[type];
    },
    changeWeaponSpriteFrame: function changeWeaponSpriteFrame(spriteF) {
        this.weaponSprite.spriteFrame = spriteF;
    },

    blackAction: function blackAction() {},
    backAction: function backAction() {},
    onLoad: function onLoad() {},
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    //
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
        //# sourceMappingURL=double_cell_weaponsDepot.js.map
        