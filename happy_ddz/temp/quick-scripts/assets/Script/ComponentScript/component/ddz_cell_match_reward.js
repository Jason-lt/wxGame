(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_cell_match_reward.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd29b3R36cFFLb88xpL8k909', 'ddz_cell_match_reward', __filename);
// Script/ComponentScript/component/ddz_cell_match_reward.js

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
        rankLabel: {
            default: null,
            type: cc.RichText
        },
        rewardDes: {
            default: null,
            type: cc.RichText
        }
    },

    updateItem: function updateItem(startIndex, endIndex, rewardDes) {
        var colorDes = "<color=#FD5051>";
        var colorEnd = "</c>";
        if (startIndex > 3) {
            colorDes = "<color=#1A6951>";
        }
        if (startIndex == endIndex) {
            this.rankLabel.string = colorDes + "第" + startIndex + "名:" + colorEnd;
        } else {
            this.rankLabel.string = colorDes + startIndex + "-" + endIndex + "名:" + colorEnd;
        }
        this.rewardDes.string = colorDes + rewardDes + colorEnd;
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
        //# sourceMappingURL=ddz_cell_match_reward.js.map
        