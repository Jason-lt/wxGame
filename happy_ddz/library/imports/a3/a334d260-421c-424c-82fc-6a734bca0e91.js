"use strict";
cc._RF.push(module, 'a334dJgQhxCTIL8anNLyg6R', 'RebateRankInfo');
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