(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_useDiamond.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5552fE6wAdJTK3caTZpouRt', 'ddz_useDiamond', __filename);
// Script/ComponentScript/window/ddz_useDiamond.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        startRichText: {
            default: null,
            type: cc.RichText
        }
    },
    onLoad: function onLoad() {
        //屏幕适配
        // var widthScaling = ddz.GlobalFuncs.getWindowWidthscaling();
        // this.titleL.fontSize = this.titleL.fontSize*widthScaling;
        // this.detailText.fontSize = this.detailText.fontSize*widthScaling;
        // this.coutLabel.fontSize = this.coutLabel.fontSize*widthScaling;

        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.updateMatchInfo, this);

        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.changeEnterBtnState, this);
        // ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_RECORD, this.changeEnterBtnState, this);
        // this.changeEnterBtnState(ddz.matchModel.getStageIndex());
    },
    updateMatchInfo: function updateMatchInfo() {
        var matchDes = ddz.matchModel.getCurDes();
        var savaInfo = matchDes.saveInfo;
        if (matchDes.matchId == 6789 && savaInfo && savaInfo.record && savaInfo.record.stageIndex) {
            var _stageIndex = savaInfo.record.stageIndex;
            if (_stageIndex && _stageIndex > 1) {
                this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第" + _stageIndex + "关" + " </color>";
            } else {
                this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff>   开始闯关</color>";
            }
        }
    },
    // changeEnterBtnState:function (_stageIndex) {
    //     if (_stageIndex && _stageIndex > 1) {
    //         this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第"+_stageIndex+ "关" + " </color>";
    //     }else {
    //         this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff>   开始闯关</color>";
    //     }
    // },

    onDestroy: function onDestroy() {
        // this.button.node.off('click', this.callback, this);
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
        //# sourceMappingURL=ddz_useDiamond.js.map
        