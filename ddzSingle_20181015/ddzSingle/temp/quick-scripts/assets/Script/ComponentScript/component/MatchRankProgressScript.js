(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/MatchRankProgressScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '735b4aWvOhAV69RxrI45V1b', 'MatchRankProgressScript', __filename);
// Script/ComponentScript/component/MatchRankProgressScript.js

'use strict';

/**
 * 比赛进度条
 */
cc.Class({
    extends: cc.Component,

    ctor: function ctor() {},

    properties: {
        subPrefab: cc.Prefab
    },

    onLoad: function onLoad() {},

    initWithPars: function initWithPars(forwardIndex, stages_P, playAni) {
        this._forwardIndex = forwardIndex;
        this._stages = stages_P;

        var startIndex = this._forwardIndex - 1 - 1;
        if (startIndex < 0) {
            startIndex = 0;
        }

        var endIndex = startIndex + 4;
        if (endIndex > this._stages.length) {
            endIndex = this._stages.length;
            startIndex = endIndex - 4;
            if (startIndex < 0) {
                startIndex = 0;
            }
        }

        var lsLen = this._stages.length;

        //生成进度条
        var stage, stageNode, obj, viewtype, needShowRight, stageCom;
        for (var i = endIndex - 1; i >= startIndex; i--) {
            stage = this._stages[i];
            stageNode = this.createNewStage();
            stageNode.parent = this.node;
            viewtype = stage.index < this._forwardIndex ? 1 : 0;

            needShowRight = i < lsLen - 1 && i == endIndex - 1;

            obj = {
                numLeft: stage.totalUserCount,
                numRight: stage.riseUserCount,
                type: viewtype,
                listLen: lsLen,
                needShowLeft: i == startIndex,
                needShowRight: needShowRight
            };
            stageCom = stageNode.getComponent('ProgressBarSub');
            stageCom.initWith(obj);
            if (stage.index == this._forwardIndex && playAni) {
                stageCom.forward();
            }
        }
    },

    /**
     * 创建一个新节点(也有可能是从池中取出来的)
     */
    createNewStage: function createNewStage() {
        var stageNode;
        stageNode = cc.instantiate(this.subPrefab);
        return stageNode;
    },

    onDestroy: function onDestroy() {}

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
        //# sourceMappingURL=MatchRankProgressScript.js.map
        