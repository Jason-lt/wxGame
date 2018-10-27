(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/singleAI/ddzsingle_config.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '76cd77siTpP+os7pq6SPTAW', 'ddzsingle_config', __filename);
// Script/ComponentScript/singleAI/ddzsingle_config.js

"use strict";

/**
 * Created by tuyoo on 2018/10/24.
 */
ddz.gameConfig = {

    //机器人带入
    dragInConfig: [{
        "playerGold": [0, 199],
        "baseScore": 1,
        "AIGold": [99, 398]
    }, {
        "playerGold": [200, 499],
        "baseScore": 2,
        "AIGold": [100, 998]
    }, {
        "playerGold": [500, 999],
        "baseScore": 5,
        "AIGold": [250, 1998]
    }, {
        "playerGold": [1000, 1999],
        "baseScore": 10,
        "AIGold": [500, 3998]
    }, {
        "playerGold": [2000, 4999],
        "baseScore": 20,
        "AIGold": [1000, 9998]
    }, {
        "playerGold": [5000, 9999],
        "baseScore": 50,
        "AIGold": [2500, 19998]
    }, {
        "playerGold": [10000, 19999],
        "baseScore": 100,
        "AIGold": [5000, 39998]
    }, {
        "playerGold": [20000, 49999],
        "baseScore": 200,
        "AIGold": [10000, 99999]
    }, {
        "playerGold": [50000, 99999],
        "baseScore": 500,
        "AIGold": [25000, 199998]
    }],

    //分享间隔
    shareInterval: 3,
    shareVideoConfig: {
        "bsgsCity": {
            "doubleHalve": {
                "type": "share"
            },
            "reStart": {
                "type": "share"
            },
            "jiPaiQi": {
                "type": "share"
            }
        },
        "otherCity": {
            "doubleHalve": {
                "type": "share"
            },
            "reStart": {
                "type": "share"
            },
            "jiPaiQi": {
                "type": "share"
            }
        }
    },
    shareConfig: {
        "100": [{
            "sharePicUrl": "https://richqn.nalrer.cn/dizhu/res/raw-assets/resources/share/b0c196210c009ae566d414918b2fc4e0.jpg",
            "shareContent": "四川方言斗地主，实在太搞笑了～",
            "sharePointId": "1376",
            "shareSchemeId": "28143052",
            "extraAdd": [],
            "weight": 10,
            "area": [],
            "filter_time": [],
            "filter_user": []
        }],
        "101": [{
            "sharePicUrl": "https://richqn.nalrer.cn/dizhu/res/raw-assets/resources/share/b0c196210c009ae566d414918b2fc4e0.jpg",
            "shareContent": "四川方言斗地主，实在太搞笑了～",
            "sharePointId": "1377",
            "shareSchemeId": "28143052",
            "extraAdd": [],
            "weight": 10,
            "area": [],
            "filter_time": [],
            "filter_user": []
        }],
        "102": [{
            "sharePicUrl": "https://richqn.nalrer.cn/dizhu/res/raw-assets/resources/share/b0c196210c009ae566d414918b2fc4e0.jpg",
            "shareContent": "四川方言斗地主，实在太搞笑了～",
            "sharePointId": "1378",
            "shareSchemeId": "28143052",
            "extraAdd": [],
            "weight": 10,
            "area": [],
            "filter_time": [],
            "filter_user": []
        }],
        "103": [{
            "sharePicUrl": "https://richqn.nalrer.cn/dizhu/res/raw-assets/resources/share/b0c196210c009ae566d414918b2fc4e0.jpg",
            "shareContent": "四川方言斗地主，实在太搞笑了～",
            "sharePointId": "1379",
            "shareSchemeId": "28143052",
            "extraAdd": [],
            "weight": 10,
            "area": [],
            "filter_time": [],
            "filter_user": []
        }] },

    getShareVideoConfigToCity: function getShareVideoConfigToCity() {
        var _config;
        if (ty.UserInfo.isInBSGS) {
            _config = ddz.gameConfig.shareVideoConfig["bsgsCity"];
        } else {
            _config = ddz.gameConfig.shareVideoConfig["otherCity"];
        }
        return _config;
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
        //# sourceMappingURL=ddzsingle_config.js.map
        