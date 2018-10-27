"use strict";
cc._RF.push(module, '8b9bak3YyZGXr8t6xzwaMc6', 'LoginRewardInfo');
// Script/hall/models/LoginRewardInfo.js

"use strict";

// created by wangjunpeng 16.3.7

hall.LoginRewardInfo = cc.Class({
  ctor: function ctor() {
    this.m_rewardstate = []; //  ["CHIP",300,2]   2 代表已经领取状态 1 即将领取

    this.m_index = null;
    this.m_rewardObj = null;
    this.m_extraRewardObj = null;
  },
  parse: function parse(params) {
    if (params) {
      this.m_rewardstate = params["rewardstate"];

      this.m_index = params["lottery_index"];
      this.m_rewardObj = params["rewards"][0];
      this.m_extraRewardObj = params["extra_rewards"][0];
    }
  }
});

cc._RF.pop();