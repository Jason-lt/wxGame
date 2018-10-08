(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_arena_start.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f129e6viyxJdJAWdchDEPkX', 'ddz_arena_start', __filename);
// Script/ComponentScript/window/ddz_arena_start.js

"use strict";

// var ddz_main = cc.instantiate(this.tipsWindow);
// this.node.addChild(ddz_main);
// var window = ddz_main.getComponent('ddz_fail');
// window.setDiamondCount("五","56");
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {},

    properties: {
        progressNode: cc.Node
    },

    onLoad: function onLoad() {
        //var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        //if (backButtonH){
        //    this.backButton.node.y = backButtonH;
        //}
        ty.NotificationCenter.listen(ddz.EventType.ACTION_CHALLENGE, this.delayDestroy, this);
    },

    showArenaStageProgress: function showArenaStageProgress(stages, curStage, playani) {
        var scr = this.progressNode.getComponent("MatchRankProgressScript");
        scr.initWithPars(stages, curStage, playani);
    },

    delayDestroy: function delayDestroy() {
        ty.Timer.setTimer(this, this.shutSelf, 0.05, 1, 0);
    },

    shutSelf: function shutSelf() {
        ty.Timer.cancelTimer(this, this.shutSelf);
        ty.NotificationCenter.ignoreScope(this);
        this.node && this.node.destroy();
    },

    shut: function shut() {
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=ddz_arena_start.js.map
        