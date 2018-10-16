(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/LoginInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '41856/8nO5Lu6prm/0PskCg', 'LoginInfo', __filename);
// Script/hall/models/LoginInfo.js

"use strict";

/**
 * Created by Eava.wu on 14-4-16.
 * TODO:用户连续登录天数，领取奖励的Model
 */
hall.LoginInfo = cc.Class({
    ctor: function ctor() {
        this.m_rewardstate = []; //  ["CHIP",300,2]   2 代表已经领取状态 1 即将领取
        this.m_vipReward = null; //
    },
    parse: function parse(params) {
        if (params) {
            this.m_rewardstate = params["rewardstate"];
            this.m_vipReward = params["vip_reward"];
        }
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
        //# sourceMappingURL=LoginInfo.js.map
        