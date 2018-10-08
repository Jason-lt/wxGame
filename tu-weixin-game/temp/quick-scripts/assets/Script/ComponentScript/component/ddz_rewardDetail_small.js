(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_rewardDetail_small.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e6887gvngRLHIY/mgQOHvQ9', 'ddz_rewardDetail_small', __filename);
// Script/ComponentScript/component/ddz_rewardDetail_small.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        ddz_rewardCell: {
            default: null,
            type: cc.Prefab
        },
        // moreButton : {
        //     default : null,
        //     type : cc.Button
        // },

        panel: cc.Node,

        parentScene: {
            default: null,
            serializable: false
        },

        cellHeight: 102
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.moreButton.node.on("click",this.onMoreButton,this);
    },

    setInformationWithTotalAndLoss: function setInformationWithTotalAndLoss(inforArray) {
        for (var i = 0; i < 8; i++) {
            var ddz_cell = cc.instantiate(this.ddz_rewardCell);
            // ddz_cell.y = -130-this.cellHeight*i;
            ddz_cell.y = -60 - this.cellHeight * i;
            this.panel.addChild(ddz_cell);
            var ddz_rewardCellS = ddz_cell.getComponent('ddz_rewardCell');
            if (i < inforArray.length) {
                var resultA = inforArray[i];
                ddz_rewardCellS.setDetailInformation(resultA);
            } else {
                ddz_rewardCellS.setDetailInformation({ "titleS": "--", "numberString": "--", "timeS": "--", "stateS": "--" });
            }

            // if (i%2 == 0) {
            //     ddz_rewardCellS.setBgSpr(true);
            // }else {
            //     ddz_rewardCellS.setBgSpr(false);
            // }
        }
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
        //# sourceMappingURL=ddz_rewardDetail_small.js.map
        