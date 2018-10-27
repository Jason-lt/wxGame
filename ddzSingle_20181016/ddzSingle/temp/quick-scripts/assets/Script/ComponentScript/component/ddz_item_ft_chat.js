(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_item_ft_chat.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd04b4ZZ4fRNlb/8ZQMrpOza', 'ddz_item_ft_chat', __filename);
// Script/ComponentScript/component/ddz_item_ft_chat.js

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
        bgSprite: {
            default: null,
            type: cc.Sprite
        },
        msgLabel: {
            default: null,
            type: cc.Label
        }
    },

    setDetailMsg: function setDetailMsg(msg) {
        this.msgLabel.string = msg;
        var allWidth = this.msgLabel.node.width;
        // if(this.isReverse){
        //     this.msgLabel.x = 50-allWidth;
        // }else {
        //     this.msgLabel.x = -50;
        // }
        this.bgSprite.node.width = allWidth + 30;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

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
        //# sourceMappingURL=ddz_item_ft_chat.js.map
        