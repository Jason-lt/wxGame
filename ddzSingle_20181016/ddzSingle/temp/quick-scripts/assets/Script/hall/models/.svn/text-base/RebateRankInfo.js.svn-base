(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/RebateRankInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a334dJgQhxCTIL8anNLyg6R', 'RebateRankInfo', __filename);
// Script/hall/models/RebateRankInfo.js

"use strict";

// rebate_rank_info.js

// created by wangjunpeng 16.05.26

// 本周排行榜数据

hall.RebateRankInfo = cc.Class({
	ctor: function ctor() {
		this.m_leftTime = 0;
		this.m_rank = "";
		this.m_totalWin = 0;
		this.m_reward = "";
		this._showHelp = "";

		this._rankDate = [];
		this._rewardDesc = "";
		this._rewardConf = [];
		this.m_rankInfo = null;
	},
	parase: function parase(data) {
		if (!data) {
			return;
		}
		this.m_leftTime = data["leftTime"];
		this._rankDate = data["rankDatas"];
		this._rewardConf = data["showRewardConf"];
		this._showHelp = data["showHelp"];
		this.m_rank = data["rankInfo"];
		this.m_rankInfo = data["myRankInfo"];
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
        //# sourceMappingURL=RebateRankInfo.js.map
        