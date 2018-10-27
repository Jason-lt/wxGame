(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/singleAI/ddzsingle_score_data.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bb748kiP8tLiqMzFDmAr8rm', 'ddzsingle_score_data', __filename);
// Script/ComponentScript/singleAI/ddzsingle_score_data.js

"use strict";

/**
 * Created by tuyoo on 2018/10/24.
 */
//带入分数
ddz.scoreData = {
    getAIScore: function getAIScore() {
        var score = hall.ME.getChip();
        var myScore = hall.ME.getChip();
        if (ddz.gameConfig.dragInConfig.length && ddz.gameConfig.dragInConfig.length > 0) {
            var _dragInConfig = ddz.gameConfig.dragInConfig;
            var len = _dragInConfig.length;
            for (var i = 0; i < len; i++) {
                if (myScore >= _dragInConfig[i].playerGold[0] && myScore <= _dragInConfig[i].playerGold[1]) {
                    score = Math.ceil(Math.random() * (_dragInConfig[i].AIGold[1] - _dragInConfig[i].AIGold[0]) + _dragInConfig[i].AIGold[0]);
                    ddz.LOGD("", "file = [scoreData] fun = [getAIScore] score = " + score);
                    break;
                }
            }
        }
        return score;
    },
    getBaseScore: function getBaseScore() {
        var base = 1;
        var myScore = hall.ME.getChip();
        if (ddz.gameConfig.dragInConfig.length && ddz.gameConfig.dragInConfig.length > 0) {
            var _dragInConfig = ddz.gameConfig.dragInConfig;
            var len = _dragInConfig.length;
            for (var i = 0; i < len; i++) {
                if (myScore >= _dragInConfig[i].playerGold[0] && myScore <= _dragInConfig[i].playerGold[1]) {
                    base = _dragInConfig[i].baseScore;
                    break;
                }
            }
        }
        return base;
    }
};

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
        //# sourceMappingURL=ddzsingle_score_data.js.map
        